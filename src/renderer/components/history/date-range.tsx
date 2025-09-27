import { FC, useState } from "react";
import { DatePicker } from "../ui/date-picker";
import { Button } from "../ui/button";
import { Clock } from "lucide-react";

type DateRangeProps = { onChange: (start: Date, end: Date) => void };

export const DateRange: FC<DateRangeProps> = ({ onChange }) => {
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [withTime, setWithTime] = useState(false);
  return (
    <div className="flex justify-between gap-2">
      <Button variant="outline" onClick={() => setWithTime(!withTime)}>
        {withTime ? "-" : "+"}
        <Clock className="w-4 h-4" />
      </Button>
      <DatePicker
        title="Start"
        onChange={(date) => {
          setStart(date);
          onChange(date, end);
        }}
        withTime={withTime}
      />
      <DatePicker
        title="End"
        onChange={(date) => {
          setEnd(date);
          onChange(start, date);
        }}
        defaultTime="13:00:00"
        withTime={withTime}
      />
    </div>
  );
};
