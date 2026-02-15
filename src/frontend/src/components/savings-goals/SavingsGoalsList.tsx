import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pencil, Trash2, Target, Calendar } from 'lucide-react';
import { SavingsGoal } from '../../backend';
import { formatINR } from '../../utils/currency';
import { format } from 'date-fns';
import SavingsGoalFormDialog from './SavingsGoalFormDialog';
import DeleteSavingsGoalConfirmDialog from './DeleteSavingsGoalConfirmDialog';

interface SavingsGoalsListProps {
  goals: SavingsGoal[];
}

export default function SavingsGoalsList({ goals }: SavingsGoalsListProps) {
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<SavingsGoal | null>(null);
  
  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Savings Goals Yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first savings goal to start tracking your progress
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {goals.map((goal) => {
          const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
          const isComplete = progress >= 100;
          
          return (
            <Card key={Number(goal.id)} className={isComplete ? 'border-primary' : ''}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{goal.name}</h3>
                    {goal.deadline && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        Target: {format(new Date(Number(goal.deadline) / 1_000_000), 'dd MMM yyyy')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingGoal(goal)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeletingGoal(goal)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-primary">{formatINR(goal.currentAmount)}</span>
                    <span className="text-muted-foreground">of {formatINR(goal.targetAmount)}</span>
                  </div>
                </div>
                
                {goal.note && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{goal.note}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <SavingsGoalFormDialog
        open={!!editingGoal}
        onOpenChange={(open) => !open && setEditingGoal(null)}
        goal={editingGoal}
      />
      
      <DeleteSavingsGoalConfirmDialog
        open={!!deletingGoal}
        onOpenChange={(open) => !open && setDeletingGoal(null)}
        goal={deletingGoal}
      />
    </>
  );
}
