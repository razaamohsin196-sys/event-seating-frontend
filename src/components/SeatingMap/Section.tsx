import { memo } from 'react';
import { Section as SectionType, Seat as SeatType } from '@/types/venue';
import { Seat } from './Seat';
import { formatSeatLabel } from '@/utils/seatUtils';

interface SectionProps {
  section: SectionType;
  selectedSeatIds: Set<string>;
  focusedSeatId: string | null;
  onSeatClick: (seat: SeatType) => void;
  onSeatFocus: (seatId: string) => void;
  visibleSeats?: SeatType[];
  heatMapEnabled?: boolean;
}

function SectionComponent({
  section,
  selectedSeatIds,
  focusedSeatId,
  onSeatClick,
  onSeatFocus,
  visibleSeats,
  heatMapEnabled = false,
}: SectionProps) {
  const { transform } = section;

  const seatsToRender = visibleSeats || section.rows.flatMap((row) => row.seats);
  
  if (import.meta.env.DEV) {
    console.log(`[Section ${section.id}] Rendering ${seatsToRender.length} seats`, {
      visibleSeatsProvided: !!visibleSeats,
      totalSeatsInSection: section.rows.reduce((sum, row) => sum + row.seats.length, 0),
    });
  }

  const seatToRowMap = new Map<string, number>();
  section.rows.forEach((row) => {
    row.seats.forEach((seat) => {
      seatToRowMap.set(seat.id, row.index);
    });
  });

  return (
    <g
      transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
      data-section-id={section.id}
    >
      <text
        x={0}
        y={-10}
        fontSize="14"
        fontWeight="bold"
        className="fill-slate-700 dark:fill-slate-300"
        aria-label={`Section ${section.label}`}
      >
        {section.label}
      </text>

      {seatsToRender.map((seat) => {
        const rowIndex = seatToRowMap.get(seat.id) || 1;
        return (
          <Seat
            key={seat.id}
            seat={seat}
            sectionLabel={section.label}
            rowIndex={rowIndex}
            isSelected={selectedSeatIds.has(seat.id)}
            isFocused={focusedSeatId === seat.id}
            onClick={onSeatClick}
            onFocus={onSeatFocus}
            ariaLabel={formatSeatLabel(seat, section.label, rowIndex)}
            heatMapEnabled={heatMapEnabled}
          />
        );
      })}
    </g>
  );
}

export const Section = memo(SectionComponent);