import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (seconds: number) => {
  const time: string[] = [];
  const secs = Math.floor(seconds % 60);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 60 / 60);
  const days = Math.floor(seconds / 60 / 60 / 24);

  if (days > 0) {
    time.push(days + "d");
  }
  if (hours > 0) {
    time.push(hours + "h");
  }
  if (minutes > 0) {
    time.push(minutes + "m");
  }
  {
    time.push(secs + "s");
  }

  return time.join(" ");
};

export const formatMemoryUsage = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  );
};

export const formatDate = (
  date: Date,
  type: "date" | "time" | "all" = "all"
): string => {
  const opts: Intl.DateTimeFormatOptions = {};

  if (type === "all" || type === "time") {
    opts.hour = "2-digit";
    opts.minute = "2-digit";
    opts.second = "2-digit";
  }
  if (type === "all" || type === "date") {
    opts.year = "2-digit";
    opts.month = "2-digit";
    opts.day = "2-digit";
  }

  return new Date(date).toLocaleTimeString([], opts);
};
