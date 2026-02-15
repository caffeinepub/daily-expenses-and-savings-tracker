import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Entry, EntryType } from '../../backend';
import { StatementPeriod, StatementPeriodType, filterEntriesForStatement, getPeriodLabel } from '../../utils/statementPeriod';
import { generateStatementPDF } from '../../utils/statementPdf';
import { generateStatementXLS } from '../../utils/statementXls';
import { toast } from 'sonner';

interface StatementExportCardProps {
  entries: Entry[];
}

export default function StatementExportCard({ entries }: StatementExportCardProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  const [periodType, setPeriodType] = useState<StatementPeriodType>('month');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const period: StatementPeriod = {
    type: periodType,
    year: selectedYear,
    month: periodType === 'month' ? selectedMonth : undefined,
  };
  
  const filteredEntries = filterEntriesForStatement(entries, period);
  const periodLabel = getPeriodLabel(period);
  
  const totalExpenses = filteredEntries
    .filter((e) => e.entryType === EntryType.expense)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalSavings = filteredEntries
    .filter((e) => e.entryType === EntryType.saving)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const netBalance = totalSavings - totalExpenses;
  
  const hasEntries = filteredEntries.length > 0;
  
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const handleDownloadPDF = async () => {
    if (!hasEntries) return;
    
    setIsGenerating(true);
    try {
      const blob = generateStatementPDF({
        entries: filteredEntries,
        periodLabel,
        totalExpenses,
        totalSavings,
        netBalance,
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `statement-${periodLabel.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('PDF statement downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF statement');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownloadCSV = async () => {
    if (!hasEntries) return;
    
    setIsGenerating(true);
    try {
      const blob = generateStatementXLS({
        entries: filteredEntries,
        periodLabel,
        totalExpenses,
        totalSavings,
        netBalance,
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `statement-${periodLabel.replace(/\s+/g, '-')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('CSV statement downloaded successfully');
    } catch (error) {
      console.error('CSV generation error:', error);
      toast.error('Failed to generate CSV statement');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Statement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Period Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="statement-period-type">Period</Label>
            <Select value={periodType} onValueChange={(value) => setPeriodType(value as StatementPeriodType)}>
              <SelectTrigger id="statement-period-type">
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
              <Label htmlFor="statement-month">Month</Label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger id="statement-month">
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
            <Label htmlFor="statement-year">Year</Label>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger id="statement-year">
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
        
        {/* Info */}
        <div className="text-sm text-muted-foreground">
          {hasEntries ? (
            <p>{filteredEntries.length} entries found for {periodLabel}</p>
          ) : (
            <p className="text-destructive">No entries found for {periodLabel}</p>
          )}
        </div>
        
        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleDownloadPDF}
            disabled={!hasEntries || isGenerating}
            className="flex-1 btn-interactive"
            variant="default"
          >
            <FileText className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </Button>
          <Button
            onClick={handleDownloadCSV}
            disabled={!hasEntries || isGenerating}
            className="flex-1 btn-interactive"
            variant="secondary"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Download CSV'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
