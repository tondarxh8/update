// Configuration
const CONFIG = {
    // Update this with your actual APK file name in the repository
    apkFileName: 'Tonadar_VPN_1.0.3.apk',
    // Update this with your actual Telegram channel link
    telegramChannel: 'https://t.me/tondar_update/2',
    // Download delay for UX (milliseconds)
    downloadDelay: 500
};

// DOM Elements
const loadingOverlay = document.getElementById('loadingOverlay');
const telegramLink = document.querySelector('.telegram-link');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    addEventListeners();
});

function initializePage() {
    // Set telegram link
    if (telegramLink) {
        // Update the href to use the configured channel
        telegramLink.href = CONFIG.telegramChannel;
        
        // Custom click handler to try app first, then website
        telegramLink.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default navigation
            console.log('Telegram link clicked!');
            trackEvent('telegram_click');
            
            openTelegramApp(CONFIG.telegramChannel);
        });
        
        console.log('Telegram link initialized:', telegramLink.href);
    } else {
        console.error('Telegram link element not found!');
    }
}

function addEventListeners() {
    // Download button click handler
    window.downloadAPK = function() {
        startDownload();
    };
    
    // Add keyboard support for download
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const activeElement = document.activeElement;
            if (activeElement.classList.contains('download-btn')) {
                e.preventDefault();
                startDownload();
            }
        }
    });
}

function startDownload() {
    // Track download attempt
    trackEvent('download_attempt');
    
    // Show loading overlay briefly
    showLoading();
    
    // Start download immediately
    const downloadUrl = getDownloadUrl();
    triggerDownload(downloadUrl);
    
    // Hide loading and show success quickly
    setTimeout(() => {
        hideLoading();
        showDownloadSuccess();
    }, CONFIG.downloadDelay);
}

function getDownloadUrl() {
    // Get current repository info from GitHub Pages
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.replace('/index.html', '').replace(/\/$/, '');
    
    // Construct APK download URL
    // This assumes the APK file is in the root of your repository
    return `${baseUrl}/${CONFIG.apkFileName}`;
}

function triggerDownload(url) {
    // Create temporary download link
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = CONFIG.apkFileName;
    downloadLink.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Track successful download
    trackEvent('download_started');
}

function showLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showDownloadSuccess() {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>دانلود شروع شد!</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4caf50, #2e7d32);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
        z-index: 10000;
        font-family: 'Vazirmatn', sans-serif;
        font-weight: 500;
        animation: slideInRight 0.5s ease-out;
        direction: rtl;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notification-content i {
            font-size: 1.2rem;
        }
    `;
    document.head.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.5s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
}



function openTelegramApp(telegramUrl) {
    // Show brief loading message
    showTelegramLoading();
    
    // Extract channel info from URL
    const channelMatch = telegramUrl.match(/t\.me\/([^\/]+)(?:\/(\d+))?/);
    if (!channelMatch) {
        console.error('Invalid Telegram URL');
        hideTelegramLoading();
        window.open(telegramUrl, '_blank');
        return;
    }
    
    const channelName = channelMatch[1];
    const messageId = channelMatch[2];
    
    // Create Telegram app deep link
    let appUrl;
    if (messageId) {
        // Link to specific message
        appUrl = `tg://resolve?domain=${channelName}&post=${messageId}`;
    } else {
        // Link to channel
        appUrl = `tg://resolve?domain=${channelName}`;
    }
    
    console.log('Trying to open Telegram app:', appUrl);
    
    // Try to open Telegram app
    const appLink = document.createElement('a');
    appLink.href = appUrl;
    appLink.style.display = 'none';
    document.body.appendChild(appLink);
    
    // Set up fallback timer
    let appOpened = false;
    const fallbackTimer = setTimeout(() => {
        hideTelegramLoading();
        if (!appOpened) {
            console.log('App not available, opening website...');
            // If app doesn't open, try website
            window.open(telegramUrl, '_blank');
        }
        if (document.body.contains(appLink)) {
            document.body.removeChild(appLink);
        }
    }, 1500);
    
    // Listen for page visibility change (indicates app opened)
    const handleVisibilityChange = () => {
        if (document.hidden) {
            appOpened = true;
            clearTimeout(fallbackTimer);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            setTimeout(() => {
                if (document.body.contains(appLink)) {
                    document.body.removeChild(appLink);
                }
            }, 100);
        }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Listen for blur event (app opened)
    const handleBlur = () => {
        appOpened = true;
        clearTimeout(fallbackTimer);
        window.removeEventListener('blur', handleBlur);
        setTimeout(() => {
            if (document.body.contains(appLink)) {
                document.body.removeChild(appLink);
            }
        }, 100);
    };
    
    window.addEventListener('blur', handleBlur);
    
    // Try to click the app link
    try {
        appLink.click();
    } catch (error) {
        console.log('App link failed, trying direct navigation...');
        try {
            window.location.href = appUrl;
        } catch (navError) {
            console.log('Direct navigation failed, opening website...');
            clearTimeout(fallbackTimer);
            window.open(telegramUrl, '_blank');
            if (document.body.contains(appLink)) {
                document.body.removeChild(appLink);
            }
        }
    }
}

function showTelegramLoading() {
    // Create loading notification
    const notification = document.createElement('div');
    notification.id = 'telegram-loading';
    notification.className = 'telegram-loading-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fab fa-telegram-plane fa-spin"></i>
            <span>در حال باز کردن تلگرام...</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #0088cc, #006699);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 136, 204, 0.4);
        z-index: 10000;
        font-family: 'Vazirmatn', sans-serif;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
        direction: rtl;
    `;
    
    document.body.appendChild(notification);
}

function hideTelegramLoading() {
    const notification = document.getElementById('telegram-loading');
    if (notification) {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

function trackEvent(eventName) {
    // Basic analytics tracking (you can integrate with Google Analytics or other services)
    console.log(`Event tracked: ${eventName}`);
    
    // Example integration with Google Analytics (uncomment if you have GA)
    /*
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'custom_parameter': 'tonadar_vpn_update'
        });
    }
    */
}

// Handle offline/online status
window.addEventListener('online', function() {
    console.log('Connection restored');
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    // You could show a notification about offline status
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden
        trackEvent('page_hidden');
    } else {
        // Page is visible
        trackEvent('page_visible');
    }
});

// Add smooth scrolling for any potential anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Preload critical resources
function preloadResources() {
    // Preload the APK file for faster downloads
    try {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = getDownloadUrl();
        document.head.appendChild(link);
    } catch (error) {
        console.log('Preload not available');
    }
}

// Initialize preloading when page is loaded
window.addEventListener('load', preloadResources); 
