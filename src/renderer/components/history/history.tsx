"use client";

import { History, Search, Filter, Download } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { HistoryActivity } from "../../../renderer/types";
import { Pagination } from "../ui/pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { HistoryContent } from "./content";
import { DateRange } from "./date-range";
import { formatDate, formatTime } from "../../lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const HistoryView = () => {
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const [search, setSearch] = useState<string | null>(null);
  const [currentRange, setCurrentRange] =
    useState<Parameters<typeof window.trackerAPI.getHistoryActivity>[0]>();
  const [currentHistory, setCurrentHistory] = useState<HistoryActivity>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const trackerApi = window.trackerAPI;
        const result = await trackerApi.getHistoryActivity(
          currentRange,
          currentPage,
          10,
          search
        );

        setCurrentHistory(result?.data || []);
        setTotalPages(result?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch history:", error);
        setCurrentHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [currentRange, currentPage, search]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">History</h1>
            <p className="text-muted-foreground">
              Browse historical window data and activity logs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="border-b border-border p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search apps or platforms"
              className="pl-10"
              onChange={(e) => {
                setSearch(e.currentTarget.value || null);
              }}
            />
          </div>
          <DateRange
            onChange={(start, end) => {
              setCurrentRange({ start, end });
            }}
          />
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Window History
            </CardTitle>
            <CardDescription>
              Chronological list of window events and activities
              <span className="text-xs text-primary">
                {" "}
                (start / name / duration)
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="h-full">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading history...
                </div>
              ) : currentHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No history data found
                </div>
              ) : (
                <Accordion
                  type="single"
                  collapsible
                  onValueChange={(state) => setCurrentSessionId(Number(state))}
                >
                  {currentHistory.map((item, index) => {
                    return (
                      <AccordionItem
                        value={item.id.toString()}
                        key={index}
                        className="items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <AccordionTrigger className="text-sm text-muted-foreground font-mono flex w-full">
                          <div className="w-1/5">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="text-xs">
                                  {formatTime(
                                    (new Date().getTime() -
                                      new Date(item.startTime).getTime()) /
                                      1000
                                  )}{" "}
                                  ago
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                {formatDate(item.startTime)}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="w-3/5">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  !item.endTime ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {item?.endTime
                                  ? formatDate(item.endTime)
                                  : "Active"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">
                                {item.appName}
                              </span>{" "}
                              - {item.platform}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground w-full">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="default" className="text-xs">
                                  {formatTime(
                                    (new Date(
                                      item.endTime || new Date()
                                    ).getTime() -
                                      new Date(item.startTime).getTime()) /
                                      1000
                                  )}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                {formatDate(item.endTime)}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="flex items-center gap-4 w-full">
                          {currentSessionId && (
                            <HistoryContent sessionId={currentSessionId} />
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                wrapperClassName="sticky bottom-0 bg-muted-foreground"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
