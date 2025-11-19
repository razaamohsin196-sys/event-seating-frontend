import { Flame } from 'lucide-react';

interface SeatingMapHeaderProps {
  venueName: string;
  visibleSeatCount: number;
  totalSeats: number;
  culledPercentage: string;
  heatMapEnabled: boolean;
  onToggleHeatMap: () => void;
}

export function SeatingMapHeader({
  venueName,
  visibleSeatCount,
  totalSeats,
  culledPercentage,
  heatMapEnabled,
  onToggleHeatMap,
}: SeatingMapHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 md:mb-6 pb-3 sm:pb-4 border-b-2 border-slate-200 dark:border-slate-700 gap-3 sm:gap-0">
      <div className="min-w-0 flex-1">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">{venueName}</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          <span className="inline sm:hidden">{visibleSeatCount}/{totalSeats} seats</span>
          <span className="hidden sm:inline">{visibleSeatCount}/{totalSeats} seats rendered • {culledPercentage}% culled</span>
        </p>
      </div>
      <button
        onClick={onToggleHeatMap}
        className={`flex items-center justify-center space-x-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm flex-shrink-0 ${
          heatMapEnabled
            ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
        }`}
        aria-label={heatMapEnabled ? 'Show seat status' : 'Show price heat map'}
      >
        <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Heat Map</span>
      </button>
    </div>
  );
}