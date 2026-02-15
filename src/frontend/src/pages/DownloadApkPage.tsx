import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DownloadApkPage() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/expense-saver.apk';
    link.download = 'expense-saver.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Download Android App</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Install Expense Saver on your Android device</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Android APK
          </CardTitle>
          <CardDescription>
            Download and install the Expense Saver app directly on your Android device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleDownload}
            size="lg"
            className="w-full btn-interactive shadow-soft"
          >
            <Download className="mr-2 h-5 w-5" />
            Download APK
          </Button>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              This is a debug APK for testing purposes. You may need to enable "Install from Unknown Sources" in your device settings.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Installation Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Step 1: Download the APK</p>
                <p className="text-sm text-muted-foreground">Click the download button above to get the APK file</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Step 2: Enable Unknown Sources</p>
                <p className="text-sm text-muted-foreground">
                  Go to Settings → Security → Enable "Install from Unknown Sources"
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Step 3: Install the App</p>
                <p className="text-sm text-muted-foreground">
                  Open the downloaded APK file and follow the installation prompts
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Step 4: Launch and Enjoy</p>
                <p className="text-sm text-muted-foreground">
                  Open the app and sign in with your Internet Identity
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Android 7.0 (Nougat) or higher
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Minimum 50 MB free storage space
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Internet connection required for syncing
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
