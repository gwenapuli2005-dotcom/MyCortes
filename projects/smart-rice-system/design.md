# Smart Rice Quality Grading System - Mobile App Design

## Design Philosophy

This mobile app is designed for **rural farmers and LGU officials in the Philippines** to quickly assess rice quality and get fair market pricing. The design prioritizes:
- **One-handed usage** on portrait orientation (9:16)
- **Offline-first capability** for areas with poor connectivity
- **Minimal friction** to capture and analyze rice samples
- **Clear, actionable results** without technical jargon
- **iOS-like polish** with smooth interactions and haptic feedback

---

## Screen List

| Screen | Purpose | Key Content |
|--------|---------|-------------|
| **Home** | App entry point, quick actions | Welcome message, "Scan Rice" button, recent results preview, price alerts |
| **Camera Capture** | Capture rice sample photo | Camera viewfinder, flash toggle, capture button, preview |
| **Grading Results** | Display AI analysis | Quality grade, milling degree, broken rice %, defects, confidence score |
| **Price Intelligence** | Show pricing info | Suggested price, price range, seasonal factors, market comparison |
| **Scan History** | Browse past scans | List of previous analyses with date, quality, price, ability to re-view |
| **Market Prices** | Real-time price dashboard | Price trends by quality category, seasonal indicators, location-based prices |
| **Settings** | App configuration | Dark mode toggle, location selection, language, about |

---

## Primary Content and Functionality

### Home Screen
- **Hero Section**: "Smart Rice Grading" title with rice emoji/icon
- **Quick Action Button**: Large "Scan Rice Sample" button (primary color, bottom-center for thumb reach)
- **Recent Results Card**: Last 3 scans with quality grade, date, price
- **Market Alert Banner**: "Market prices updated 2 hours ago" with current avg price
- **Tab Navigation**: Home, Scan, History, Market, Settings

### Camera Capture Screen
- **Full-screen camera preview** with safe area handling
- **Capture button** (large circle, center-bottom)
- **Flash toggle** (top-left corner, icon)
- **Gallery picker** (top-right corner, icon)
- **Instruction overlay**: "Position rice grains on white background"
- **Preview thumbnail** after capture with "Confirm" / "Retake" buttons

### Grading Results Screen
- **Quality Grade Badge**: Large, prominent (e.g., "PREMIUM" in green, "REGULAR" in blue)
- **Key Metrics Cards**:
  - Milling Degree (Well-milled / Premium / Regular)
  - Broken Rice Rate (%)
  - Defects Found (chalky, discolored, damaged, foreign materials)
  - Confidence Score (%)
- **Explainability Section**: "What affects this grade?" with simple icons
- **Action Buttons**: "Get Price Estimate", "Save Result", "Share"

### Price Intelligence Screen
- **Suggested Selling Price**: Large, bold number in PHP
- **Price Range**: Min-Max band with visual slider
- **Price Breakdown**:
  - Base price (quality category)
  - Seasonal adjustment (harvest/lean season)
  - Supply & demand factor
  - Location multiplier (Surigao del Sur)
- **Market Comparison**: "Market avg for this grade: ₱XX/kg"
- **Trend Chart**: Simple line chart showing price history (last 7 days)

### Scan History Screen
- **List of past scans** (FlatList):
  - Date & time
  - Quality grade (color-coded)
  - Suggested price
  - Tap to re-view full results
- **Filter/Sort**: By date, quality, price
- **Export option**: Share results as PDF or CSV

### Market Prices Screen
- **Price Categories**:
  - Regular Milled: ₱38–45/kg
  - Well-Milled: ₱45–52/kg
  - Premium: ₱52–65/kg
- **Seasonal Indicator**: Harvest vs. Lean season badge
- **Location Selector**: Dropdown to change region (default: Surigao del Sur)
- **Price Trend Chart**: 30-day history
- **Last Updated**: Timestamp of price data refresh

