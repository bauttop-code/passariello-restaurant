import { useState } from 'react';
import { Calendar, Clock, ChevronDown } from 'lucide-react';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from './ui/utils';

// Utility functions
export function formatDateLabel(date: Date | null): string {
  if (!date) return 'Select date';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  if (compareDate.getTime() === today.getTime()) {
    return `Today, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }
  
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function formatTimeLabel(time24: string | null): string {
  if (!time24) return 'Select time';
  
  const [hourStr, minuteStr] = time24.split(':');
  let hour = parseInt(hourStr);
  const minute = minuteStr;
  
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  
  return `${displayHour}:${minute} ${period}`;
}

export function time24To12(time24: string): { hour12: number; minute: string; period: 'AM' | 'PM' } {
  const [hourStr, minuteStr] = time24.split(':');
  let hour = parseInt(hourStr);
  const period: 'AM' | 'PM' = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  
  return { hour12, minute: minuteStr, period };
}

export function time12To24(hour12: number, minute: string, period: 'AM' | 'PM'): string {
  let hour24 = hour12;
  
  if (period === 'PM' && hour12 !== 12) {
    hour24 = hour12 + 12;
  } else if (period === 'AM' && hour12 === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minute}`;
}

// Generate time slots (every 15 minutes)
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time24);
    }
  }
  
  return slots;
}

interface DateTimeFieldProps {
  value?: Date;
  onChange?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  className?: string;
}

export function DateTimeField({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  className,
}: DateTimeFieldProps) {
  const [internalDate, setInternalDate] = useState<Date | null>(value || null);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [timePopoverOpen, setTimePopoverOpen] = useState(false);

  const currentDate = value !== undefined ? value : internalDate;
  
  const dateLabel = formatDateLabel(currentDate);
  const timeLabel = currentDate 
    ? formatTimeLabel(`${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`)
    : 'Select time';

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const newDate = new Date(date);
    
    // Preserve time if already set
    if (currentDate) {
      newDate.setHours(currentDate.getHours());
      newDate.setMinutes(currentDate.getMinutes());
    } else {
      // Default to 12:00 PM
      newDate.setHours(12, 0, 0, 0);
    }
    
    if (value === undefined) {
      setInternalDate(newDate);
    }
    
    onChange?.(newDate);
    setDatePopoverOpen(false);
  };

  const handleTimeSelect = (time24: string) => {
    const [hourStr, minuteStr] = time24.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    const newDate = currentDate ? new Date(currentDate) : new Date();
    newDate.setHours(hour, minute, 0, 0);
    
    if (value === undefined) {
      setInternalDate(newDate);
    }
    
    onChange?.(newDate);
    setTimePopoverOpen(false);
  };

  const timeSlots = generateTimeSlots();

  // Filter time slots to show only future times if today is selected
  const availableTimeSlots = (() => {
    if (!currentDate) return timeSlots;
    
    const now = new Date();
    const selectedDate = new Date(currentDate);
    
    // Check if selected date is today
    const isToday = 
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate();
    
    if (!isToday) {
      // Future date - show all times
      return timeSlots;
    }
    
    // Today - filter to show only future times
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    return timeSlots.filter(time24 => {
      const [hourStr, minuteStr] = time24.split(':');
      const slotHour = parseInt(hourStr);
      const slotMinute = parseInt(minuteStr);
      const slotTimeInMinutes = slotHour * 60 + slotMinute;
      
      // Show times that are at least 15 minutes in the future
      return slotTimeInMinutes > currentTimeInMinutes + 15;
    });
  })();

  return (
    <div className={cn("space-y-2", className)}>
      {/* Date Field */}
      <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
        <PopoverTrigger asChild>
          <button
            className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white text-left"
            type="button"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className={cn(
                "text-sm",
                currentDate ? "text-gray-900" : "text-gray-500"
              )}>
                {dateLabel}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[150]" align="start">
          <CalendarComponent
            mode="single"
            selected={currentDate || undefined}
            onSelect={handleDateSelect}
            disabled={disabledDates}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Time Field */}
      <Popover open={timePopoverOpen} onOpenChange={setTimePopoverOpen}>
        <PopoverTrigger asChild>
          <button
            className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white text-left"
            type="button"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className={cn(
                "text-sm",
                currentDate ? "text-gray-900" : "text-gray-500"
              )}>
                {timeLabel}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 z-[150]" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
          <div className="max-h-[300px] overflow-y-auto p-1">
            {availableTimeSlots.map((time24) => (
              <button
                key={time24}
                onClick={() => handleTimeSelect(time24)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
                type="button"
              >
                {formatTimeLabel(time24)}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Example usage:
// <DateTimeField
//   value={selectedDateTime}
//   onChange={(date) => setSelectedDateTime(date)}
//   disabledDates={(date) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return date < today;
//   }}
// />