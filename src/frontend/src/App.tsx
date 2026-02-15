import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/queries/useUserProfile';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AuthGate from './components/auth/AuthGate';
import ProfileSetupDialog from './components/profile/ProfileSetupDialog';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import EntriesPage from './pages/EntriesPage';
import DownloadApkPage from './pages/DownloadApkPage';
import { useState } from 'react';

type Page = 'dashboard' | 'entries' | 'download';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthGate>
        {showProfileSetup && <ProfileSetupDialog />}
        <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
          <div key={currentPage} className="page-transition">
            {currentPage === 'dashboard' && <DashboardPage />}
            {currentPage === 'entries' && <EntriesPage />}
            {currentPage === 'download' && <DownloadApkPage />}
          </div>
        </AppLayout>
      </AuthGate>
      <Toaster />
    </ThemeProvider>
  );
}