### Settings Screen
- **Display**: Dark mode toggle, font size
- **Location**: Dropdown for region (affects pricing)
- **Language**: English / Tagalog (future)
- **About**: App version, data sources, privacy policy link
- **Clear Data**: Option to delete scan history

---

## Key User Flows

### Flow 1: Scan and Grade Rice
1. User taps "Scan Rice Sample" on Home
2. Camera screen opens with instructions
3. User positions rice grains on white background
4. User taps capture button
5. Preview shown; user confirms or retakes
6. App processes image (AI inference)
7. Grading Results screen displays quality metrics
8. User taps "Get Price Estimate" to see pricing
9. User can save result or return to Home

### Flow 2: Check Market Prices
1. User taps "Market" tab
2. Market Prices screen shows current rates by category
3. User can change location via dropdown
4. Prices update dynamically
5. User can view 30-day trend chart
6. User returns to Home or navigates to another tab

### Flow 3: Review Scan History
1. User taps "History" tab
2. List of past scans appears (most recent first)
3. User taps a scan to view full results
4. Grading and pricing details re-displayed
5. User can delete individual scan or bulk-clear history
6. User returns to History or Home

---

## Color Choices

| Element | Color | Usage |
|---------|-------|-------|
| **Primary** | `#2E7D32` (Rice Green) | Buttons, active states, premium grade badge |
| **Background** | `#FFFFFF` (Light) / `#0F1419` (Dark) | Screen backgrounds |
| **Surface** | `#F5F5F5` (Light) / `#1E2022` (Dark) | Cards, elevated surfaces |
| **Foreground** | `#11181C` (Light) / `#ECEDEE` (Dark) | Primary text |
| **Muted** | `#687076` (Light) / `#9BA1A6` (Dark) | Secondary text, hints |
| **Success** | `#22C55E` | Well-milled, premium grades |
| **Warning** | `#F59E0B` | Regular grade, caution states |
| **Error** | `#EF4444` | Defects, issues |
| **Border** | `#E5E7EB` (Light) / `#334155` (Dark) | Dividers, card borders |

**Rice Green (#2E7D32)** reflects the agricultural context and creates a cohesive, trustworthy brand identity for a farming-focused app.

---

## Typography & Spacing

- **Headlines**: 32px (Home title), 24px (Screen titles), 18px (Card titles)
- **Body Text**: 16px (default), 14px (secondary), 12px (captions)
- **Line Height**: 1.5× font size for readability
- **Spacing**: 8px base unit (8, 16, 24, 32, 48px)
- **Corner Radius**: 12px (cards), 24px (buttons)

---

## Interaction Patterns

- **Button Press**: Scale 0.97 + light haptic feedback
- **List Swipe**: Opacity 0.7 on press
- **Toggle**: Medium haptic on change
- **Success Completion**: Success haptic + toast notification
- **Error**: Error haptic + red banner

---

## Offline Capability

- **Local Storage**: All scan results cached in AsyncStorage
- **AI Model**: TensorFlow Lite model bundled with app (~50MB)
- **Price Data**: Base prices stored locally; updates sync when online
- **Sync Strategy**: Auto-sync scan history and price updates when connection restored

---

## Accessibility

- **Text Contrast**: WCAG AA compliant (4.5:1 minimum)
- **Touch Targets**: Minimum 48×48 points
- **Font Scaling**: Respects system font size settings
- **Dark Mode**: Full support with CSS variables
- **Screen Reader**: Labels and hints for all interactive elements

---

## Performance Targets

- **App Launch**: < 2 seconds
- **Camera Open**: < 1 second
- **AI Inference**: < 3 seconds (on-device)
- **Screen Transitions**: < 300ms
- **List Scroll**: 60 FPS (smooth)

---

## Future Enhancements

- Multi-language support (Tagalog, Ilocano)
- Batch scanning (multiple samples at once)
- Integration with farmer cooperatives for bulk pricing
- AR visualization of defects
- Voice-guided instructions
- Biometric authentication for secure data
