package com.expensesaver.app;

import android.webkit.WebSettings;
import android.webkit.WebView;

public class WebViewConfig {
    public static void configure(WebView webView) {
        if (webView == null) return;
        
        WebSettings settings = webView.getSettings();
        
        // Enable JavaScript (required for React app)
        settings.setJavaScriptEnabled(true);
        
        // Enable DOM storage (required for Internet Identity)
        settings.setDomStorageEnabled(true);
        
        // Enable database storage
        settings.setDatabaseEnabled(true);
        
        // Allow file access
        settings.setAllowFileAccess(true);
        
        // Enable mixed content (HTTP and HTTPS)
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        // Enable zoom controls
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        
        // Enable viewport
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        
        // Enable caching
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setAppCacheEnabled(true);
        
        // User agent
        settings.setUserAgentString(settings.getUserAgentString() + " ExpenseSaverApp/1.0");
    }
}
