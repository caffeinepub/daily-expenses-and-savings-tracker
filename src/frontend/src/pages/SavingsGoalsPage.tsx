import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useGetSavingsGoals } from '../hooks/queries/useSavingsGoals';
import SavingsGoalsList from '../components/savings-goals/SavingsGoalsList';
import SavingsGoalFormDialog from '../components/savings-goals/SavingsGoalFormDialog';

export default function SavingsGoalsPage() {
  const { data: goals = [], isLoading } = useGetSavingsGoals();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Savings Goals</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Track your savings targets and progress</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="btn-interactive">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">New Goal</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading goals...</div>
      ) : (
        <SavingsGoalsList goals={goals} />
      )}
      
      <SavingsGoalFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        goal={null}
      />
    </div>
  );
}
