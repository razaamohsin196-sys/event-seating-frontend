# Interactive Event Seating Map

A React + TypeScript application for selecting seats at an event venue with an interactive seating map.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run E2E tests
pnpm test

# Run E2E tests with UI
pnpm test:ui

# Show test report
pnpm test:report

# Lint code
pnpm lint

# Format code
pnpm format
```

The application will be available at `http://localhost:5173/`


### Core Features ✅
- ✅ Load venue data from `public/venue.json` and render all seats
- ✅ Smooth rendering (~60fps) optimized for large venues
- ✅ Seat selection via mouse click
- ✅ Seat selection via keyboard (Tab, Enter, Space)
- ✅ Display seat details on click or focus
- ✅ Select up to 8 seats with live counter
- ✅ Live selection summary with price subtotal
- ✅ Persist selection in localStorage across page reloads
- ✅ ARIA labels on all interactive elements
- ✅ Focus outline and keyboard navigation support
- ✅ Responsive design for desktop and mobile viewports

### Technical Requirements ✅
- ✅ React 18.3.1
- ✅ TypeScript with strict mode enabled
- ✅ Vite build tool
- ✅ ESLint and Prettier configured
- ✅ Clean, modular code structure

### Technology Choices

#### **Vite + React** (vs Next.js)
- **Why**: Faster dev server with ESBuild, simpler configuration for SPA
- **Trade-off**: No SSR (not needed for this use case)

#### **SVG Rendering** (vs Canvas)
- **Why**: Better accessibility (DOM elements), easier event handling, scalable graphics
- **Trade-off**: Performance can degrade with 15k+ elements
- **Mitigation**: React.memo, event delegation, viewport culling ready

#### **Context + useReducer** (vs Redux)
- **Why**: Built-in, simpler for this scope, no extra bundle size
- **Trade-off**: No DevTools
- **Mitigation**: Sufficient for single-page app with limited state


### Project Structure

```
src/
├── components/
│   ├── Layout/              # Main layout wrapper
│   ├── SeatingMap/          # Seating map with SVG rendering
│   │   ├── SeatingMap.tsx   # Main map container
│   │   ├── Section.tsx      # Section grouping
│   │   ├── Seat.tsx         # Individual seat (memoized)
│   │   └── SeatDetails.tsx  # Seat information panel
│   └── SelectionSummary/    # Selected seats list & total
├── context/
│   ├── SeatingContext.tsx   # Global state management
│   └── types.ts             # Context type definitions
├── hooks/
│   ├── useLocalStorage.ts   # Persistence hook
│   └── useVenueData.ts      # Data loading hook
├── services/
│   └── venueService.ts      # API/data fetching
├── types/
│   └── venue.ts             # Core type definitions
├── utils/
│   ├── constants.ts         # App constants
│   └── seatUtils.ts         # Helper functions
├── App.tsx                  # Root component
└── main.tsx                 # Entry point
```

### State Management

The application uses React Context with useReducer for state management:

**State Structure:**
```typescript
{
  venue: Venue | null,           // Venue data from JSON
  selectedSeats: Seat[],         // Currently selected seats (max 8)
  focusedSeatId: string | null,  // Currently focused seat
  loading: boolean,              // Loading state
  error: Error | null            // Error state
}
```

**Actions:**
- `SET_VENUE` - Load venue data
- `SELECT_SEAT` - Add seat to selection
- `DESELECT_SEAT` - Remove seat from selection
- `CLEAR_SELECTION` - Clear all selections
- `LOAD_SELECTION` - Restore from localStorage
- `SET_FOCUSED_SEAT` - Update focused seat

### Performance Optimizations

1. **Viewport Culling** - Only renders seats visible in the current viewport (with 200px buffer)
   - Implemented via [`useViewportCulling`](src/hooks/useViewportCulling.ts:1) hook
   - Reduces render count from 15,000 to ~500-1000 visible seats
   - Performance metrics displayed in development mode
2. **React.memo** - Seat components are memoized to prevent unnecessary re-renders
3. **Event Delegation** - Single click handler on parent SVG instead of per-seat handlers
4. **useRef** - Break circular dependencies in useEffect
5. **Efficient Re-renders** - Only update affected components

### Accessibility Features

- **Keyboard Navigation**: Tab through seats, Enter/Space to select
- **ARIA Labels**: Descriptive labels on all interactive elements
- **Focus Management**: Visible focus outlines (2px solid)
- **Screen Reader Support**: Proper semantic HTML and ARIA attributes
- **Live Regions**: Selection updates announced to screen readers

## 🎨 Features

### Core Features

#### Seat Selection
- Click any available seat to select it
- Selected seats turn blue
- Maximum 8 seats can be selected
- Visual feedback for different seat statuses:
  - 🟢 Green: Available
  - 🔵 Blue: Selected
  - ⚫ Gray: Reserved
  - 🔴 Red: Sold
  - 🟠 Orange: Held

### Bonus Features

#### Arrow Key Navigation ✨
- Navigate between seats using arrow keys (↑ ↓ ← →)
- Press Enter or Space to select the focused seat
- Automatic scrolling to keep focused seat in view
- Visual focus indicator on the current seat
- Works seamlessly with mouse/touch interaction

#### Heat Map Visualization ✨
- Toggle between status view and price tier heat map
- Click the "🔥 Heat Map" button to visualize seats by price
- Color-coded by price tier:
  - 🔴 Red: Tier 1 ($150) - Most expensive
  - 🟠 Orange: Tier 2 ($100)
  - 🟡 Yellow: Tier 3 ($75)
  - 🟢 Green: Tier 4 ($50) - Cheapest
- Dynamic legend updates based on current view mode
- Helps users quickly identify pricing zones

### Find Adjacent Seats ✨
- Automatically find groups of N consecutive available seats
- Enter desired number of seats (1-8) in the input field
- Click "🔍 Find Seats" to search all sections
- Modal displays all available groups with:
  - Section, row, and seat range
  - Total price for the group
  - One-click selection button
- Selecting a group automatically:
  - Clears current selection
  - Selects all seats in the group
  - Updates the selection summary
- Perfect for finding seats together for groups

#### Dark Mode Toggle ✨
- System preference detection on first load
- Manual toggle with sun/moon icon in header
- WCAG AA compliant contrast ratios in both modes
- Smooth transitions between light and dark themes
- Persists preference in localStorage
- All components fully styled for dark mode

#### Pinch-Zoom & Pan ✨
- Mouse wheel zoom (desktop)
- Pinch-to-zoom gesture (mobile/trackpad)
- Pan/drag to move around the map
- Double-click to reset zoom level
- Zoom range: 0.5x to 4x
- Smooth animations and transitions

### Selection Summary
- Live list of selected seats
- Individual seat removal (× button)
- Real-time price calculation
- Remaining seats counter
- Clear All button

### Seat Details
- Section, Row, and Seat number
- Price information
- Current status
- Updates on click or keyboard focus

```


