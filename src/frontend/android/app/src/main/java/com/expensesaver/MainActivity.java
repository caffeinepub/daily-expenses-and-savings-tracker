package com.expensesaver.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Initialize WebView configuration
        WebViewConfig.configure(this.bridge.getWebView());
    }
}
