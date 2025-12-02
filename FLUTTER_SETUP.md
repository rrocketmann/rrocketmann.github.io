# Flutter Portfolio App - Setup Instructions

## Quick Start

This Flutter app is a complete equivalent of the HTML portfolio website.

### Prerequisites
1. Install Flutter: https://docs.flutter.dev/get-started/install
2. Verify installation: `flutter doctor`

### Running the App

```bash
# Install dependencies
flutter pub get

# Run on web
flutter run -d chrome

# Run on Linux desktop
flutter run -d linux

# Run on mobile (requires emulator/device)
flutter run
```

### What's Included

✓ Responsive design matching the original HTML/CSS
✓ All sections: About, Projects, Contact, Links
✓ Working contact form with validation
✓ Clickable buttons that open GitHub/YouTube links
✓ Material Design styling with matching colors
✓ Mobile-responsive layout (600px breakpoint)

### Key Differences from HTML Version

- **Contact form**: Shows success message (no backend integration yet)
- **Styling**: Uses Flutter widgets instead of CSS
- **Links**: Opens in external browser using `url_launcher` package
- **Layout**: Scrollable single-page app with Column layout

### Project Structure

```
├── lib/
│   └── main.dart          # Complete Flutter app code
├── pubspec.yaml           # Dependencies and configuration
└── README_FLUTTER.md      # This file
```

### Customization

To modify content:
- Edit the projects list in `_buildProjectsSection()`
- Update personal info in `_buildHeader()` and `_buildAboutSection()`
- Change colors by modifying Color values (e.g., `Color(0xFFE3F2FD)`)

### Dependencies Used

- **url_launcher**: Opens external links (GitHub, YouTube)
- **flutter/material**: Material Design components

Enjoy your Flutter portfolio app! 🚀
