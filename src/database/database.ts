import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";
import {
  AllTab,
  SessionSnapshot,
  TimeData,
  TODO,
  CurrentActivityData,
  ActiveSession,
} from "../tracking/types";

const dbPath = path.join(app.getPath("userData"), "tracker.sqlite");
const db = new Database(dbPath);

export type GetActiveSessionsDateRange = {
  start: Date;
  end: Date;
};

export type GetActiveSessionsReturn = {
  data: ActiveSession[];
  totalPages: number;
};

function toSqlDate(date: Date | string): string {
  return new Date(date).toISOString().slice(0, 19).replace("T", " ");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS active_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_name TEXT NOT NULL,
    platform TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME
  );

  CREATE TABLE IF NOT EXISTS session_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    snapshot_time DATETIME NOT NULL,
    title TEXT,
    memory_usage INTEGER,
    FOREIGN KEY (session_id) REFERENCES active_sessions(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS all_tabs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tab_name TEXT NOT NULL,
    first_seen DATETIME NOT NULL,
    last_seen DATETIME
  );

  CREATE TABLE IF NOT EXISTS session_all_tabs (
    session_id INTEGER NOT NULL,
    tab_id INTEGER NOT NULL,
    first_opened DATETIME NOT NULL,
    last_closed DATETIME,
    PRIMARY KEY (session_id, tab_id),
    FOREIGN KEY (session_id) REFERENCES active_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (tab_id) REFERENCES all_tabs(id) ON DELETE CASCADE
  );
`);

export function addOrUpdateAllTab(
  sessionId: number,
  tabName: string,
  opened: Date
) {
  const stmt = db.prepare(`
    INSERT INTO all_tabs (session_id, tab_name, first_opened)
    VALUES (?, ?, ?)
    ON CONFLICT(session_id, tab_name) DO NOTHING
  `);
  stmt.run(sessionId, tabName, opened.toISOString());
}

export function closeAllTab(sessionId: number, tabName: string, closed: Date) {
  const stmt = db.prepare(`
    UPDATE all_tabs
    SET last_closed = ?
    WHERE session_id = ? AND tab_name = ?
  `);
  stmt.run(closed.toISOString(), sessionId, tabName);
}

export function startSession(
  appName: string,
  platform: string,
  startTime: Date
): number {
  const stmt = db.prepare(`
    INSERT INTO active_sessions (app_name, platform, start_time)
    VALUES (?, ?, ?)
  `);
  const result = stmt.run(appName, platform, startTime.toISOString());
  return result.lastInsertRowid as number;
}

export function endSession(sessionId: number, endTime: Date) {
  const stmt = db.prepare(`
    UPDATE active_sessions
    SET end_time = ?
    WHERE id = ?
  `);
  stmt.run(endTime.toISOString(), sessionId);
}

const insertSnapshotStmt = db.prepare(`
  INSERT INTO session_snapshots (session_id, snapshot_time, title, memory_usage)
  VALUES (?, ?, ?, ?)
