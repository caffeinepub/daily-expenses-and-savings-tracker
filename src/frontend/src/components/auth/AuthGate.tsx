import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

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
        
        {/* Overlay for readability - increased opacity for better contrast */}
        <div className="absolute inset-0 bg-background/90 backdrop-blur-md"></div>
        
        {/* Sign-in card */}
        <Card className="w-full max-w-md relative z-10 shadow-2xl border-2">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 rounded-2xl bg-primary/15 flex items-center justify-center shadow-lg">
              <img
                src="/assets/generated/expense-saver-logo.dim_256x256.png"
                alt="Expense Saver"
                className="w-16 h-16 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to Expense Saver</CardTitle>
            <CardDescription className="text-base">
              Track your daily expenses and savings with ease. Sign in to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              className="w-full btn-interactive"
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
