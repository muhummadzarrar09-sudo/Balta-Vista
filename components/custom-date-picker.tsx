'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Date helpers ───
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseDate(str: string) {
  const [y, m, d] = str.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

function isSameDay(a: string, b: string) { return a === b; }
function isBeforeOrSame(a: string, b: string) { return a <= b; }
function isAfterOrSame(a: string, b: string) { return a >= b; }

interface CustomDatePickerProps {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
}

export function CustomDatePicker({ checkIn, checkOut, onCheckInChange, onCheckOutChange }: CustomDatePickerProps) {
  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Start from the check-in month or today
  const startFrom = checkIn ? parseDate(checkIn) : { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };
  const [viewMonth, setViewMonth] = useState(startFrom.month);
  const [viewYear, setViewYear] = useState(startFrom.year);
  const [selecting, setSelecting] = useState<'checkIn' | 'checkOut'>('checkIn');

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const handleDayClick = (day: number) => {
    const dateStr = toDateStr(viewYear, viewMonth, day);
    if (dateStr < todayStr) return;

    if (selecting === 'checkIn') {
      // If they pick after current check-out, swap
      if (checkOut && dateStr > checkOut) {
        onCheckOutChange('');
      }
      onCheckInChange(dateStr);
      setSelecting('checkOut');
    } else {
      // If they pick before check-in, swap
      if (dateStr < checkIn) {
        onCheckInChange(dateStr);
        // keep selecting check-out
      } else {
        onCheckOutChange(dateStr);
        setSelecting('checkIn');
      }
    }
  };

  const isInRange = (day: number) => {
    if (!checkIn || !checkOut) return false;
    const d = toDateStr(viewYear, viewMonth, day);
    return d > checkIn && d < checkOut;
  };

  const isStart = (day: number) => isSameDay(toDateStr(viewYear, viewMonth, day), checkIn);
  const isEnd = (day: number) => isSameDay(toDateStr(viewYear, viewMonth, day), checkOut);
  const isDisabled = (day: number) => toDateStr(viewYear, viewMonth, day) < todayStr;

  const formatDisplay = (dateStr: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr + 'T12:00:00');
    return { weekday: WEEKDAYS[d.getDay()], month: MONTHS[d.getMonth()], day: d.getDate() };
  };

  const inDisplay = checkIn ? formatDisplay(checkIn) : null;
  const outDisplay = checkOut ? formatDisplay(checkOut) : null;

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Selection indicator */}
      <div className="mb-8 flex items-center justify-center gap-6 text-center">
        <button
          type="button"
          onClick={() => setSelecting('checkIn')}
          className={cn(
            'rounded-2xl border px-5 py-3 transition',
            selecting === 'checkIn'
              ? 'border-brass/50 bg-brass/10 ring-1 ring-brass/25'
              : 'border-stone/10 bg-stone/6 hover:border-stone/25'
          )}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Check-in</p>
          {inDisplay ? (
            <p className="mt-1 font-serif text-xl text-stone">{inDisplay.month} {inDisplay.day}</p>
          ) : (
            <p className="mt-1 font-serif text-xl text-muted/50">Select</p>
          )}
        </button>
        <div className="h-px w-8 bg-brass/30" />
        <button
          type="button"
          onClick={() => checkIn && setSelecting('checkOut')}
          className={cn(
            'rounded-2xl border px-5 py-3 transition',
            selecting === 'checkOut'
              ? 'border-brass/50 bg-brass/10 ring-1 ring-brass/25'
              : 'border-stone/10 bg-stone/6 hover:border-stone/25'
          )}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Check-out</p>
          {outDisplay ? (
            <p className="mt-1 font-serif text-xl text-stone">{outDisplay.month} {outDisplay.day}</p>
          ) : (
            <p className="mt-1 font-serif text-xl text-muted/50">{checkIn ? 'Select' : '—'}</p>
          )}
        </button>
      </div>

      {/* Month nav */}
      <div className="mb-5 flex items-center justify-between">
        <button type="button" onClick={prevMonth} className="flex h-10 w-10 items-center justify-center rounded-full bg-stone/8 text-muted transition hover:bg-stone/15 hover:text-stone">
          <ChevronLeft size={18} />
        </button>
        <p className="font-serif text-2xl tracking-tight text-stone">{MONTHS[viewMonth]} {viewYear}</p>
        <button type="button" onClick={nextMonth} className="flex h-10 w-10 items-center justify-center rounded-full bg-stone/8 text-muted transition hover:bg-stone/15 hover:text-stone">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="mb-3 grid grid-cols-7 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
        {WEEKDAYS.map((d) => <div key={d} className="py-1">{d}</div>)}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* Empty leading cells */}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = toDateStr(viewYear, viewMonth, day);
          const disabled = isDisabled(day);
          const start = isStart(day);
          const end = isEnd(day);
          const inRange = isInRange(day);
          const isToday = dateStr === todayStr;

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(day)}
              className={cn(
                'relative flex h-12 w-full items-center justify-center text-sm transition',
                inRange && !start && !end && 'bg-brass/10',
                start && 'rounded-l-full bg-brass text-charcoal font-bold',
                end && 'rounded-r-full bg-brass text-charcoal font-bold',
                start && end && 'rounded-full',
                !start && !end && !disabled && 'rounded-full hover:bg-stone/10',
                disabled && 'cursor-not-allowed text-stone/20',
                !disabled && !start && !end && 'text-stone/80',
                isToday && !start && !end && 'ring-1 ring-brass/30',
              )}
            >
              <span className={cn(
                'relative z-10',
                (start || end) && 'font-bold text-charcoal',
              )}>
                {day}
              </span>
            </button>
          );
        })}
      </div>

      {/* Night count */}
      {checkIn && checkOut && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted">
            <span className="font-serif text-xl text-brass">
              {Math.max(0, Math.ceil((new Date(checkOut + 'T12:00:00').getTime() - new Date(checkIn + 'T12:00:00').getTime()) / 86_400_000))}
            </span>
            {' '}night{Math.max(0, Math.ceil((new Date(checkOut + 'T12:00:00').getTime() - new Date(checkIn + 'T12:00:00').getTime()) / 86_400_000)) !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
}
