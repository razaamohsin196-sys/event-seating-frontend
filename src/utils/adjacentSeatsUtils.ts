import type { Seat, Section } from '../types/venue';

/**
 * Find groups of N adjacent available seats in a section
 * @param section - The section to search in
 * @param count - Number of adjacent seats to find
 * @returns Array of seat groups, each containing N consecutive available seats
 */
export function findAdjacentSeats(
  section: Section,
  count: number
): Seat[][] {
  if (count < 1) return [];

  const adjacentGroups: Seat[][] = [];

  // Search each row for consecutive available seats
  for (const row of section.rows) {
    const availableSeats = row.seats.filter(
      (seat) => seat.status === 'available'
    );

    // Sort seats by column to ensure they're in order
    availableSeats.sort((a, b) => a.col - b.col);

    // Find consecutive groups
    let currentGroup: Seat[] = [];

    for (let i = 0; i < availableSeats.length; i++) {
      const seat = availableSeats[i];
      const prevSeat = availableSeats[i - 1];

      // Check if this seat is consecutive with the previous one
      if (currentGroup.length === 0 || (prevSeat && seat.col === prevSeat.col + 1)) {
        currentGroup.push(seat);

        // If we've found enough consecutive seats, save the group
        if (currentGroup.length === count) {
          adjacentGroups.push([...currentGroup]);
          // Continue searching by removing the first seat
          currentGroup.shift();
        }
      } else {
        // Reset the group if seats aren't consecutive
        currentGroup = [seat];
      }
    }
  }

  return adjacentGroups;
}

/**
 * Find all groups of N adjacent available seats across all sections
 * @param sections - All venue sections
 * @param count - Number of adjacent seats to find
 * @returns Array of seat groups with section information
 */
export function findAdjacentSeatsInVenue(
  sections: Section[],
  count: number
): Array<{ section: Section; seats: Seat[] }> {
  const results: Array<{ section: Section; seats: Seat[] }> = [];

  for (const section of sections) {
    const groups = findAdjacentSeats(section, count);
    for (const seats of groups) {
      results.push({ section, seats });
    }
  }

  return results;
}

/**
 * Get a human-readable description of a seat group
 * @param section - The section containing the seats
 * @param seats - The group of seats
 * @returns Formatted string like "Section A, Row 1, Seats 5-8"
 */
export function formatSeatGroup(section: Section, seats: Seat[]): string {
  if (seats.length === 0) return '';

  const firstSeat = seats[0];
  const lastSeat = seats[seats.length - 1];
  const rowIndex = section.rows.find((row) =>
    row.seats.some((s) => s.id === firstSeat.id)
  )?.index;

  if (seats.length === 1) {
    return `${section.label}, Row ${rowIndex}, Seat ${firstSeat.col}`;
  }

  return `${section.label}, Row ${rowIndex}, Seats ${firstSeat.col}-${lastSeat.col}`;
}