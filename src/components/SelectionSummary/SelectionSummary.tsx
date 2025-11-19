import { useSeating } from '@/context/SeatingContext';
import { calculateTotal, getSeatPrice, getSeatContext } from '@/utils/seatUtils';
import { MAX_SEAT_SELECTION } from '@/utils/constants';
import { Ticket, Armchair, DollarSign, Trash2, AlertCircle } from 'lucide-react';

export function SelectionSummary() {
  const { state, clearSelection, deselectSeat } = useSeating();
  const { selectedSeats, venue } = state;

  const total = calculateTotal(selectedSeats);
  const remainingSeats = MAX_SEAT_SELECTION - selectedSeats.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 h-full flex flex-col transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5 sm:space-x-2 min-w-0">
          <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0" />
          <span className="truncate">Selected Seats</span>
        </h2>
        <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 sm:px-3 py-1 rounded-full flex-shrink-0 ml-2">
          {selectedSeats.length} / {MAX_SEAT_SELECTION}
        </span>
      </div>

      {selectedSeats.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-6 sm:py-8">
            <Armchair className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">No seats selected</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Click on available seats to select</p>
          </div>
        </div>
      ) : (
        <>
          {/* Seat List */}
          <div className="flex-1 overflow-y-auto mb-3 sm:mb-4 space-y-1.5 sm:space-y-2" role="list" aria-label="Selected seats">
            {selectedSeats.map((seat) => {
              const context = venue ? getSeatContext(venue.sections, seat.id) : null;
              const price = getSeatPrice(seat);

              return (
                <div
                  key={seat.id}
                  className="flex items-center justify-between p-2 sm:p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-sm transition-all"
                  role="listitem"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <Armchair className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600 flex-shrink-0" />
                      <span className="truncate">
                        {context?.section.label || 'N/A'} - Row {context?.rowIndex || 'N/A'}, Seat {seat.col}
                      </span>
                    </div>
                    <div className="flex items-center space-x-0.5 sm:space-x-1 mt-1 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>{price}</span>
                    </div>
                  </div>
                  <button
                    className="ml-2 sm:ml-3 p-1 sm:p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors flex-shrink-0"
                    onClick={() => deselectSeat(seat.id)}
                    aria-label={`Remove seat ${seat.id}`}
                    title="Remove seat"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-3 sm:pt-4 space-y-2 sm:space-y-3">
            {/* Total */}
            <div className="flex items-center justify-between py-2 px-2.5 sm:px-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-700">
              <span className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Total</span>
              </span>
              <span className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-400">${total}</span>
            </div>

            {/* Remaining Seats Message */}
            {remainingSeats > 0 && (
              <p className="text-xs text-slate-600 dark:text-slate-300 text-center py-2 bg-slate-50 dark:bg-slate-700 rounded-md" aria-live="polite">
                You can select {remainingSeats} more {remainingSeats === 1 ? 'seat' : 'seats'}
              </p>
            )}

            {/* Maximum Reached Message */}
            {selectedSeats.length === MAX_SEAT_SELECTION && (
              <div className="flex items-center space-x-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-2 rounded-md" aria-live="assertive">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold">Maximum seats selected</span>
              </div>
            )}

            {/* Clear All Button */}
            <button
              className="w-full flex items-center justify-center space-x-1.5 sm:space-x-2 py-2 sm:py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
              onClick={clearSelection}
              aria-label="Clear all selected seats"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Clear All</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}