// Price tier to price mapping (in dollars)
export const PRICE_TIERS: Record<number, number> = {
  1: 150,
  2: 100,
  3: 75,
  4: 50,
};

// Maximum number of seats that can be selected
export const MAX_SEAT_SELECTION = 8;

// LocalStorage key for persisting selection
export const STORAGE_KEY = 'event-seating-selection';

// Seat visual properties
export const SEAT_RADIUS = 12; // Increased from 8 to 12 for better visibility
export const SEAT_SPACING = 20;

// Color scheme for seat statuses
export const SEAT_COLORS = {
  available: '#4CAF50',
  reserved: '#9E9E9E',
  sold: '#F44336',
  held: '#FF9800',
  selected: '#2196F3',
  focused: '#1976D2',
};

// Heat map colors by price tier (expensive to cheap)
export const HEAT_MAP_COLORS: Record<number, string> = {
  1: '#D32F2F', // Tier 1 (most expensive) - Dark Red
  2: '#F57C00', // Tier 2 - Orange
  3: '#FBC02D', // Tier 3 - Yellow
  4: '#388E3C', // Tier 4 (cheapest) - Green
};

// Viewport culling buffer (pixels)
export const VIEWPORT_BUFFER = 100;