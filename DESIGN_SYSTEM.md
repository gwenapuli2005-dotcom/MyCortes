# MyCortes UI - Design System & Component Reference

## 🎨 Color Palette

### Primary Colors
- **Primary (Teal):** `#3F6B4E` - Main brand color, trust & nature
- **Primary Light:** `#D4E8E5` - Light backgrounds
- **Secondary (Coral):** `#D85A4B` - Warm accent, community warmth

### Service Category Colors
- **Blue (Service):** `#3B82F6` - Administrative services, documents
- **Red (Emergency):** `#EF4444` - Emergency, urgent, alerts
- **Green (Community):** `#10B981` - Health, community, programs
- **Orange (Events):** `#F97316` - Events, announcements, updates
- **Purple (Feedback):** `#A855F7` - Feedback, surveys, suggestions

### Neutral Colors
- **Foreground:** `#0B1419` - Text color
- **Background:** `#F8FBFD` - Page background
- **Muted:** `#F3F3F7` - Secondary background
- **Border:** `#E8E8F0` - Border color

---

## 📐 Typography

### Font Family
- **Primary:** Plus Jakarta Sans (400-800 weights)
- **Fallback:** system-ui, sans-serif

### Sizes
- **H1:** 48px (lg: 56px), bold
- **H2:** 32px (lg: 42px), bold
- **H3:** 24px (lg: 28px), bold
- **Body Large:** 18px, regular/medium
- **Body Base:** 16px, regular/medium
- **Body Small:** 14px, regular/medium
- **Label:** 12px, semibold
- **Caption:** 12px (xs), regular

---

## 🔧 Component Usage

### Header (Modern)
```tsx
import { ModernHeader } from "@/components/ModernHeader";

<ModernHeader />
```
- Responsive desktop/mobile
- Auto-hides on certain routes (/auth)
- Includes search, notifications, profile

### Footer (Modern)
```tsx
import { ModernFooter } from "@/components/ModernFooter";

<ModernFooter />
```
- 4-column layout on desktop
- Quick links, services, contact info
- Auto-hides on certain routes

### Quick Services
```tsx
// Use in pages for quick access to main services
import { QuickServices } from "@/components/QuickServices";

<QuickServices />
```
- 4 columns mobile, 8 columns desktop
- Color-coded by category
- Requires auth check

---

## 🎨 Animations

### Available Animations
```css
/* Standard animations */
.animate-slide-up      /* Slide from bottom with fade */
.animate-slide-in-left /* Slide from left with fade */
.animate-slide-in-right /* Slide from right with fade */
.animate-fade-in       /* Pure fade in */
.animate-pulse-soft    /* Subtle pulse effect */
```

### Usage Example
```tsx
<Card 
  style={{ animation: `slideUp 0.4s ease-out ${index * 100}ms backwards` }}
>
  Content
</Card>
```

---

## 🎯 Layout Patterns

### Service Cards
```tsx
<Card
  className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
>
  <div className={cn(
    "bg-gradient-to-br ${categoryColor}",
    "p-6 text-white"
  )}>
    <Icon className="h-6 w-6" />
    <p className="font-bold">{title}</p>
  </div>
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>
```

### Category Headers
```tsx
<div className="flex items-center gap-3 mb-6">
  <div className={cn("p-2.5 rounded-lg text-white",
    `bg-gradient-to-br ${categoryColor}`)}>
    <Icon className="h-5 w-5" />
  </div>
  <h2 className="text-2xl font-bold">{category}</h2>
  <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
</div>
```

---

## 📱 Responsive Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px   /* Small phones */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile-First Example
```tsx
/* Mobile default, then override for larger screens */
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

---

## 🔄 Page Templates

### Dashboard-Style Page
```tsx
<>
  <ModernHeader />
  <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-24 lg:pb-12">
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold mb-3">Title</h1>
        <p className="text-lg text-muted-foreground">Subtitle</p>
      </div>
      
      {/* Content */}
      <div className="space-y-6">
        {/* Components */}
      </div>
    </div>
    <ModernFooter />
  </div>
  <BottomNav />
