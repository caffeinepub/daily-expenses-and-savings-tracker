import { useState, useMemo } from 'react';
import { useGetEntries } from '../../hooks/queries/useEntries';
import { Entry, EntryType } from '../../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import EditEntryDialog from './EditEntryDialog';
import DeleteEntryConfirmDialog from './DeleteEntryConfirmDialog';
import EntriesEmptyState from './EntriesEmptyState';
import EntriesMobileList from './EntriesMobileList';
import { formatINR } from '../../utils/currency';

type FilterType = 'all' | 'expense' | 'saving';

export default function EntriesTable() {
  const { data: entries = [], isLoading } = useGetEntries();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<Entry | null>(null);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (filterType !== 'all' && entry.entryType !== filterType) {
        return false;
      }

      const entryDate = new Date(Number(entry.date) / 1_000_000);
      if (startDate && entryDate < startDate) {
        return false;
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (entryDate > endOfDay) {
          return false;
        }
      }

      return true;
    });
  }, [entries, filterType, startDate, endDate]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm sm:text-base text-muted-foreground">
          Loading entries...
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return <EntriesEmptyState />;
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Your Entries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Filter by Type</Label>
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                  className="flex-1 h-9 text-xs sm:text-sm"
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'expense' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('expense')}
                  className="flex-1 h-9 text-xs sm:text-sm"
                >
                  Expenses
                </Button>
                <Button
                  variant={filterType === 'saving' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('saving')}
                  className="flex-1 h-9 text-xs sm:text-sm"
                >
                  Savings
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left font-normal h-9 text-xs sm:text-sm"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{startDate ? format(startDate, 'PP') : 'Pick a date'}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left font-normal h-9 text-xs sm:text-sm"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{endDate ? format(endDate, 'PP') : 'Pick a date'}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {(startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStartDate(undefined);
                setEndDate(undefined);
              }}
              className="h-8 text-xs sm:text-sm"
            >
              Clear Filters
            </Button>
          )}

          {/* Mobile view */}
          <div className="block lg:hidden">
            <EntriesMobileList
              entries={filteredEntries}
              onEdit={setEditingEntry}
              onDelete={setDeletingEntry}
            />
          </div>

          {/* Desktop view */}
          <div className="hidden lg:block rounded-md border overflow-x-auto">
            {filteredEntries.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No entries found matching your filters.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => {
                    const entryDate = new Date(Number(entry.date) / 1_000_000);
                    return (
                      <TableRow key={entry.id.toString()}>
                        <TableCell className="whitespace-nowrap">{format(entryDate, 'PP')}</TableCell>
                        <TableCell>
                          <Badge
                            variant={entry.entryType === EntryType.expense ? 'destructive' : 'default'}
                          >
                            {entry.entryType === EntryType.expense ? 'Expense' : 'Saving'}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`font-medium ${
                            entry.entryType === EntryType.expense ? 'text-destructive' : 'text-primary'
                          }`}
                        >
                          {formatINR(entry.amount)}
                        </TableCell>
                        <TableCell>
                          {entry.category ? (
                            <Badge variant="outline">{entry.category}</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {entry.note || <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingEntry(entry)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingEntry(entry)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {editingEntry && (
        <EditEntryDialog entry={editingEntry} onClose={() => setEditingEntry(null)} />
      )}

      {deletingEntry && (
        <DeleteEntryConfirmDialog entry={deletingEntry} onClose={() => setDeletingEntry(null)} />
      )}
    </>
  );
}
