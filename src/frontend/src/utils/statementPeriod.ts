import { Entry } from '../backend';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export type StatementPeriodType = 'month' | 'year';

export interface StatementPeriod {
  type: StatementPeriodType;
  month?: number; // 0-11
  year: number;
}

export function getStatementDateRange(period: StatementPeriod): { start: Date; end: Date } {
  if (period.type === 'month' && period.month !== undefined) {
    const date = new Date(period.year, period.month, 1);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
    };
  } else {
    const date = new Date(period.year, 0, 1);
    return {
      start: startOfYear(date),
      end: endOfYear(date),
    };
  }
}

export function filterEntriesForStatement(entries: Entry[], period: StatementPeriod): Entry[] {
  const { start, end } = getStatementDateRange(period);
  return entries.filter((entry) => {
    const entryDate = new Date(Number(entry.date) / 1_000_000);
    return entryDate >= start && entryDate <= end;
  });
}

export function getPeriodLabel(period: StatementPeriod): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  if (period.type === 'month' && period.month !== undefined) {
    return `${monthNames[period.month]} ${period.year}`;
  } else {
    return `Year ${period.year}`;
  }
}
