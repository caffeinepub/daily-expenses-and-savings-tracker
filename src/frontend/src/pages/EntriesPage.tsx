import EntryForm from '../components/entries/EntryForm';
import EntriesTable from '../components/entries/EntriesTable';

export default function EntriesPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Entries</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your expenses and savings</p>
      </div>

      <EntryForm />
      <EntriesTable />
    </div>
  );
}
