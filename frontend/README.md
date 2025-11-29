# Portfolio Frontend

A modern, responsive portfolio website built with Next.js, React, and TypeScript featuring real-time chat powered by WebSocket.

## Overview

This is the frontend application that:
- Displays portfolio information and projects
- Provides a real-time chat interface
- Supports dark mode
- Responsive mobile-first design
- Type-safe with full TypeScript support

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page with blob animations
│   └── page.module.css           # Home page styles
├── components/
│   ├── Layout.tsx                # Main layout component with glassmorphism header
│   ├── Layout.module.css
│   ├── Hero/
│   │   ├── Hero.tsx              # Hero section component
│   │   ├── Hero.module.css       # Hero styles
│   │   ├── BlobAnimation.tsx      # Animated blob component
│   │   └── MouseTracker.tsx       # Mouse tracking utility
│   ├── About/
│   │   ├── About.tsx             # About section
│   │   └── About.module.css
│   ├── Projects/
│   │   ├── Projects.tsx          # Projects showcase
│   │   └── Projects.module.css
│   ├── CTA/
│   │   ├── CTA.tsx               # Call-to-action section
│   │   └── CTA.module.css
│   ├── Chat.tsx                  # Chat component
│   └── Chat.module.css
├── hooks/
│   └── useIntersectionObserver.ts # Custom hook for scroll animations
├── lib/
│   └── websocket.ts              # WebSocket client
├── styles/
│   ├── globals.css               # Global styles with theme support
│   └── animations.css            # Animation keyframes
├── public/                        # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
├── .env.example
└── README.md
```

## Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Setup

```bash
# Copy environment file
cp .env.example .env.local

# Install dependencies
npm install

# Or with yarn
yarn install
```

## Running the Development Server

```bash
# Start development server with hot reload
npm run dev

# Or with yarn
yarn dev
```

The application will be available at `http://localhost:3000`

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Configuration

Edit `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Note**: Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Components

### Layout

Main layout component that provides:
- Glassmorphism header with blur effect
- Theme toggle (light/dark mode)
- Footer with links

**Props**: `children: React.ReactNode`

### Hero

Landing section with:
- Animated gradient text
- Blob background animations
- CTA buttons
- Scroll indicator
- Intersection observer animations

### BlobAnimation

Animated blob shapes that:
- Float and animate with keyframe animations
- Support multiple variants (primary, secondary, tertiary)
- Configurable size and positioning
- Blend mode for visual depth
- Framer Motion powered

**Props**:
- `variant`: 'primary' | 'secondary' | 'tertiary'
- `size`: 'small' | 'medium' | 'large'
- `duration`: animation duration in seconds
- `delay`: animation delay in seconds
- `top`, `right`, `left`: positioning

### About

Portfolio introduction section with:
- Professional summary
- Skills showcase
- Experience highlights

### Projects

Projects showcase featuring:
- Project cards with descriptions
- Links to live demos and repositories
- Technology stack display
- Responsive grid layout

### CTA

Call-to-action section with:
- Final message
- Contact links
- Social media integration

### Chat

Real-time chat component that provides:
- User authentication (username)
- Message sending and receiving
- User count display
- Message history
- Error handling

**Props**: `apiUrl: string`

## Features

### Modern Design System

- Animated blob backgrounds with glassmorphism effects
- Gradient text and blend modes
- Smooth scroll animations with Intersection Observer
- Framer Motion powered interactions

### Dark Mode

- Toggle button in header
- Persisted in localStorage
- Respects system preference on first visit
- CSS custom properties for theme colors
- Glassmorphic header adapts to theme

### Responsive Design

- Mobile-first approach
- Breakpoints at 768px, 1024px, 1200px
- Flexible grid layouts
- Touch-friendly buttons and inputs
- Responsive blob positioning

### Scroll Animations

- Intersection Observer Hook for performance
- Staggered animations on element enter
- Fade and slide effects
- Once-trigger animations to prevent reflow

### Real-time Chat

- WebSocket connection management
- Auto-reconnection with exponential backoff
- Message history on connect
- User count tracking
- System messages for join/leave events
- Input validation and character counter
- Typing indicators (future enhancement)

### Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Respects prefers-reduced-motion

## Styling

### CSS Architecture

- **globals.css**: Theme variables, base styles, and animations
- **animations.css**: Keyframe animations (fadeIn, slideUp, etc.)
- **Layout.module.css**: Layout and header styles with glassmorphism
- **Hero.module.css**: Hero section and blob animations
- **About.module.css**: About section styles
- **Projects.module.css**: Projects grid and card styles
- **CTA.module.css**: Call-to-action section styles
- **Chat.module.css**: Chat component styles
- **page.module.css**: Page-level styles

### Theme Colors

Light mode:
```css
--bg-primary: #ffffff
--bg-secondary: #f5f5f5
--text-primary: #000000
--text-secondary: #666666
--accent-color: #0066cc
--color-cyan: #00d9ff
--color-pink: #ff006e
--color-violet: #8338ec
```

Dark mode:
```css
--bg-primary: #1a1a1a
--bg-secondary: #2d2d2d
--text-primary: #ffffff
--text-secondary: #b0b0b0
--accent-color: #3b82f6
--color-cyan: #00d9ff
--color-pink: #ff006e
--color-violet: #8338ec
```

### Glassmorphism Effect

Header uses:
- Semi-transparent background (60% opacity)
- Backdrop blur (10px)
- Subtle border with reduced opacity
- Smooth transitions between themes

## WebSocket Client

The `lib/websocket.ts` provides a WebSocket client with:

### Methods

- `connect()` - Connect to WebSocket server
- `disconnect()` - Disconnect and cleanup
- `sendMessage(content: string)` - Send a chat message
- `isConnected()` - Check connection status
- `onMessage(handler)` - Subscribe to messages
- `onError(handler)` - Subscribe to errors
- `onStatus(handler)` - Subscribe to status changes

### Auto-reconnection

- Exponential backoff: 1s, 2s, 4s, 8s, 16s
- Max 5 reconnection attempts
- Configurable retry parameters

### Heartbeat

- Sends pong every 30 seconds
- Maintains connection state
- Auto-cleanup on timeout

## API Integration

### Chat WebSocket

```typescript
const ws = new ChatWebSocket(
  'ws://localhost:8000/ws/chat',
  'username'
);

