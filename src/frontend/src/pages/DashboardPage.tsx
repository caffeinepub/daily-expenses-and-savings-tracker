import { useState, useMemo } from 'react';
import { useGetDashboard } from '../hooks/queries/useDashboard';
import { useGetEntries } from '../hooks/queries/useEntries';
import { EntryType } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PeriodSelector from '../components/dashboard/PeriodSelector';
import AnalyticsSection from '../components/analytics/AnalyticsSection';
import StatementExportCard from '../components/statements/StatementExportCard';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { formatINR } from '../utils/currency';

export default function DashboardPage() {
  const { data: dashboard, isLoading: dashboardLoading } = useGetDashboard();
  const { data: entries = [], isLoading: entriesLoading } = useGetEntries();
  
  const [startDate, setStartDate] = useState<Date | undefined>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date | undefined>(endOfMonth(new Date()));

  const filteredData = useMemo(() => {
    if (!startDate && !endDate) {
      return {
        totalExpenses: dashboard?.summary.totalExpenses || 0,
        totalSavings: dashboard?.summary.totalSavings || 0,
        netBalance: dashboard?.summary.netBalance || 0,
        categoryBreakdown: dashboard?.categoryBreakdown || [],
      };
    }

    const filtered = entries.filter((entry) => {
      const entryDate = new Date(Number(entry.date) / 1_000_000);
      if (startDate && entryDate < startDate) return false;
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (entryDate > endOfDay) return false;
      }
      return true;
    });

    const totalExpenses = filtered
      .filter((e) => e.entryType === EntryType.expense)
      .reduce((sum, e) => sum + e.amount, 0);

    const totalSavings = filtered
      .filter((e) => e.entryType === EntryType.saving)
      .reduce((sum, e) => sum + e.amount, 0);

    const categoryMap = new Map<string, number>();
    filtered.forEach((entry) => {
      if (entry.category) {
        categoryMap.set(entry.category, (categoryMap.get(entry.category) || 0) + entry.amount);
      }
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, total]) => ({
      category,
      total,
    }));

    return {
      totalExpenses,
      totalSavings,
      netBalance: totalSavings - totalExpenses,
      categoryBreakdown,
    };
  }, [entries, dashboard, startDate, endDate]);

  const isLoading = dashboardLoading || entriesLoading;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Overview of your financial activity</p>
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Period</CardTitle>
        </CardHeader>
        <CardContent>
          <PeriodSelector
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-8 text-center text-sm sm:text-base text-muted-foreground">
            Loading dashboard...
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-destructive">
                  {formatINR(filteredData.totalExpenses)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Savings</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  {formatINR(filteredData.totalSavings)}
                </div>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 md:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Net Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-xl sm:text-2xl font-bold ${
                    filteredData.netBalance >= 0 ? 'text-primary' : 'text-destructive'
                  }`}
                >
                  {formatINR(filteredData.netBalance)}
                </div>
              </CardContent>
            </Card>
          </div>

          {filteredData.categoryBreakdown.length > 0 && (
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5 sm:space-y-3">
                  {filteredData.categoryBreakdown
                    .sort((a, b) => b.total - a.total)
                    .map((item) => (
                      <div key={item.category} className="flex items-center justify-between text-sm sm:text-base">
                        <span className="font-medium truncate mr-2">{item.category}</span>
                        <span className="text-muted-foreground flex-shrink-0">{formatINR(item.total)}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <AnalyticsSection entries={entries} />
          
          <StatementExportCard entries={entries} />
        </>
      )}
    </div>
  );
}
