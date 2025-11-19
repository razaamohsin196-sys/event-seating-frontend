import { Keyboard } from 'lucide-react';

interface SeatingMapLegendProps {
  heatMapEnabled: boolean;
}

export function SeatingMapLegend({ heatMapEnabled }: SeatingMapLegendProps) {
  return (
    <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 border-t-2 border-slate-200 dark:border-slate-700">
      <div className="hidden sm:flex items-center justify-center gap-2 mb-3 text-xs text-slate-500 dark:text-slate-400">
        <Keyboard className="w-4 h-4" />
        <span className="text-center">Use arrow keys to navigate, Enter/Space to select</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
        {heatMapEnabled ? (
          <>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-heatmap-tier1 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">Tier 1 ($150)</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-heatmap-tier2 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">Tier 2 ($100)</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-heatmap-tier3 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">Tier 3 ($75)</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-heatmap-tier4 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">Tier 4 ($50)</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-seat-selected flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">Selected</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-seat-available flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">Available</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-seat-selected flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">Selected</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-seat-reserved flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">Reserved</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-seat-sold flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">Sold</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-seat-held flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">Held</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}