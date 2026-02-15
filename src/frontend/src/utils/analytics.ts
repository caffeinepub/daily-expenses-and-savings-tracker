import { Entry, EntryType } from '../backend';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, eachMonthOfInterval, format } from 'date-fns';

export type PeriodType = 'month' | 'year';

export interface AnalyticsPeriod {
  type: PeriodType;
  month?: number; // 0-11
  year: number;
}

export interface BarChartDataPoint {
  label: string;
  expenses: number;
  savings: number;
}

export interface PieChartDataPoint {
  category: string;
  value: number;
  percentage: number;
}

export function getDateRangeForPeriod(period: AnalyticsPeriod): { start: Date; end: Date } {
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

export function filterEntriesByPeriod(entries: Entry[], period: AnalyticsPeriod): Entry[] {
  const { start, end } = getDateRangeForPeriod(period);
  return entries.filter((entry) => {
    const entryDate = new Date(Number(entry.date) / 1_000_000);
    return entryDate >= start && entryDate <= end;
  });
}

export function computeBarChartData(entries: Entry[], period: AnalyticsPeriod): BarChartDataPoint[] {
  const { start, end } = getDateRangeForPeriod(period);
  
  if (period.type === 'year') {
    // Monthly buckets for year view
    const months = eachMonthOfInterval({ start, end });
    return months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthEntries = entries.filter((entry) => {
        const entryDate = new Date(Number(entry.date) / 1_000_000);
        return entryDate >= monthStart && entryDate <= monthEnd;
      });
      
      const expenses = monthEntries
        .filter((e) => e.entryType === EntryType.expense)
        .reduce((sum, e) => sum + e.amount, 0);
      
      const savings = monthEntries
        .filter((e) => e.entryType === EntryType.saving)
        .reduce((sum, e) => sum + e.amount, 0);
      
      return {
        label: format(month, 'MMM'),
        expenses,
        savings,
      };
    });
  } else {
    // Daily buckets for month view
    const days = eachDayOfInterval({ start, end });
    return days.map((day) => {
      const dayEntries = entries.filter((entry) => {
        const entryDate = new Date(Number(entry.date) / 1_000_000);
        return format(entryDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      });
      
      const expenses = dayEntries
        .filter((e) => e.entryType === EntryType.expense)
        .reduce((sum, e) => sum + e.amount, 0);
      
      const savings = dayEntries
        .filter((e) => e.entryType === EntryType.saving)
        .reduce((sum, e) => sum + e.amount, 0);
      
      return {
        label: format(day, 'd'),
        expenses,
        savings,
      };
    });
  }
}

export function computePieChartData(entries: Entry[], entryType: EntryType): PieChartDataPoint[] {
  const filtered = entries.filter((e) => e.entryType === entryType && e.category);
  
  const categoryMap = new Map<string, number>();
  filtered.forEach((entry) => {
    if (entry.category) {
      categoryMap.set(entry.category, (categoryMap.get(entry.category) || 0) + entry.amount);
    }
  });
  
  const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);
  
  return Array.from(categoryMap.entries())
    .map(([category, value]) => ({
      category,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);
}
