import { useMemo, useState, useCallback, useEffect } from 'react';
import { Seat, Section } from '@/types/venue';
import { isSeatInViewport } from '@/utils/seatUtils';

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseViewportCullingOptions {
  sections: Section[];
  mapWidth: number;
  mapHeight: number;
  buffer?: number;
}

interface UseViewportCullingResult {
  visibleSeats: Map<string, Seat[]>;
  viewBox: ViewBox;
  totalSeats: number;
  visibleSeatCount: number;
  updateViewBox: (newViewBox: ViewBox) => void;
}

export function useViewportCulling({
  sections,
  mapWidth,
  mapHeight,
  buffer = 200,
}: UseViewportCullingOptions): UseViewportCullingResult {
  const [viewBox, setViewBox] = useState<ViewBox>({
    x: 0,
    y: 0,
    width: mapWidth,
    height: mapHeight,
  });

  const totalSeats = useMemo(() => {
    return sections.reduce((total, section) => {
      return total + section.rows.reduce((rowTotal, row) => rowTotal + row.seats.length, 0);
    }, 0);
  }, [sections]);

  const visibleSeats = useMemo(() => {
    const seatMap = new Map<string, Seat[]>();

    sections.forEach((section) => {
      const visibleSectionSeats: Seat[] = [];

      section.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          if (isSeatInViewport(seat, section.transform, viewBox, buffer)) {
            visibleSectionSeats.push(seat);
          }
        });
      });

      if (visibleSectionSeats.length > 0) {
        seatMap.set(section.id, visibleSectionSeats);
      }
    });

    return seatMap;
  }, [sections, viewBox, buffer]);

  const visibleSeatCount = useMemo(() => {
    let count = 0;
    visibleSeats.forEach((seats) => {
      count += seats.length;
    });
    return count;
  }, [visibleSeats]);

  const updateViewBox = useCallback((newViewBox: ViewBox) => {
    setViewBox(newViewBox);
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[Viewport Culling]', {
        totalSeats,
        visibleSeats: visibleSeatCount,
        cullingRatio: `${((1 - visibleSeatCount / totalSeats) * 100).toFixed(1)}%`,
        viewBox,
      });
    }
  }, [totalSeats, visibleSeatCount, viewBox]);

  return {
    visibleSeats,
    viewBox,
    totalSeats,
    visibleSeatCount,
    updateViewBox,
  };
}