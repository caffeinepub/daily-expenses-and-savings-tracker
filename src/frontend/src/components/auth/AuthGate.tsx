import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Sparkles } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { identity, login, loginStatus } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="min-h-screen app-background relative flex items-center justify-center p-4">
        {/* Animated overlay layer */}
        <div className="animated-overlay"></div>
        
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-background/90 backdrop-blur-md"></div>
        
        {/* Sign-in card */}
        <Card className="w-full max-w-md relative z-10 shadow-soft border border-border/50 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center shadow-soft relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
              <img
                src="/assets/generated/expense-saver-logo-royal.dim_256x256.png"
                alt="Expense Saver"
                className="w-16 h-16 object-contain relative z-10"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <CardTitle className="text-2xl font-bold font-sans">Welcome to Expense Saver</CardTitle>
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <CardDescription className="text-base font-body">
                Track your daily expenses and savings with ease. Sign in to get started.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              className="w-full btn-interactive shadow-soft font-body"
              size="lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {loginStatus === 'logging-in' ? 'Signing in...' : 'Sign in to continue'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
