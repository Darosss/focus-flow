"use client";

import { ChevronDownIcon } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Label } from "./label";
import { Input } from "./input";
import { FC, useState } from "react";

export type TimeType =
  `${number}${number}:${number}${number}:${number}${number}`;

type DatePickerProps = {
  onChange: (date: Date) => void;
  withTime?: boolean;
  title?: string;
  defaultDate?: Date;
  defaultTime?: TimeType;
};

const getDateWithTime = (date: Date, time: TimeType) => {
  const newDate = date;
  const [hour, minutes, seconds] = (
    time.split(":") as [string, string, string]
  ).map((t) => Number(t));
  newDate.setHours(hour);
  newDate.setMinutes(minutes);
  newDate.setSeconds(seconds);

  return newDate;
};

export const DatePicker: FC<DatePickerProps> = ({
  onChange,
  title,
  withTime = true,
  defaultDate = new Date(),
  defaultTime = "12:00:00",
}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(
    getDateWithTime(defaultDate, defaultTime)
  );
  const [time, setTime] = useState<TimeType>(defaultTime);

  return (
    <div className="flex gap-2 p-2">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          {title} date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : title || "Select a date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date: Date) => {
                const newDate = withTime ? getDateWithTime(date, time) : date;
                setDate(newDate);
                onChange(newDate);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {withTime && (
        <div className="flex flex-col gap-3">
          <Label htmlFor="time-picker" className="px-1">
            {title} time
          </Label>
          <Input
            type="time"
            id="time-picker"
            step="1"
            onChange={(value) => {
              const newTime = value.currentTarget.value as TimeType;
              setTime(newTime);
              const newDate = withTime ? getDateWithTime(date, newTime) : date;
              setDate(newDate);
              onChange(newDate);
            }}
            value={time}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      )}
    </div>
  );
};