await ws.connect();

ws.onMessage((msg) => {
  if (msg.type === 'message') {
    // Handle new message
  }
});

ws.sendMessage('Hello world');
```

### Statistics API

```typescript
const response = await fetch('http://localhost:8000/api/stats');
const data = await response.json();
console.log(data.active_users);
```

## Testing

### Manual Testing

1. Open http://localhost:3000 in browser
2. Enter a username and join chat
3. Send messages and verify they appear for all users
4. Test dark mode toggle
5. Test responsive design by resizing browser

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Performance Optimization

### Code Splitting

- Next.js automatically splits code at page level
- Dynamic imports for heavy components
- Route-based code splitting

### Image Optimization

- Next.js Image component for optimization
- Automatic format conversion
- Responsive image loading

### CSS Optimization

- CSS Modules for scope isolation
- Tree-shaking unused styles
- Minification in production

### Runtime Performance

- React 18 concurrent features
- Efficient state updates
- Memo for expensive components
- Debounced resize handlers

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### WebSocket Connection Failed

**Problem**: Chat fails to connect

**Solutions**:
1. Verify backend is running
2. Check `NEXT_PUBLIC_API_URL` is correct
3. Check browser console for errors
4. Verify CORS is configured

### Dark Mode Not Persisting

**Problem**: Theme resets on page reload

**Solutions**:
1. Check if localStorage is enabled
2. Clear browser cache
3. Check browser dev tools console
4. Verify CSS variables are defined

### Styles Not Applying

**Problem**: CSS changes not visible

**Solutions**:
1. Clear Next.js cache: `rm -rf .next`
2. Restart dev server
3. Check CSS Module imports
4. Verify CSS file paths

### Performance Issues

**Problem**: Slow load time or animations

**Solutions**:
1. Check network tab in dev tools
2. Verify bundle size: `npm run build`
3. Use React DevTools Profiler
4. Check for unnecessary re-renders

## Development Workflow

```bash
# Start development
npm run dev

# In another terminal, run tests
npm run type-check

# Format code
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Code Quality

### ESLint

Configuration in `.eslintrc.json` enforces:
- Next.js best practices
- React hooks rules
- TypeScript best practices

### TypeScript

Strict mode enabled:
- No implicit any
- Strict null checks
- Strict function types

### Prettier

Auto-formatting for consistent code style (via black/ruff in Next.js config)

## Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Optional
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_VERSION=0.1.0
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
docker build -f Dockerfile.frontend -t portfolio-frontend .
docker run -p 3000:3000 portfolio-frontend
```

### Self-hosted

```bash
npm run build
npm start
```

## Dependencies

### Core
- `next` - React framework
- `react` - UI library
- `react-dom` - DOM rendering

### Utilities
- `next-themes` - Dark mode support

### Development
- `typescript` - Type safety
- `eslint` - Linting
- `@types/react` - React type definitions
- `@types/node` - Node.js type definitions

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

## License

MIT License - See [LICENSE](../LICENSE) for details.
