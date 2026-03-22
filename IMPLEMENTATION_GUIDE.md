# MONOLITH Theme Implementation Guide

## What Was Converted

The HTML code from `code.html` has been completely converted to React components with the exact same styling and design system.

## Converted Files

### Shared Components
1. **TopAppBar.tsx** - Navigation header with logo and menu
2. **SideNavBar.tsx** - Left sidebar navigation  
3. **MonolithFooter.tsx** - Footer with links and copyright

### Page Components
1. **MonolithLandingPage.tsx** - Hero landing page (hero, features, evolution, CTA sections)
2. **MonolithChatPage.tsx** - Chat interface with sidebar (node indicator, message history, input area)

### Styling
1. **monolith.css** - Global styles, colors, animations, glassmorphism effects
2. **tailwind.config.js** - Extended with all Monolith colors, fonts, and animations

### Configuration
1. **App.tsx** - Updated routes to use Monolith components
2. **index.css** - Updated with Monolith colors and Material Symbols
3. **main.tsx** - Added monolith.css import

## Key Design Features

### 🎨 Color Scheme
- **Background**: #131313 (Deep black)
- **Surface**: #131313
- **Primary**: #ffffff (White text/buttons)
- **Text**: #e2e2e2 (Light gray)
- **Accents**: Various neutral grays and error red

### ✨ Visual Effects
- **Glassmorphism**: Semi-transparent panels with blur effects
- **Shadows**: Deep obsidian shadows for depth
- **Gradients**: Radial gradients for visual interest
- **Animations**: Smooth transitions and spin animations

### 🔤 Typography
- **Headlines**: Manrope font (bold, uppercase, tight tracking)
- **Body**: Inter font (light weight, good readability)
- **Labels**: Small caps with wide letter-spacing

### 📱 Responsive Design
- Mobile-first approach
- Hidden navigation on small screens
- Stack layout for mobile
- Full sidebar on desktop (lg+)

## Integration Points

### Home Page
**Before**: `/` → Original LandingPage
**After**: `/` → MonolithLandingPage (new default)
**Fallback**: `/landing` → Original LandingPage (still available)

### Chat Page  
**Before**: `/chat` → Original ChatPage (protected)
**After**: `/chat` → MonolithChatPage (protected, new default)
**Alternative**: `/monolith-chat` → MonolithChatPage

### Available Routes
```
GET  /                      → MonolithLandingPage (new)
GET  /landing               → Original LandingPage
GET  /monolith-landing      → MonolithLandingPage
GET  /login                 → LoginPage
GET  /register              → RegisterPage
GET  /chat                  → MonolithChatPage (protected, new)
GET  /monolith-chat         → MonolithChatPage (protected)
GET  /profile               → ProfilePage (protected)
GET  /settings              → SettingsPage (protected)
```

## Component Props

### TopAppBar
```tsx
<TopAppBar activeTab="core" />
// activeTab: 'core' | 'nexus' | 'analytics' | 'settings'
```

### SideNavBar
```tsx
<SideNavBar active="nexus" />
// active: 'nexus' | 'analytics' | 'settings'
```

### Page Components
No props required - they handle routing internally:
```tsx
<MonolithLandingPage />
<MonolithChatPage />
```

## How to Use

### 1. View the Landing Page
Navigate to `http://localhost:5173/` to see:
- Hero section with animated background
- Feature grid with glassmorphism cards
- Evolution section with testimonial
- Call-to-action button to chat

### 2. View the Chat Page
1. Navigate to `/chat` (will redirect to login if not authenticated)
2. Login with valid credentials
3. See the full chat interface with:
   - Top app bar with navigation
   - Left sidebar with menu
   - Chat message area with node indicator
   - Input area with send button
   - Floating background sphere

### 3. Customize Colors
Edit `tailwind.config.js`:
```js
colors: {
  'background': '#your-color',
  'primary': '#your-color',
  // ... modify any colors
}
```

### 4. Add New Sections
Create new components in `src/components/`:
```tsx
// Use existing classes and components
import { TopAppBar } from './shared/TopAppBar'
import { MonolithFooter } from './shared/MonolithFooter'

export const MyNewPage: React.FC = () => {
  return (
    <div className="bg-background text-on-surface">
      <TopAppBar activeTab="core" />
      {/* Your content */}
      <MonolithFooter />
    </div>
  )
}
```

## Styling Quick Reference

### Colors
```tsx
// Background
className="bg-background"
className="bg-surface-container-low"
className="bg-surface-container-high"
className="bg-surface-container-highest"

// Text
className="text-white"
className="text-on-background"
className="text-on-surface-variant"
className="text-neutral-500"

// Effects
className="glass-node"
className="glass-panel"
className="monolith-gradient"
className="obsidian-depth"
```

### Fonts
```tsx
// Headlines
className="font-headline"
className="font-black"
className="font-extrabold"

// Body Text
className="font-body"
className="font-light"

// Labels
className="font-label text-[10px] uppercase tracking-widest"
```

### Spacing & Typography
```tsx
// Tracking (letter-spacing)
className="tracking-tighter"      // -0.05em
className="tracking-tight"        // -0.025em
className="tracking-widest"       // 0.3em
className="tracking-wider"        // 0.05em

// Text Sizes
className="text-xs"    // 12px
className="text-sm"    // 14px
className="text-base"  // 16px
className="text-lg"    // 18px
className="text-xl"    // 20px
className="text-2xl"   // 24px
```

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome  | ✅ Full | All features work |
| Firefox | ✅ Full | All features work |
| Safari  | ✅ Full | Uses webkit prefixes |
| Edge    | ✅ Full | All features work |
| Mobile  | ✅ Responsive | Stack layout |

## Performance Tips

1. **Images**: Already using external URLs with grayscale filters
2. **Animations**: GPU-accelerated using transforms
3. **Scrollbar**: Lightweight custom styling
4. **Blur Effects**: Consider reducing on mobile for performance

## Troubleshooting

### Material Icons not showing
- Ensure Google Fonts import is in `index.css` ✅
- Check that `main.tsx` imports `monolith.css` ✅
- Verify Material Symbols font is loaded

### Colors not applying
- Clear Tailwind CSS cache
- Rebuild the project
- Check `tailwind.config.js` is updated ✅

### Layout issues
- Ensure `bg-background` and `text-on-surface` are applied to root elements
- Check responsive breakpoints (md, lg)
- Verify flexbox/grid classes are correct

### Animation stuttering
- Reduce blur effects
- Check for layout shifts
- Profile in DevTools

## Next Steps

### To customize further:
1. Update colors in `tailwind.config.js`
2. Modify fonts in Google Fonts import
3. Adjust animation speeds in `monolith.css`
4. Add new sections using existing components

### To add more features:
1. Analytics Page - Similar structure to existing pages
2. Settings Page - Form controls with Monolith styling
3. API integration - Connect chat to backend
4. User profiles - Profile picture and settings

## File Checklist

- ✅ `src/components/shared/TopAppBar.tsx`
- ✅ `src/components/shared/SideNavBar.tsx`
- ✅ `src/components/shared/MonolithFooter.tsx`
- ✅ `src/components/landing/MonolithLandingPage.tsx`
- ✅ `src/components/MonolithChatPage.tsx`
- ✅ `src/styles/monolith.css`
- ✅ `src/index.css` (updated)
- ✅ `src/main.tsx` (updated)
- ✅ `src/App.tsx` (updated)
- ✅ `frontend/tailwind.config.js` (updated)
- ✅ `MONOLITH_THEME.md` (documentation)

---

**Status**: ✅ Complete - Ready to use!
**Last Updated**: March 2024
