import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DownloadApkPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Download Android App</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Install Expense Saver on your Android device for a native mobile experience.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription>
          This is a debug APK for testing purposes. You may need to enable "Install from Unknown Sources" in your device settings.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Expense Saver APK</CardTitle>
              <CardDescription>Version 1.0.0 (Debug Build)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">System Requirements:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Android 5.0 (Lollipop) or higher</li>
              <li>Minimum 50 MB free storage space</li>
              <li>Internet connection for syncing data</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Installation Steps:</h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Download the APK file using the button below</li>
              <li>Open the downloaded file on your Android device</li>
              <li>If prompted, allow installation from unknown sources</li>
              <li>Follow the on-screen instructions to complete installation</li>
              <li>Launch the app and sign in with your account</li>
            </ol>
          </div>

          <Button className="w-full btn-interactive" size="lg" asChild>
            <a href="/assets/app-debug.apk" download="expense-saver.apk">
              <Download className="mr-2 h-5 w-5" />
              Download APK
            </a>
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By downloading this app, you agree to use it for testing purposes only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
