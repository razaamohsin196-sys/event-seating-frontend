import { useEffect, useCallback } from 'react';
import { Seat, Section } from '@/types/venue';

interface UseKeyboardNavigationProps {
  sections: Section[];
  focusedSeatId: string | null;
  onSeatFocus: (seatId: string) => void;
  onSeatSelect: (seat: Seat) => void;
}

export function useKeyboardNavigation({
  sections,
  focusedSeatId,
  onSeatFocus,
  onSeatSelect,
}: UseKeyboardNavigationProps) {
  const buildSeatGrid = useCallback(() => {
    const seats: Array<{ seat: Seat; sectionId: string; rowIndex: number }> = [];
    
    sections.forEach((section) => {
      section.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          seats.push({
            seat,
            sectionId: section.id,
            rowIndex: row.index,
          });
        });
      });
    });
    
    return seats;
  }, [sections]);

  const handleArrowNavigation = useCallback(
    (event: KeyboardEvent) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        return;
      }

      event.preventDefault();

      const seatGrid = buildSeatGrid();
      
      if (seatGrid.length === 0) return;

      if (!focusedSeatId) {
        const firstAvailableSeat = seatGrid.find(
          (item) => item.seat.status === 'available'
        );
        if (firstAvailableSeat) {
          onSeatFocus(firstAvailableSeat.seat.id);
        }
        return;
      }

      const currentIndex = seatGrid.findIndex(
        (item) => item.seat.id === focusedSeatId
      );
      
      if (currentIndex === -1) return;

      const currentItem = seatGrid[currentIndex];
      let targetSeat: typeof seatGrid[0] | null = null;

      switch (event.key) {
        case 'ArrowRight': {
          targetSeat = seatGrid.find(
            (item, idx) =>
              idx > currentIndex &&
              item.sectionId === currentItem.sectionId &&
              item.rowIndex === currentItem.rowIndex &&
              item.seat.col > currentItem.seat.col
          ) || null;
          break;
        }
        
        case 'ArrowLeft': {
          const candidates = seatGrid.filter(
            (item, idx) =>
              idx < currentIndex &&
              item.sectionId === currentItem.sectionId &&
              item.rowIndex === currentItem.rowIndex &&
              item.seat.col < currentItem.seat.col
          );
          targetSeat = candidates[candidates.length - 1] || null;
          break;
        }
        
        case 'ArrowDown': {
          targetSeat = seatGrid.find(
            (item, idx) =>
              idx > currentIndex &&
              item.sectionId === currentItem.sectionId &&
              item.rowIndex > currentItem.rowIndex
          ) || null;
          break;
        }
        
        case 'ArrowUp': {
          const candidates = seatGrid.filter(
            (item, idx) =>
              idx < currentIndex &&
              item.sectionId === currentItem.sectionId &&
              item.rowIndex < currentItem.rowIndex
          );
          targetSeat = candidates[candidates.length - 1] || null;
          break;
        }
      }

      if (targetSeat) {
        onSeatFocus(targetSeat.seat.id);
        
        const seatElement = document.querySelector(
          `[data-seat-id="${targetSeat.seat.id}"]`
        );
        if (seatElement) {
          seatElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
          });
        }
      }
    },
    [focusedSeatId, buildSeatGrid, onSeatFocus]
  );

  const handleSeatSelection = useCallback(
    (event: KeyboardEvent) => {
      if (!focusedSeatId || !['Enter', ' '].includes(event.key)) {
        return;
      }

      event.preventDefault();

      const seatGrid = buildSeatGrid();
      const focusedItem = seatGrid.find((item) => item.seat.id === focusedSeatId);
      
      if (focusedItem && focusedItem.seat.status === 'available') {
        onSeatSelect(focusedItem.seat);
      }
    },
    [focusedSeatId, buildSeatGrid, onSeatSelect]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleArrowNavigation(event);
      handleSeatSelection(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleArrowNavigation, handleSeatSelection]);
}