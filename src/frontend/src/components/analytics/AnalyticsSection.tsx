import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Entry, EntryType } from '../../backend';
import { PeriodType, AnalyticsPeriod, filterEntriesByPeriod, computePieChartData } from '../../utils/analytics';
import AnalyticsPieChart from './AnalyticsPieChart';

interface AnalyticsSectionProps {
  entries: Entry[];
}

export default function AnalyticsSection({ entries }: AnalyticsSectionProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  const [periodType, setPeriodType] = useState<PeriodType>('month');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [pieChartType, setPieChartType] = useState<EntryType>(EntryType.expense);
  
  const period: AnalyticsPeriod = {
    type: periodType,
    year: selectedYear,
    month: periodType === 'month' ? selectedMonth : undefined,
  };
  
  const filteredEntries = filterEntriesByPeriod(entries, period);
  const pieChartData = computePieChartData(filteredEntries, pieChartType);
  
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Period Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="period-type">View</Label>
            <Select value={periodType} onValueChange={(value) => setPeriodType(value as PeriodType)}>
              <SelectTrigger id="period-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {periodType === 'month' && (
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger id="month">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger id="year">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* 3D Pie Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Category Breakdown</h3>
            <Tabs value={pieChartType} onValueChange={(value) => setPieChartType(value as EntryType)} className="w-auto">
              <TabsList className="h-8">
                <TabsTrigger value={EntryType.expense} className="text-xs px-3">Expenses</TabsTrigger>
                <TabsTrigger value={EntryType.saving} className="text-xs px-3">Savings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <AnalyticsPieChart data={pieChartData} type={pieChartType} />
        </div>
      </CardContent>
    </Card>
  );
}
