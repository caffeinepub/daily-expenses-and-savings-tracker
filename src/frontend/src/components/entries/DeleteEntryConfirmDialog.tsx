import { useDeleteEntry } from '../../hooks/queries/useEntries';
import { Entry, EntryType } from '../../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { formatINR } from '../../utils/currency';

interface DeleteEntryConfirmDialogProps {
  entry: Entry;
  onClose: () => void;
}

export default function DeleteEntryConfirmDialog({ entry, onClose }: DeleteEntryConfirmDialogProps) {
  const deleteEntry = useDeleteEntry();

  const handleDelete = async () => {
    try {
      await deleteEntry.mutateAsync(entry.id);
      toast.success('Entry deleted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to delete entry. Please try again.');
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Entry</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this {entry.entryType === EntryType.expense ? 'expense' : 'saving'} of {formatINR(entry.amount)} from {format(new Date(Number(entry.date) / 1_000_000), 'PP')}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteEntry.isPending}>
            {deleteEntry.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
