import { useState, useEffect } from 'react';
import { useAddOrUpdateEntry } from '../../hooks/queries/useEntries';
import { Entry, EntryType } from '../../backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface EditEntryDialogProps {
  entry: Entry;
  onClose: () => void;
}

export default function EditEntryDialog({ entry, onClose }: EditEntryDialogProps) {
  const [date, setDate] = useState<Date>(new Date(Number(entry.date) / 1_000_000));
  const [entryType, setEntryType] = useState<EntryType>(entry.entryType);
  const [amount, setAmount] = useState(entry.amount.toString());
  const [category, setCategory] = useState(entry.category || '');
  const [note, setNote] = useState(entry.note || '');

  const updateEntry = useAddOrUpdateEntry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }

    try {
      await updateEntry.mutateAsync({
        id: entry.id,
        date: BigInt(date.getTime() * 1_000_000),
        entryType,
        amount: amountNum,
        category: category.trim() || null,
        note: note.trim() || null,
      });

      toast.success('Entry updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update entry. Please try again.');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Entry</DialogTitle>
          <DialogDescription>Make changes to your entry below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={entryType === EntryType.expense ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setEntryType(EntryType.expense)}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={entryType === EntryType.saving ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setEntryType(EntryType.saving)}
              >
                Saving
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount *</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category (optional)</Label>
            <Input
              id="edit-category"
              placeholder="e.g., Food, Transport"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-note">Note (optional)</Label>
            <Textarea
              id="edit-note"
              placeholder="Add any additional details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={updateEntry.isPending}>
              {updateEntry.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