</>
```

---

## 🎨 Color Usage Examples

### Red Services (Emergency)
```tsx
// Use for emergency-related items, urgent alerts
className="bg-red-500 hover:bg-red-600"
className="from-red-500 to-red-600"
className="text-red-700"
className="bg-red-100 text-red-700"
```

### Green Services (Community/Health)
```tsx
// Use for community programs, health services
className="bg-green-500 hover:bg-green-600"
className="from-green-500 to-green-600"
className="text-green-700"
className="bg-green-100 text-green-700"
```

### Blue Services (Administrative)
```tsx
// Use for services, permits, documents
className="bg-blue-500 hover:bg-blue-600"
className="from-blue-500 to-blue-600"
className="text-blue-700"
className="bg-blue-100 text-blue-700"
```

### Orange Events (Updates/Events)
```tsx
// Use for announcements, events, updates
className="bg-orange-500 hover:bg-orange-600"
className="from-orange-500 to-orange-600"
className="text-orange-700"
className="bg-orange-100 text-orange-700"
```

### Purple Feedback
```tsx
// Use for feedback, surveys, suggestions
className="bg-purple-500 hover:bg-purple-600"
className="from-purple-500 to-purple-600"
className="text-purple-700"
className="bg-purple-100 text-purple-700"
```

---

## 🚀 Best Practices

### Do's ✅
- Use color coding consistently across app
- Add hover states for all interactive elements
- Use animations for delight, not distraction
- Keep spacing consistent (multiples of 0.25rem)
- Use semantic HTML for accessibility
- Test on mobile first, then scale up
- Use proper heading hierarchy
- Add alt text to all images

### Don'ts ❌
- Don't mix color meanings (Red for success, etc.)
- Don't add animations without purpose
- Don't skip mobile design
- Don't use non-semantic elements for layout
- Don't forget focus states for keyboard navigation
- Don't make buttons too small (< 44px)
- Don't use placeholder text as labels
- Don't auto-play sounds or videos

---

## 📊 Grid Layouts

### 1 Column (Mobile Default)
```tsx
<div className="grid grid-cols-1">
```

### 2 Column (Tablet)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2">
```

### 3 Column (Desktop)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 4+ Columns (Large Desktop)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

---

## 🎯 Service Categories Reference

| Service | Color | Icon | Category |
|---------|-------|------|----------|
| Request Service | Blue | FileText | Services |
| Report Issue | Red | AlertCircle | Emergency |
| Community Feed | Green | Heart | Community |
| Feedback | Purple | MessageSquare | Services |
| Tourist Spots | Orange | Compass | Tourism |
| Directory | Blue | Building2 | Services |
| Emergency | Red | AlertCircle | Emergency |
| Events | Orange | Calendar | Events |
| Programs | Green | Heart | Community |

---

## 🔗 File Reference

| Component | Path | Purpose |
|-----------|------|---------|
| ModernHeader | `src/components/ModernHeader.tsx` | Top navigation |
| ModernFooter | `src/components/ModernFooter.tsx` | Bottom footer |
| QuickServices | `src/components/QuickServices.tsx` | Service shortcuts |
| Services Page | `src/pages/Services.tsx` | All services view |
| Directory | `src/pages/Directory.tsx` | Offices/Programs |
| Emergency | `src/pages/Emergency.tsx` | Contact list |
| Updates | `src/pages/Updates.tsx` | Announcements |
| Styles | `src/App.css` | Animation & utilities |
| Base Styles | `src/index.css` | Theme & layout |

---

## 📚 Resources

- Tailwind CSS: https://tailwindcss.com
- Radix UI: https://radix-ui.com
- Lucide Icons: https://lucide.dev
- Material Design: https://material.io/design
- Accessibility: https://www.w3.org/WAI/

---

**Last Updated:** April 2026
**Version:** 1.0
**Status:** Complete ✅
