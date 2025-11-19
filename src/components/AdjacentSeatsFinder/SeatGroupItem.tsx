import { AdjacentSeatGroup } from './types';
import { formatSeatGroup } from '@/utils/adjacentSeatsUtils';
import { PRICE_TIERS } from '@/utils/constants';
import { MapPin, DollarSign, Armchair, CheckCircle2 } from 'lucide-react';

interface SeatGroupItemProps {
  group: AdjacentSeatGroup;
  onSelect: () => void;
}

export function SeatGroupItem({ group, onSelect }: SeatGroupItemProps) {
  const description = formatSeatGroup(group.section, group.seats);
  const totalPrice = group.seats.reduce(
    (sum, seat) => sum + (PRICE_TIERS[seat.priceTier] || 0),
    0
  );

  return (
    <li className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 transition-all gap-3 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500">
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center space-x-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0" />
          <span>{description}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-4 h-4" />
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <span className="text-xs text-slate-500">•</span>
          <div className="flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400">
            <Armchair className="w-3.5 h-3.5" />
            <span>{group.seats.length} seats</span>
          </div>
        </div>
      </div>
      <button
        onClick={onSelect}
        className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-emerald-600 text-white rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-emerald-700 hover:shadow-md active:scale-95 sm:w-auto w-full"
        aria-label={`Select ${description}`}
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Select Group</span>
      </button>
    </li>
  );
}