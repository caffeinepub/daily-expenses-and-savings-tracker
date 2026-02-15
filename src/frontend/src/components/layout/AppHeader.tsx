import { useGetCallerUserProfile } from '../../hooks/queries/useUserProfile';
import LoginButton from '../auth/LoginButton';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Receipt, Target, Download } from 'lucide-react';

interface AppHeaderProps {
  currentPage: 'dashboard' | 'entries' | 'savings-goals' | 'download';
  onNavigate: (page: 'dashboard' | 'entries' | 'savings-goals' | 'download') => void;
}

export default function AppHeader({ currentPage, onNavigate }: AppHeaderProps) {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <header className="border-b border-border/40 bg-card/70 backdrop-blur-lg sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-7xl">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary via-primary/90 to-accent p-1.5 shadow-soft flex-shrink-0">
              <img
                src="/assets/generated/expense-saver-logo-royal.dim_256x256.png"
                alt="Expense Saver"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-base sm:text-xl font-bold truncate text-foreground font-sans">Expense Saver</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {userProfile && (
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline truncate max-w-[120px] md:max-w-none font-body">
                Hello, {userProfile.name}
              </span>
            )}
            <LoginButton />
          </div>
        </div>
        <nav className="flex items-center gap-1.5 mt-3 overflow-x-auto" role="navigation" aria-label="Main navigation">
          <Button
            variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('dashboard')}
            className="flex-shrink-0 h-10 sm:h-9 btn-interactive font-body"
            aria-current={currentPage === 'dashboard' ? 'page' : undefined}
          >
            <LayoutDashboard className="mr-1.5 sm:mr-2 h-4 w-4" />
            <span className="text-sm">Dashboard</span>
          </Button>
          <Button
            variant={currentPage === 'entries' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('entries')}
            className="flex-shrink-0 h-10 sm:h-9 btn-interactive font-body"
            aria-current={currentPage === 'entries' ? 'page' : undefined}
          >
            <Receipt className="mr-1.5 sm:mr-2 h-4 w-4" />
            <span className="text-sm">Entries</span>
          </Button>
          <Button
            variant={currentPage === 'savings-goals' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('savings-goals')}
            className="flex-shrink-0 h-10 sm:h-9 btn-interactive font-body"
            aria-current={currentPage === 'savings-goals' ? 'page' : undefined}
          >
            <Target className="mr-1.5 sm:mr-2 h-4 w-4" />
            <span className="text-sm">Savings Goals</span>
          </Button>
          <Button
            variant={currentPage === 'download' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('download')}
            className="flex-shrink-0 h-10 sm:h-9 btn-interactive font-body"
            aria-current={currentPage === 'download' ? 'page' : undefined}
          >
            <Download className="mr-1.5 sm:mr-2 h-4 w-4" />
            <span className="text-sm hidden sm:inline">Download APK</span>
            <span className="text-sm sm:hidden">APK</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
