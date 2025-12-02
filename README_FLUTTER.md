# Flutter Portfolio App

This is a Flutter equivalent of the portfolio website from `index.html`.

## Features

- Responsive design that adapts to different screen sizes
- About section with personal introduction
- Projects section with cards for each project
- Contact form with validation
- External links to YouTube and GitHub
- Material Design styling matching the original website colors

## Requirements

- Flutter SDK (3.0.0 or higher)
- Dart SDK (comes with Flutter)

## Setup

1. Make sure Flutter is installed:
   ```bash
   flutter doctor
   ```

2. Install dependencies:
   ```bash
   flutter pub get
   ```

3. Run the app:
   ```bash
   # For web
   flutter run -d chrome
   
   # For desktop (Linux)
   flutter run -d linux
   
   # For Android/iOS (requires emulator or device)
   flutter run
   ```

## File Structure

- `lib/main.dart` - Main Flutter application code
- `pubspec.yaml` - Project dependencies and configuration

## Dependencies

- `url_launcher` - For opening external links (GitHub, YouTube)

## Notes

- The contact form currently shows a success message when submitted. In a production app, you would connect this to a backend service.
- The app uses Material Design components to replicate the HTML/CSS styling
- Responsive breakpoints are set at 600px width, matching common mobile screen sizes
- Colors are matched to the original CSS using hex values
