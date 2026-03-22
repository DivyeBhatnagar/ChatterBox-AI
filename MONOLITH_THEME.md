# MONOLITH Theme - React Conversion

## Overview

This is a complete React conversion of the MONOLITH HTML design system - a sophisticated dark theme for a high-tech AI chatbot application with glassmorphism effects and advanced visual design.

## Features

### Components Created

1. **TopAppBar** (`src/components/shared/TopAppBar.tsx`)
   - Fixed header with navigation
   - Logo and tab switching
   - Profile and settings buttons
   - Responsive design

2. **SideNavBar** (`src/components/shared/SideNavBar.tsx`)
   - Fixed left sidebar
   - Navigation to different sections
   - Support and documentation links
   - Hidden on smaller screens

3. **MonolithFooter** (`src/components/shared/MonolithFooter.tsx`)
   - Footer with company info
   - Links organized by category
   - Social media links
   - Copyright information

4. **MonolithLandingPage** (`src/components/landing/MonolithLandingPage.tsx`)
   - Full hero section with gradient blur
   - Feature grid with different card styles
   - Evolution section with quotes
   - Call-to-action section
   - Floating glass nodes animation

5. **MonolithChatPage** (`src/components/MonolithChatPage.tsx`)
   - Chat interface with message threading
   - Glass-morphism input area
   - Message history display
   - Active node indicator
   - Floating background sphere

## Design System

### Color Palette

The Monolith theme uses a sophisticated dark color scheme with the following key colors:

```
Background: #131313
Surface: #131313
Primary (White): #ffffff
Secondary: #c8c6c5
Text Color: #e2e2e2
Accent Error: #ffb4ab
```

All colors are defined in `tailwind.config.js` and accessible via Tailwind CSS classes.

### Typography

- **Headlines**: Manrope font (200, 400, 700, 800 weights)
- **Body Text**: Inter font (300, 400, 600 weights)
- **Labels**: Inter font
- Letter-spacing and tracking for a premium feel

### Visual Effects

#### Glassmorphism
- `.glass-node`: Blurred background with subtle borders
- `.glass-panel`: Panel with backdrop blur effect
- Used throughout for modern, layered design

#### Gradients
- `.monolith-gradient`: Radial gradient from white to light gray
- Shadow effects for depth

#### Animations
- `animate-spin-slow`: 8-second continuous rotation
- Pulse animations for indicators
- Smooth hover transitions

### Custom Scrollbar

Custom scrollbar styling for the dark theme:
- Track: #0e0e0e
- Thumb: #353535
- Hover: #474747

## File Structure

```
src/
├── components/
│   ├── shared/
│   │   ├── TopAppBar.tsx
│   │   ├── SideNavBar.tsx
│   │   └── MonolithFooter.tsx
│   ├── landing/
│   │   └── MonolithLandingPage.tsx
│   └── MonolithChatPage.tsx
├── styles/
│   └── monolith.css
├── main.tsx (updated with monolith.css import)
├── App.tsx (updated with Monolith routes)
└── tailwind.config.js (extended with Monolith colors)
```

## Routes

### Landing Page
- **Path**: `/` or `/monolith-landing`
- **Component**: `MonolithLandingPage`
- Shows hero section, features, and call-to-action

### Chat Page
- **Path**: `/chat` or `/monolith-chat` (Protected)
- **Component**: `MonolithChatPage`
- Full chat interface with sidebar and message history

## Usage

### Importing Components

```tsx
import { MonolithLandingPage } from './components/landing/MonolithLandingPage'
import { MonolithChatPage } from './components/MonolithChatPage'
import { TopAppBar } from './components/shared/TopAppBar'
import { SideNavBar } from './components/shared/SideNavBar'
import { MonolithFooter } from './components/shared/MonolithFooter'
```

### Using Monolith Styles

All Monolith colors are available as Tailwind classes:

