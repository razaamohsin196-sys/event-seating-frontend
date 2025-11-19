import { Seat } from '@/types/venue';
import { getSeatPrice, getSeatContext } from '@/utils/seatUtils';
import { useSeating } from '@/context/SeatingContext';
import { MapPin, Rows, Armchair, DollarSign, Info, CheckCircle2, Lock, XCircle, Clock } from 'lucide-react';

interface SeatDetailsProps {
  seat: Seat | null;
}

const statusConfig = {
  available: {
    color: 'text-emerald-600 bg-emerald-50',
    icon: CheckCircle2,
    label: 'Available',
  },
  reserved: {
    color: 'text-gray-600 bg-gray-50',
    icon: Lock,
    label: 'Reserved',
  },
  sold: {
    color: 'text-red-600 bg-red-50',
    icon: XCircle,
    label: 'Sold',
  },
  held: {
    color: 'text-amber-600 bg-amber-50',
    icon: Clock,
    label: 'Held',
  },
};

export function SeatDetails({ seat }: SeatDetailsProps) {
  const { state } = useSeating();

  if (!seat || !state.venue) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6 flex items-center justify-center transition-colors">
        <div className="text-center">
          <Info className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2 sm:mb-3" />
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">Click on a seat</p>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">to view details</p>
        </div>
      </div>
    );
  }

  const context = getSeatContext(state.venue.sections, seat.id);
  const price = getSeatPrice(seat);
  const statusInfo = statusConfig[seat.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 transition-colors">
      <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3 flex items-center space-x-1.5 sm:space-x-2">
        <Armchair className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600 flex-shrink-0" />
        <span>Seat Details</span>
      </h3>
      
      <dl className="space-y-1.5 sm:space-y-2">
        {/* Section */}
        <div className="flex items-center justify-between py-1.5 px-2 sm:px-2.5 bg-slate-50 dark:bg-slate-700 rounded-md">
          <dt className="flex items-center space-x-1 sm:space-x-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span>Section</span>
          </dt>
          <dd className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate ml-2">
            {context?.section.label || 'N/A'}
          </dd>
        </div>

        {/* Row */}
        <div className="flex items-center justify-between py-1.5 px-2 sm:px-2.5 bg-slate-50 dark:bg-slate-700 rounded-md">
          <dt className="flex items-center space-x-1 sm:space-x-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Rows className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span>Row</span>
          </dt>
          <dd className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            {context?.rowIndex || 'N/A'}
          </dd>
        </div>

        {/* Seat Number */}
        <div className="flex items-center justify-between py-1.5 px-2 sm:px-2.5 bg-slate-50 dark:bg-slate-700 rounded-md">
          <dt className="flex items-center space-x-1 sm:space-x-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Armchair className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span>Seat</span>
          </dt>
          <dd className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            {seat.col}
          </dd>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between py-1.5 px-2 sm:px-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-md border border-emerald-200 dark:border-emerald-700">
          <dt className="flex items-center space-x-1 sm:space-x-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span>Price</span>
          </dt>
          <dd className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400">
            ${price}
          </dd>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between py-1.5 px-2 sm:px-2.5 bg-slate-50 dark:bg-slate-700 rounded-md">
          <dt className="flex items-center space-x-1 sm:space-x-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span>Status</span>
          </dt>
          <dd className={`flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 rounded-md text-xs font-semibold ${statusInfo.color}`}>
            <StatusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{statusInfo.label}</span>
          </dd>
        </div>
      </dl>
    </div>
  );
}