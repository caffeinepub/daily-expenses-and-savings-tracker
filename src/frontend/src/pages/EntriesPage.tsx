import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useGetEntries } from '../hooks/queries/useEntries';
import EntriesTable from '../components/entries/EntriesTable';
import EntryForm from '../components/entries/EntryForm';
import StatementExportCard from '../components/statements/StatementExportCard';

export default function EntriesPage() {
  const { data: entries = [] } = useGetEntries();
  const [showForm, setShowForm] = useState(true);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Entries</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your expenses and savings</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className="btn-interactive"
          variant={showForm ? 'outline' : 'default'}
        >
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Hide Form</span>
              <span className="sm:hidden">Hide</span>
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add Entry</span>
              <span className="sm:hidden">Add</span>
            </>
          )}
        </Button>
      </div>

      {showForm && <EntryForm />}

      <EntriesTable />
      
      <StatementExportCard entries={entries} />
    </div>
  );
}
