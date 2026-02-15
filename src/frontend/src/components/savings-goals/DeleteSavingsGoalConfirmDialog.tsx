import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useDeleteSavingsGoal } from '../../hooks/queries/useSavingsGoals';
import { SavingsGoal } from '../../backend';
import { toast } from 'sonner';

interface DeleteSavingsGoalConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: SavingsGoal | null;
}

export default function DeleteSavingsGoalConfirmDialog({ open, onOpenChange, goal }: DeleteSavingsGoalConfirmDialogProps) {
  const mutation = useDeleteSavingsGoal();
  
  const handleDelete = async () => {
    if (!goal) return;
    
    try {
      await mutation.mutateAsync(goal.id);
      toast.success('Goal deleted successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to delete goal. Please try again.');
    }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Savings Goal</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{goal?.name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={mutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {mutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
