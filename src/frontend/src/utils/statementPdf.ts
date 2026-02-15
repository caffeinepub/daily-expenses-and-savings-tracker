import { Entry, EntryType } from '../backend';
import { formatINR } from './currency';
import { format } from 'date-fns';
import { SimplePDF } from './simplePdf';

export interface StatementData {
  entries: Entry[];
  periodLabel: string;
  totalExpenses: number;
  totalSavings: number;
  netBalance: number;
}

export function generateStatementPDF(data: StatementData): Blob {
  const pdf = new SimplePDF();
  
  let y = 750;
  const lineHeight = 14;
  const margin = 50;
  
  // Title
  pdf.addText('EXPENSE SAVER STATEMENT', 200, y, 18, true);
  y -= lineHeight * 2;
  
  // Period and date
  pdf.addText(`Period: ${data.periodLabel}`, margin, y, 12, false);
  y -= lineHeight;
  pdf.addText(`Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, margin, y, 12, false);
  y -= lineHeight * 2;
  
  // Line separator
  pdf.addLine(margin, y, 562, y);
  y -= lineHeight * 1.5;
  
  // Entries header
  pdf.addText('ENTRIES', margin, y, 14, true);
  y -= lineHeight * 1.5;
  
  // Table header
  pdf.addText('Date', margin, y, 10, true);
  pdf.addText('Type', margin + 80, y, 10, true);
  pdf.addText('Category', margin + 150, y, 10, true);
  pdf.addText('Amount', margin + 300, y, 10, true);
  pdf.addText('Note', margin + 400, y, 10, true);
  y -= lineHeight;
  
  pdf.addLine(margin, y, 562, y);
  y -= lineHeight;
  
  // Entries
  const sortedEntries = [...data.entries].sort((a, b) => Number(a.date - b.date));
  
  if (sortedEntries.length === 0) {
    pdf.addText('No entries for this period.', margin, y, 10, false);
    y -= lineHeight * 2;
  } else {
    for (const entry of sortedEntries) {
      if (y < 100) {
        // Would need new page - for simplicity, we'll just stop
        pdf.addText('... (more entries)', margin, y, 10, false);
        break;
      }
      
      const entryDate = format(new Date(Number(entry.date) / 1_000_000), 'dd/MM/yyyy');
      const entryType = entry.entryType === EntryType.expense ? 'Expense' : 'Saving';
      const category = entry.category || 'N/A';
      const amount = formatINR(entry.amount);
      const note = entry.note ? (entry.note.length > 20 ? entry.note.substring(0, 20) + '...' : entry.note) : '';
      
      pdf.addText(entryDate, margin, y, 9, false);
      pdf.addText(entryType, margin + 80, y, 9, false);
      pdf.addText(category, margin + 150, y, 9, false);
      pdf.addText(amount, margin + 300, y, 9, false);
      pdf.addText(note, margin + 400, y, 9, false);
      y -= lineHeight;
    }
  }
  
  y -= lineHeight;
  pdf.addLine(margin, y, 562, y);
  y -= lineHeight * 1.5;
  
  // Summary
  pdf.addText('SUMMARY', margin, y, 14, true);
  y -= lineHeight * 1.5;
  
  pdf.addText('Total Expenses:', margin, y, 11, false);
  pdf.addText(formatINR(data.totalExpenses), margin + 200, y, 11, false);
  y -= lineHeight;
  
  pdf.addText('Total Savings:', margin, y, 11, false);
  pdf.addText(formatINR(data.totalSavings), margin + 200, y, 11, false);
  y -= lineHeight;
  
  pdf.addLine(margin, y, 562, y);
  y -= lineHeight;
  
  pdf.addText('Net Balance:', margin, y, 12, true);
  pdf.addText(formatINR(data.netBalance), margin + 200, y, 12, true);
  
  return pdf.generate();
}