`);

const insertSnapshotsTransaction = db.transaction(
  (snapshots: Omit<SessionSnapshot, "id">[]) => {
    for (const s of snapshots) {
      insertSnapshotStmt.run(
        s.sessionId,
        s.snapshotTime.toISOString(),
        s.title,
        s.memoryUsage
      );
    }
  }
);

export function addSnapshotsBatch(snapshots: Omit<SessionSnapshot, "id">[]) {
  if (!snapshots.length) return;
  insertSnapshotsTransaction(snapshots);
}

export function getAllSessions() {
  const stmt = db.prepare(
    `SELECT * FROM active_sessions ORDER BY start_time DESC`
  );
  return stmt.all();
}

export function getSnapshotsForSession(sessionId: number) {
  const stmt = db.prepare(`
    SELECT * FROM session_snapshots
    WHERE session_id = ?
    ORDER BY snapshot_time ASC
  `);
  return stmt.all(sessionId);
}

export function getTotalTimeByApp() {
  const stmt = db.prepare(`
    SELECT app_name,
           SUM(strftime('%s', COALESCE(end_time, CURRENT_TIMESTAMP)) - strftime('%s', start_time)) AS total_seconds
    FROM active_sessions
    GROUP BY app_name
    ORDER BY total_seconds DESC
  `);
  return stmt.all();
}

export function addOrUpdateGlobalTab(tabName: string, seenAt: Date): number {
  const selectStmt = db.prepare(`SELECT id FROM all_tabs WHERE tab_name = ?`);
  const existing = selectStmt.get(tabName) as AllTab;

  if (existing) {
    const updateStmt = db.prepare(`
      UPDATE all_tabs
      SET last_seen = ?
      WHERE id = ?
    `);
    updateStmt.run(seenAt.toISOString(), existing.id);
    return existing.id;
  } else {
    const insertStmt = db.prepare(`
      INSERT INTO all_tabs (tab_name, first_seen, last_seen)
      VALUES (?, ?, ?)
    `);
    const result = insertStmt.run(
      tabName,
      seenAt.toISOString(),
      seenAt.toISOString()
    );
    return result.lastInsertRowid as number;
  }
}

export function addOrUpdateSessionTab(
  sessionId: number,
  tabName: string,
  timestamp: Date
) {
  const tabId = addOrUpdateGlobalTab(tabName, timestamp);

  const selectStmt = db.prepare(`
    SELECT first_opened, last_closed
    FROM session_all_tabs
    WHERE session_id = ? AND tab_id = ?
  `);
  const existing = selectStmt.get(sessionId, tabId);

  if (existing) {
    const updateStmt = db.prepare(`
      UPDATE session_all_tabs
      SET last_closed = ?
      WHERE session_id = ? AND tab_id = ?
    `);
    updateStmt.run(timestamp.toISOString(), sessionId, tabId);
  } else {
    const insertStmt = db.prepare(`
      INSERT INTO session_all_tabs (session_id, tab_id, first_opened, last_closed)
      VALUES (?, ?, ?, ?)
    `);
    insertStmt.run(
      sessionId,
      tabId,
      timestamp.toISOString(),
      timestamp.toISOString()
    );
  }
}

export function getTabsForSession(sessionId: number) {
  const stmt = db.prepare(`
    SELECT t.id as tabId, t.tab_name, st.first_opened, st.last_closed
    FROM all_tabs t
    JOIN session_all_tabs st ON t.id = st.tab_id
    WHERE st.session_id = ?
  `);
  return stmt.all(sessionId);
}

export function getAllTabs() {
  const stmt = db.prepare(`
    SELECT id, tab_name, first_seen, last_seen
    FROM all_tabs
  `);
  return stmt.all();
}

export function getUsageStats(
  sinceMinutes = 60,
  includeLive = true
): TimeData[] {
  const sinceArg = `-${sinceMinutes} minutes`;

  const sql = `
    WITH recent AS (
      SELECT
        ss.id,
        ss.session_id,
        ss.snapshot_time AS snapshot_time,
        a.app_name,
        a.end_time
      FROM session_snapshots ss
      JOIN active_sessions a ON ss.session_id = a.id
      WHERE ss.snapshot_time >= datetime('now', ?)
      ORDER BY ss.session_id, ss.snapshot_time
    ),
    with_next AS (
      SELECT
        session_id,
        app_name,
        snapshot_time,
        LEAD(snapshot_time) OVER (PARTITION BY session_id ORDER BY snapshot_time) AS next_time,
        end_time
      FROM recent
    )
    SELECT
      app_name AS name,
      SUM(
        CAST(
          (
            julianday(
              COALESCE(
                next_time,
                CASE WHEN end_time IS NOT NULL THEN end_time ELSE datetime('now') END
              )
            )
            - julianday(snapshot_time)
          ) * 86400
          AS INTEGER
        )
      ) as time
    FROM with_next
    ${includeLive ? "" : "WHERE next_time IS NOT NULL OR end_time IS NOT NULL"}
    GROUP BY app_name
    ORDER BY time DESC
  `;

  const rows: TimeData[] = db.prepare(sql).all(sinceArg) as TimeData[];

  return (rows || []).map((r) => ({ name: r.name, time: Number(r.time || 0) }));
}

export function getCurrentActivity(): CurrentActivityData | null {
  const sql = `
    SELECT
      a.app_name AS name,
      a.platform AS platform,
      a.start_time AS start_time,
      ss.title AS title,
      ss.snapshot_time AS snapshot_time
    FROM active_sessions a
    LEFT JOIN session_snapshots ss
      ON ss.session_id = a.id
    WHERE a.end_time IS NULL
    ORDER BY ss.snapshot_time DESC
    LIMIT 1
  `;

  const row = db.prepare(sql).get() as TODO;

  if (!row) return null;

  const now = new Date();
  const start = new Date(row.start_time);
  const duration = Math.floor((now.getTime() - start.getTime()) / 1000);

  return {
    name: row.name,
    title: row.title || "",
    duration,
    platform: row.platform,
  };
}

export function getActiveSessions(
  range?: GetActiveSessionsDateRange,
  page = 1,
  pageSize = 10,
  search?: string
): GetActiveSessionsReturn | null {
  const params: { search?: string; start?: string; end?: string } = {};
  const filters: string[] = [];
  if (range) {
    filters.push(`start_time >= @start AND end_time <= @end`);
    params.start = toSqlDate(range.start);
    params.end = toSqlDate(range.end);
  }

  if (search) {
    filters.push(`(app_name LIKE @search OR platform LIKE @search)`);
    params.search = `%${search}%`;
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const countSql = `SELECT COUNT(*) as total FROM active_sessions ${whereClause};`;

  const { total } = db.prepare(countSql).get(params) as { total: number };

  if (total === 0) return null;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;

  const dataSql = `
    SELECT id, app_name as appName, platform, start_time as startTime, end_time as endTime
    FROM active_sessions
    ${whereClause}
    ORDER BY startTime DESC
    LIMIT @limit OFFSET @offset;
  `;
  const rows = db.prepare(dataSql).all({
    ...params,
    limit: pageSize,
    offset,
  }) as ActiveSession[];

  return {
    data: rows,
    totalPages,
  };
}

export function getSessionSnapshots(sessionId: number) {
  const sql = `
  SELECT id, memory_usage as memoryUsage, session_id as sessionId, snapshot_time as snapshotTime, title from session_snapshots WHERE session_id = ${sessionId}
  `;

  const rows = db.prepare(sql).all() as SessionSnapshot[];

  return rows;
}
