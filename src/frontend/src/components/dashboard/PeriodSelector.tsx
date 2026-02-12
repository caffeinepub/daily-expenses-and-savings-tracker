import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface PeriodSelectorProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

export default function PeriodSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: PeriodSelectorProps) {
  const setCurrentMonth = () => {
    const now = new Date();
    onStartDateChange(startOfMonth(now));
    onEndDateChange(endOfMonth(now));
  };

  const clearDates = () => {
    onStartDateChange(undefined);
    onEndDateChange(undefined);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={setCurrentMonth} className="h-9 text-xs sm:text-sm">
          Current Month
        </Button>
        <Button variant="outline" size="sm" onClick={clearDates} className="h-9 text-xs sm:text-sm">
          All Time
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto justify-start text-left font-normal h-9 text-xs sm:text-sm"
            >
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{startDate ? format(startDate, 'PP') : 'Start date'}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={startDate} onSelect={onStartDateChange} />
          </PopoverContent>
        </Popover>
        <span className="text-muted-foreground text-xs sm:text-sm hidden sm:inline">to</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto justify-start text-left font-normal h-9 text-xs sm:text-sm"
            >
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{endDate ? format(endDate, 'PP') : 'End date'}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={endDate} onSelect={onEndDateChange} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
