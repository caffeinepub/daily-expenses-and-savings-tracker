import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default function EntriesEmptyState() {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <img
            src="/assets/generated/empty-state-finance.dim_1200x600.png"
            alt="No entries yet"
            className="w-full max-w-md h-auto rounded-lg"
          />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No entries yet</h3>
            <p className="text-muted-foreground max-w-sm">
              Start tracking your finances by adding your first expense or saving entry above.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