```tsx
// Background colors
<div className="bg-background">
<div className="bg-surface-container-low">
<div className="bg-surface-container-highest">

// Text colors
<h1 className="text-white">
<p className="text-on-background">
<p className="text-on-surface-variant">

// Effects
<div className="glass-node">
<div className="glass-panel">
<div className="monolith-gradient">
<div className="obsidian-depth">
```

### Material Icons

The theme uses Material Symbols Outlined icons:

```tsx
<span className="material-symbols-outlined">settings</span>
<span className="material-symbols-outlined">add_box</span>
<span className="material-symbols-outlined">hub</span>
```

## Responsive Design

### Breakpoints
- **Hidden on mobile**: Top nav links, side navbar
- **Mobile optimizations**: Stack layout, responsive font sizes
- **Tablet+**: Full layout with sidebar

### Media Queries
- `hidden md:flex` - Hidden on mobile, visible on medium+ screens
- `hidden lg:flex` - Hidden on mobile/tablet, visible on large+ screens
- Responsive padding and spacing

## Dark Mode

The entire theme is dark mode by default. All colors use the dark palette and are optimized for low-light viewing.

### CSS Variables
Color variables are defined in `monolith.css` for easy theme customization:

```css
:root {
  --background: #131313;
  --surface: #131313;
  --primary: #ffffff;
  --on-surface: #e2e2e2;
  /* ... all other colors ... */
}
```

## Fonts

The theme requires Google Fonts to be imported. Already included in `main.tsx`:

```tsx
import './styles/monolith.css'
```

Which includes:
- Manrope (headlines)
- Inter (body text)
- Material Symbols Outlined (icons)

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (webkit prefixes for backdrop-filter)
- Mobile browsers: Responsive design supported

## Performance Considerations

1. **Blur Effects**: Using `blur()` on larger elements may impact performance. Consider reducing blur radius on lower-end devices.
2. **Animations**: All animations use GPU-accelerated transforms (`rotate`, `scale`)
3. **Images**: Grayscale filter and mix-blend-mode applied to images
4. **Scrollbar**: Custom scrollbar doesn't impact performance

## Customization

### Changing Colors

Edit `tailwind.config.js` to modify colors:

```js
theme: {
  extend: {
    colors: {
      'primary': '#your-color',
      'background': '#your-color',
      // ...
    }
  }
}
```

### Modifying Fonts

Update `tailwind.config.js`:

```js
fontFamily: {
  'headline': ['Your Font', 'sans-serif'],
  'body': ['Your Font', 'sans-serif'],
}
```

### Adjusting Effects

Modify `monolith.css`:

```css
.glass-node {
  backdrop-filter: blur(30px); /* Increase/decrease blur */
  background: rgba(57, 57, 57, 0.5); /* Change opacity */
}
```

## Integration with Existing Pages

The Monolith theme is integrated as a standalone design system:

- **Default route** (`/`) now uses `MonolithLandingPage`
- **Chat route** (`/chat`) now uses `MonolithChatPage`
- Original pages still available:
  - `/landing` - Original landing page
  - Original chat page accessible via protected routes

## Accessibility

- Proper heading hierarchy (h1, h2, h3, etc.)
- Focus states on interactive elements
- High contrast text for readability
- Semantic HTML
- ARIA labels where needed
- Reduced motion support via `@media (prefers-reduced-motion)`

## Future Enhancements

Potential additions:

1. **Analytics Page**: Grid of metrics and charts
2. **Settings Page**: Configuration and preferences
3. **Animations**: More complex motion designs
4. **Variations**: Light mode variant
5. **Components Library**: Reusable UI elements
6. **3D Elements**: WebGL sphere animations

## Dependencies

- React 18+
- React Router DOM 6+
- Tailwind CSS 3+
- Google Fonts (Material Symbols, Manrope, Inter)

## Notes

- All images are external URLs and may require fallbacks
- Chat functionality is currently mocked with simulated responses
- The theme is fully responsive and mobile-friendly
- All transitions are smooth and GPU-accelerated

---

**Created**: March 2024
**Theme Name**: MONOLITH - The Architect of Intelligence
**Author**: AI Design System
