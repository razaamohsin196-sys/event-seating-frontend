import { Seat } from '@/types/venue';
import { AdjacentSeatGroup } from './types';
import { SeatGroupItem } from './SeatGroupItem';
import { Target, X, Armchair } from 'lucide-react';

interface AdjacentSeatsResultsModalProps {
  seatCount: number;
  adjacentGroups: AdjacentSeatGroup[];
  onSelectGroup: (seats: Seat[]) => void;
  onClose: () => void;
}

export function AdjacentSeatsResultsModal({
  seatCount,
  adjacentGroups,
  onSelectGroup,
  onClose,
}: AdjacentSeatsResultsModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 animate-slide-in transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <h3 className="m-0 text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary-600" />
            <span>
              Found {adjacentGroups.length} group{adjacentGroups.length !== 1 ? 's' : ''} of {seatCount} adjacent seats
            </span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-all"
            aria-label="Close results"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-5">
          {adjacentGroups.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
              <Armchair className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-700 dark:text-slate-300 text-base font-semibold">No groups found</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                No groups of {seatCount} adjacent available seats found.<br />
                Try a smaller number.
              </p>
            </div>
          ) : (
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {adjacentGroups.map((group, index) => (
                <SeatGroupItem
                  key={index}
                  group={group}
                  onSelect={() => onSelectGroup(group.seats)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}