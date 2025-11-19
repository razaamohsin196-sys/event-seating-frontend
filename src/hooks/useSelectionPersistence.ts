import { useEffect, useRef } from 'react';
import { Venue, Seat } from '@/types/venue';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEY } from '@/utils/constants';
import { canSelectSeat, findSeatById } from '@/utils/seatUtils';

interface UseSelectionPersistenceProps {
  venue: Venue | null;
  selectedSeats: Seat[];
  onLoadSelection: (seats: Seat[]) => void;
}

/**
 * Custom hook to handle selection persistence in localStorage
 * Restores selection on mount and saves changes
 */
export function useSelectionPersistence({
  venue,
  selectedSeats,
  onLoadSelection,
}: UseSelectionPersistenceProps) {
  const [storedSeatIds, setStoredSeatIds] = useLocalStorage<string[]>(STORAGE_KEY, []);
  const hasRestoredRef = useRef(false);

  // Restore selection from localStorage (only once)
  useEffect(() => {
    if (venue && !hasRestoredRef.current) {
      hasRestoredRef.current = true;
      
      if (storedSeatIds.length > 0) {
        const restoredSeats: Seat[] = [];
        
        for (const seatId of storedSeatIds) {
          const seat = findSeatById(venue.sections, seatId);
          if (seat && canSelectSeat(seat)) {
            restoredSeats.push(seat);
          }
        }

        if (restoredSeats.length > 0) {
          onLoadSelection(restoredSeats);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venue]);

  useEffect(() => {
    if (venue && hasRestoredRef.current) {
      const seatIds = selectedSeats.map((seat) => seat.id);
      setStoredSeatIds(seatIds);
    }
  }, [venue, selectedSeats, setStoredSeatIds]);
}