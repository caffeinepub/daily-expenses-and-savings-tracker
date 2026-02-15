import { Entry, EntryType } from '../backend';
import { formatINR } from './currency';
import { format } from 'date-fns';

export interface StatementData {
  entries: Entry[];
  periodLabel: string;
  totalExpenses: number;
  totalSavings: number;
  netBalance: number;
}

export function generateStatementXLS(data: StatementData): Blob {
  let csv = '';
  
  // Header
  csv += 'EXPENSE SAVER STATEMENT\n';
  csv += `Period: ${data.periodLabel}\n`;
  csv += `Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}\n`;
  csv += '\n';
  
  // Table header
  csv += 'Date,Type,Category,Amount,Note\n';
  
  // Entries
  const sortedEntries = [...data.entries].sort((a, b) => Number(a.date - b.date));
  
  if (sortedEntries.length === 0) {
    csv += 'No entries for this period.\n';
  } else {
    sortedEntries.forEach((entry) => {
      const entryDate = format(new Date(Number(entry.date) / 1_000_000), 'dd/MM/yyyy');
      const entryType = entry.entryType === EntryType.expense ? 'Expense' : 'Saving';
      const category = entry.category || 'N/A';
      const amount = entry.amount.toFixed(2);
      const note = entry.note ? `"${entry.note.replace(/"/g, '""')}"` : '';
      
      csv += `${entryDate},${entryType},${category},${amount},${note}\n`;
    });
  }
  
  csv += '\n';
  
  // Summary
  csv += 'SUMMARY\n';
  csv += `Total Expenses,${data.totalExpenses.toFixed(2)}\n`;
  csv += `Total Savings,${data.totalSavings.toFixed(2)}\n`;
  csv += `Net Balance,${data.netBalance.toFixed(2)}\n`;
  
  return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
}
