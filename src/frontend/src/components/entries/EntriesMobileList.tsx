import { Entry, EntryType } from '../../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { formatINR } from '../../utils/currency';

interface EntriesMobileListProps {
  entries: Entry[];
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
}

export default function EntriesMobileList({ entries, onEdit, onDelete }: EntriesMobileListProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No entries found matching your filters.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const entryDate = new Date(Number(entry.date) / 1_000_000);
        return (
          <Card key={entry.id.toString()}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={entry.entryType === EntryType.expense ? 'destructive' : 'default'}
                      className="text-xs"
                    >
                      {entry.entryType === EntryType.expense ? 'Expense' : 'Saving'}
                    </Badge>
                    {entry.category && (
                      <Badge variant="outline" className="text-xs truncate max-w-[120px]">
                        {entry.category}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{format(entryDate, 'PPP')}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className={`text-lg font-bold ${
                      entry.entryType === EntryType.expense ? 'text-destructive' : 'text-primary'
                    }`}
                  >
                    {formatINR(entry.amount)}
                  </p>
                </div>
              </div>

              {entry.note && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{entry.note}</p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(entry)}
                  className="flex-1 h-9 text-xs"
                >
                  <Edit className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(entry)}
                  className="flex-1 h-9 text-xs text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
