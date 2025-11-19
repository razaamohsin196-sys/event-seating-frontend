import { memo } from 'react';
import { Seat as SeatType } from '@/types/venue';
import { SEAT_RADIUS, SEAT_COLORS, HEAT_MAP_COLORS } from '@/utils/constants';

interface SeatProps {
  seat: SeatType;
  sectionLabel: string;
  rowIndex: number;
  isSelected: boolean;
  isFocused: boolean;
  onClick: (seat: SeatType) => void;
  onFocus: (seatId: string) => void;
  ariaLabel: string;
  heatMapEnabled?: boolean;
}

function SeatComponent({
  seat,
  isSelected,
  isFocused,
  onClick,
  onFocus,
  ariaLabel,
  heatMapEnabled = false,
}: SeatProps) {
  const handleClick = () => {
    onFocus(seat.id);
    onClick(seat);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(seat);
    }
  };

  const handleFocus = () => {
    onFocus(seat.id);
  };

  const handleBlur = () => {
    onFocus('');
  };

  const getSeatColor = (): string => {
    if (isSelected) return SEAT_COLORS.selected;
    if (isFocused) return SEAT_COLORS.focused;
    
    if (heatMapEnabled) {
      return HEAT_MAP_COLORS[seat.priceTier] || SEAT_COLORS[seat.status];
    }
    
    return SEAT_COLORS[seat.status];
  };

  const isInteractive = seat.status === 'available';

  return (
    <circle
      cx={seat.x}
      cy={seat.y}
      r={SEAT_RADIUS}
      fill={getSeatColor()}
      stroke={isFocused ? '#000' : 'none'}
      strokeWidth={isFocused ? 2 : 0}
      style={{
        cursor: isInteractive ? 'pointer' : 'not-allowed',
        opacity: isInteractive ? 1 : 0.6,
        pointerEvents: 'auto',
        transition: 'all 0.2s',
      }}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      onFocus={isInteractive ? handleFocus : undefined}
      onBlur={isInteractive ? handleBlur : undefined}
      tabIndex={isInteractive ? 0 : -1}
      role="button"
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      aria-disabled={!isInteractive}
      data-seat-id={seat.id}
      data-status={seat.status}
    />
  );
}

export const Seat = memo(SeatComponent, (prevProps, nextProps) => {
  return (
    prevProps.seat.id === nextProps.seat.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isFocused === nextProps.isFocused &&
    prevProps.seat.status === nextProps.seat.status &&
    prevProps.heatMapEnabled === nextProps.heatMapEnabled
  );
});