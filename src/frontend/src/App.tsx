import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/queries/useUserProfile';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AuthGate from './components/auth/AuthGate';
import ProfileSetupDialog from './components/profile/ProfileSetupDialog';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import EntriesPage from './pages/EntriesPage';
import { useState } from 'react';

type Page = 'dashboard' | 'entries';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthGate>
        {showProfileSetup && <ProfileSetupDialog />}
        <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'entries' && <EntriesPage />}
        </AppLayout>
      </AuthGate>
      <Toaster />
    </ThemeProvider>
  );
}
