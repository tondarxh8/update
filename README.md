# Tondar VPN Update Page

A modern, responsive GitHub Pages site for distributing APK updates for the Tondar VPN application. The page features a dark blue theme with Persian language support.

## Features

- 🎨 Modern, responsive design with dark blue theme
- 🌐 Persian (Farsi) language support with RTL text direction
- 📱 Mobile-optimized layout
- ⬇️ Direct APK download functionality
- 📞 Telegram channel integration
- ✨ Smooth animations and particle effects
- 🔧 Easy configuration and customization

## Setup Instructions

### 1. Repository Setup

1. Fork or clone this repository
2. Go to your repository's Settings > Pages
3. Set Source to "Deploy from a branch"
4. Select branch: `main` (or `master`)
5. Select folder: `/ (root)`
6. Click Save

### 2. Upload Your APK File

1. Upload your APK file to the root directory of your repository
2. Update the filename in `script.js`:
   ```javascript
   const CONFIG = {
       apkFileName: 'your-app-name.apk', // Update this
       // ...
   };
   ```

### 3. Configure Telegram Channel

Update the Telegram channel link in `script.js`:
```javascript
const CONFIG = {
    // ...
    telegramChannel: 'https://t.me/your_channel_username', // Update this
    // ...
};
```

### 4. Customize Content

Edit `index.html` to customize:
- App name and description
- Version information
- Feature list
- Any other content

### 5. Access Your Page

Your page will be available at:
```
https://yourusername.github.io/your-repository-name/
```

## File Structure

```
vpn_download_page/
├── index.html          # Main HTML page
├── styles.css          # CSS styles with dark blue theme
├── script.js           # JavaScript functionality
├── _config.yml         # GitHub Pages configuration
├── README.md           # This file
└── your-app.apk       # Your APK file (to be added)
```

## Customization Guide

### Changing Colors

The main color scheme is defined in `styles.css`. Key color variables:

```css
/* Primary dark blue gradient */
background: linear-gradient(135deg, #0f1b3c 0%, #1a237e 50%, #0d47a1 100%);

/* Accent blue */
color: #64b5f6;

/* Download button green */
background: linear-gradient(135deg, #4caf50, #2e7d32);
```

### Adding Analytics

To add Google Analytics, uncomment and configure the tracking code in `script.js`:

```javascript
function trackEvent(eventName) {
    // Uncomment for Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'custom_parameter': 'pingkhor_vpn_update'
        });
    }
}
```

### Custom Domain

To use a custom domain:

1. Add a `CNAME` file to the repository root with your domain
2. Configure DNS settings with your domain provider
3. Update the domain in repository Settings > Pages

## Persian Font

The page uses the Vazirmatn font for optimal Persian text display. It falls back to Tahoma if the web font fails to load.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- RTL text direction support
- CSS Grid and Flexbox support required

## Security Notes

- The download functionality creates temporary DOM elements
- No external scripts are loaded except for fonts and icons
- All animations are CSS-based for better performance

## Troubleshooting

### APK Download Not Working

1. Ensure the APK file is in the repository root
2. Check the filename matches the configuration in `script.js`
3. Verify GitHub Pages is properly deployed

### Telegram Link Not Working

1. Ensure the channel username is correct
2. Check that the channel is public
3. Verify the link format: `https://t.me/channel_username`

### Styling Issues

1. Clear browser cache
2. Check that `styles.css` is loading properly
3. Verify CSS is valid (no syntax errors)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source. Feel free to use and modify for your own VPN application.

---

Made with ❤️ for the Tondar VPN community 