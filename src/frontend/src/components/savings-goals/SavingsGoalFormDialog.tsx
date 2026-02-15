import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAddOrUpdateSavingsGoal } from '../../hooks/queries/useSavingsGoals';
import { SavingsGoal } from '../../backend';
import { toast } from 'sonner';

interface SavingsGoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: SavingsGoal | null;
}

export default function SavingsGoalFormDialog({ open, onOpenChange, goal }: SavingsGoalFormDialogProps) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [note, setNote] = useState('');
  
  const mutation = useAddOrUpdateSavingsGoal();
  
  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTargetAmount(goal.targetAmount.toString());
      setCurrentAmount(goal.currentAmount.toString());
      setDeadline(goal.deadline ? new Date(Number(goal.deadline) / 1_000_000).toISOString().split('T')[0] : '');
      setNote(goal.note || '');
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setDeadline('');
      setNote('');
    }
  }, [goal, open]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a goal name');
      return;
    }
    
    const target = parseFloat(targetAmount);
    if (isNaN(target) || target <= 0) {
      toast.error('Please enter a valid target amount');
      return;
    }
    
    const current = parseFloat(currentAmount);
    if (isNaN(current) || current < 0) {
      toast.error('Please enter a valid current amount');
      return;
    }
    
    try {
      await mutation.mutateAsync({
        id: goal?.id || null,
        name: name.trim(),
        targetAmount: target,
        currentAmount: current,
        deadline: deadline ? BigInt(new Date(deadline).getTime() * 1_000_000) : null,
        note: note.trim() || null,
      });
      
      toast.success(goal ? 'Goal updated successfully' : 'Goal created successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save goal. Please try again.');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{goal ? 'Edit Savings Goal' : 'Create Savings Goal'}</DialogTitle>
          <DialogDescription>
            {goal ? 'Update your savings goal details' : 'Set a new savings goal to track your progress'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Goal Name *</Label>
            <Input
              id="goal-name"
              placeholder="e.g., Emergency Fund, Vacation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-amount">Target Amount (₹) *</Label>
              <Input
                id="target-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="10000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="current-amount">Current Amount (₹)</Label>
              <Input
                id="current-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline (Optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add any notes about this goal..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="flex-1">
              {mutation.isPending ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
