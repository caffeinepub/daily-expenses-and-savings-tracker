import AppHeader from './AppHeader';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'entries' | 'savings-goals' | 'download';
  onNavigate: (page: 'dashboard' | 'entries' | 'savings-goals' | 'download') => void;
}

export default function AppLayout({ children, currentPage, onNavigate }: AppLayoutProps) {
  return (
    <div className="min-h-screen app-background relative">
      {/* Animated overlay layer */}
      <div className="animated-overlay"></div>
      
      {/* Overlay for content readability */}
      <div className="absolute inset-0 bg-background/88 backdrop-blur-sm"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
        <AppHeader currentPage={currentPage} onNavigate={onNavigate} />
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
          {children}
        </main>
        <footer className="border-t border-border/40 mt-8 sm:mt-12 md:mt-16 bg-card/70 backdrop-blur-lg shadow-soft">
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 text-center text-xs sm:text-sm text-muted-foreground font-body">
            <p>
              © {new Date().getFullYear()} · Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-accent transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
