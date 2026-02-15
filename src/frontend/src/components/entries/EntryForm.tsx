import { useState, useEffect } from 'react';
import { useAddOrUpdateEntry } from '../../hooks/queries/useEntries';
import { EntryType } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { EXPENSE_CATEGORIES, SAVING_CATEGORIES } from '../../constants/categories';

export default function EntryForm() {
  const [date, setDate] = useState<Date>(new Date());
  const [entryType, setEntryType] = useState<EntryType>(EntryType.expense);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const addEntry = useAddOrUpdateEntry();

  // Get the appropriate category list based on entry type
  const categoryList = entryType === EntryType.expense ? EXPENSE_CATEGORIES : SAVING_CATEGORIES;

  // Clear category when type changes if it's not valid for the new type
  useEffect(() => {
    if (category && !(categoryList as readonly string[]).includes(category)) {
      setCategory('');
    }
  }, [entryType, category, categoryList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }

    if (!category) {
      toast.error('Please select a category');
      return;
    }

    try {
      await addEntry.mutateAsync({
        id: null,
        date: BigInt(date.getTime() * 1_000_000),
        entryType,
        amount: amountNum,
        category: category,
        note: note.trim() || null,
      });

      toast.success(`${entryType === EntryType.expense ? 'Expense' : 'Saving'} added successfully!`);
      setAmount('');
      setCategory('');
      setNote('');
      setDate(new Date());
    } catch (error) {
      toast.error('Failed to add entry. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Add New Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10 text-sm"
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{format(date, 'PPP')}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={entryType === EntryType.expense ? 'default' : 'outline'}
                  className="flex-1 h-10 text-sm btn-interactive"
                  onClick={() => setEntryType(EntryType.expense)}
                >
                  Expense
                </Button>
                <Button
                  type="button"
                  variant={entryType === EntryType.saving ? 'default' : 'outline'}
                  className="flex-1 h-10 text-sm btn-interactive"
                  onClick={() => setEntryType(EntryType.saving)}
                >
                  Saving
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm">Category *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category" className="h-10 text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm">Note (optional)</Label>
            <Textarea
              id="note"
              placeholder="Add any additional details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="text-sm resize-none"
            />
          </div>

          <Button type="submit" className="w-full h-10 sm:h-9 text-sm btn-interactive" disabled={addEntry.isPending}>
            <Plus className="mr-2 h-4 w-4" />
            {addEntry.isPending ? 'Adding...' : 'Add Entry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
