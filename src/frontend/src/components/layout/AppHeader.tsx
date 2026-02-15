import { useGetCallerUserProfile } from '../../hooks/queries/useUserProfile';
import LoginButton from '../auth/LoginButton';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Receipt, Download } from 'lucide-react';

interface AppHeaderProps {
  currentPage: 'dashboard' | 'entries' | 'download';
  onNavigate: (page: 'dashboard' | 'entries' | 'download') => void;
}

export default function AppHeader({ currentPage, onNavigate }: AppHeaderProps) {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-7xl">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              src="/assets/generated/expense-saver-logo.dim_256x256.png"
              alt="Expense Saver"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0"
            />
            <h1 className="text-base sm:text-xl font-semibold truncate">Expense Saver</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {userProfile && (
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline truncate max-w-[120px] md:max-w-none">
                Hello, {userProfile.name}
              </span>
            )}
            <LoginButton />
          </div>
        </div>
        <nav className="flex items-center gap-2 mt-3" role="navigation" aria-label="Main navigation">
          <Button
            variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('dashboard')}
            className="flex-1 h-10 sm:h-9 btn-interactive"
            aria-current={currentPage === 'dashboard' ? 'page' : undefined}
          >
            <LayoutDashboard className="mr-1.5 sm:mr-2 h-4 w-4" />
            <span className="text-sm">Dashboard</span>
          </Button>
          <Button
            variant={currentPage === 'entries' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('entries')}
            className="flex-1 h-10 sm:h-9 btn-interactive"
            aria-current={currentPage === 'entries' ? 'page' : undefined}
          >
            <Receipt className="mr-1.5 sm:mr-2 h-4 w-4" />
            <span className="text-sm">Entries</span>
          </Button>
          <Button
            variant={currentPage === 'download' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('download')}
            className="flex-1 h-10 sm:h-9 btn-interactive"
            aria-current={currentPage === 'download' ? 'page' : undefined}
          >
            <Download className="mr-1.5 sm:mr-2 h-4 w-4" />
            <span className="text-sm">Download APK</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
