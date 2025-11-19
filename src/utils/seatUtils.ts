import { Seat, Section } from '@/types/venue';
import { PRICE_TIERS } from './constants';

/**
 * Get the price for a seat based on its price tier
 */
export const getSeatPrice = (seat: Seat): number => {
  return PRICE_TIERS[seat.priceTier] || 0;
};

/**
 * Calculate the total price for an array of seats
 */
export const calculateTotal = (seats: Seat[]): number => {
  return seats.reduce((total, seat) => total + getSeatPrice(seat), 0);
};

/**
 * Check if a seat can be selected (must be available)
 */
export const canSelectSeat = (seat: Seat): boolean => {
  return seat.status === 'available';
};

/**
 * Format seat label for accessibility
 */
export const formatSeatLabel = (seat: Seat, sectionLabel: string, rowIndex: number): string => {
  const status = seat.status.charAt(0).toUpperCase() + seat.status.slice(1);
  const price = getSeatPrice(seat);
  return `Section ${sectionLabel}, Row ${rowIndex}, Seat ${seat.col}, ${status}, $${price}`;
};

/**
 * Get all seats from venue sections
 */
export const getAllSeats = (sections: Section[]): Seat[] => {
  const seats: Seat[] = [];
  sections.forEach((section) => {
    section.rows.forEach((row) => {
      seats.push(...row.seats);
    });
  });
  return seats;
};

/**
 * Find a seat by ID across all sections
 */
export const findSeatById = (sections: Section[], seatId: string): Seat | undefined => {
  for (const section of sections) {
    for (const row of section.rows) {
      const seat = row.seats.find((s) => s.id === seatId);
      if (seat) return seat;
    }
  }
  return undefined;
};

/**
 * Get section and row info for a seat
 */
export const getSeatContext = (
  sections: Section[],
  seatId: string
): { section: Section; rowIndex: number } | null => {
  for (const section of sections) {
    for (const row of section.rows) {
      if (row.seats.some((s) => s.id === seatId)) {
        return { section, rowIndex: row.index };
      }
    }
  }
  return null;
};

/**
 * Check if a seat is within the viewport bounds
 */
export const isSeatInViewport = (
  seat: Seat,
  transform: { x: number; y: number; scale: number },
  viewBox: { x: number; y: number; width: number; height: number },
  buffer: number = 0
): boolean => {
  const seatX = seat.x * transform.scale + transform.x;
  const seatY = seat.y * transform.scale + transform.y;

  return (
    seatX >= viewBox.x - buffer &&
    seatX <= viewBox.x + viewBox.width + buffer &&
    seatY >= viewBox.y - buffer &&
    seatY <= viewBox.y + viewBox.height + buffer
  );
};