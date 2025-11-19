import { useState, useMemo } from 'react';
import { useSeating } from '@/context/SeatingContext';
import { findAdjacentSeatsInVenue } from '@/utils/adjacentSeatsUtils';
import { AdjacentSeatsResultsModal } from './AdjacentSeatsResultsModal';
import type { Seat } from '@/types/venue';
import { Target, Search } from 'lucide-react';

export function AdjacentSeatsFinder() {
  const { state, selectSeat, clearSelection } = useSeating();
  const venue = state.venue;
  const [seatCount, setSeatCount] = useState<number>(2);
  const [inputValue, setInputValue] = useState<string>('2');
  const [showResults, setShowResults] = useState(false);

  const adjacentGroups = useMemo(() => {
    if (!venue || seatCount < 1) return [];
    return findAdjacentSeatsInVenue(venue.sections, seatCount);
  }, [venue, seatCount]);

  const handleFindSeats = () => {
    setShowResults(true);
  };

  const handleSelectGroup = (seats: Seat[]) => {
    clearSelection();

    seats.forEach((seat) => {
      selectSeat(seat);
    });

    setShowResults(false);
  };

  const handleClose = () => {
    setShowResults(false);
  };

  if (!venue) return null;

  return (
    <div className="mb-3 sm:mb-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 transition-colors">
      <div className="flex flex-col gap-2 sm:gap-3">
        <label htmlFor="seat-count" className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600 flex-shrink-0" />
          <span>Find Adjacent Seats</span>
        </label>
        <div className="flex gap-2 items-center">
          <input
            id="seat-count"
            type="number"
            min="1"
            max="8"
            value={inputValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setInputValue(newValue);
              
              const numValue = parseInt(newValue);
              if (!isNaN(numValue) && numValue >= 1 && numValue <= 8) {
                setSeatCount(numValue);
              }
            }}
            onBlur={() => {
              const numValue = parseInt(inputValue);
              if (isNaN(numValue) || numValue < 1) {
                setSeatCount(2);
                setInputValue('2');
              } else if (numValue > 8) {
                setSeatCount(8);
                setInputValue('8');
              } else {
                setInputValue(String(numValue));
              }
            }}
            className="w-14 sm:w-16 px-2 sm:px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-xs sm:text-sm text-center font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            aria-label="Number of adjacent seats to find"
          />
          <button
            onClick={handleFindSeats}
            className="flex-1 flex items-center justify-center space-x-1.5 sm:space-x-2 py-2 px-3 sm:px-4 bg-primary-600 text-white rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-all hover:bg-primary-700 hover:shadow-md active:scale-95"
            aria-label={`Find ${seatCount} adjacent seats`}
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>Find Seats</span>
          </button>
        </div>
      </div>

      {showResults && (
        <AdjacentSeatsResultsModal
          seatCount={seatCount}
          adjacentGroups={adjacentGroups}
          onSelectGroup={handleSelectGroup}
          onClose={handleClose}
        />
      )}
    </div>
  );
}