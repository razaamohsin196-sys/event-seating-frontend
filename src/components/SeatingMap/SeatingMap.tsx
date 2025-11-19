import { useMemo, useCallback, useRef } from 'react';
import { useSeating } from '../../context/SeatingContext';
import { Section } from './Section';
import { SeatingMapHeader } from './SeatingMapHeader';
import { SeatingMapLegend } from './SeatingMapLegend';
import { LoadingState } from './LoadingState';
import { useViewportCulling } from '../../hooks/useViewportCulling';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

export function SeatingMap() {
  const { state, toggleSeatSelection, toggleHeatMap, dispatch } = useSeating();
  const venue = state.venue;
  const heatMapEnabled = state.heatMapEnabled;
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  // Memoize selectedSeatIds to prevent unnecessary re-renders
  const selectedSeatIds = useMemo(
    () => new Set(state.selectedSeats.map(s => s.id)),
    [state.selectedSeats]
  );

  const { visibleSeats, totalSeats, visibleSeatCount, updateViewBox } = useViewportCulling({
    sections: venue?.sections || [],
    mapWidth: venue?.map.width || 1024,
    mapHeight: venue?.map.height || 768,
  });

  const useViewportCullingEnabled = totalSeats > 1000;
  
  const culledPercentage = totalSeats > 0
    ? ((1 - visibleSeatCount / totalSeats) * 100).toFixed(1)
    : '0.0';

  const handleSeatFocus = useCallback((seatId: string) => {
    dispatch({ type: 'SET_FOCUSED_SEAT', payload: seatId });
  }, [dispatch]);

  useKeyboardNavigation({
    sections: venue?.sections || [],
    focusedSeatId: state.focusedSeatId,
    onSeatFocus: handleSeatFocus,
    onSeatSelect: toggleSeatSelection,
  });

  // Handle transform changes to update viewport culling
  const handleTransformChange = useCallback((ref: ReactZoomPanPinchRef) => {
    if (!venue) return;
    
    const { state: transformState } = ref;
    const { positionX, positionY, scale } = transformState;
    
    // Get the container dimensions
    const container = ref.instance.wrapperComponent;
    if (!container) return;
    
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Calculate the visible viewport in SVG coordinates
    const viewBox = {
      x: -positionX / scale,
      y: -positionY / scale,
      width: containerWidth / scale,
      height: containerHeight / scale,
    };
    
    updateViewBox(viewBox);
  }, [venue, updateViewBox]);

  if (!venue) {
    return <LoadingState />;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-4 md:p-6 flex flex-col transition-colors overflow-hidden" style={{ height: '100%', maxHeight: '100%', width: '100%' }}>
      <SeatingMapHeader
        venueName={venue.name}
        visibleSeatCount={visibleSeatCount}
        totalSeats={totalSeats}
        culledPercentage={culledPercentage}
        heatMapEnabled={heatMapEnabled}
        onToggleHeatMap={toggleHeatMap}
      />

      <div className="flex-1 overflow-hidden rounded-md sm:rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors" style={{ minHeight: '250px', maxHeight: 'calc(100% - 140px)' }}>
        <TransformWrapper
          ref={transformRef}
          initialScale={3}
          minScale={0.5}
          maxScale={8}
          centerOnInit
          wheel={{ step: 0.15 }}
          pinch={{ step: 5 }}
          doubleClick={{ mode: 'reset' }}
          panning={{ velocityDisabled: false }}
          limitToBounds={false}
          onTransformed={handleTransformChange}
          onInit={handleTransformChange}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg
              className="dark:bg-slate-900"
              width={venue.map.width}
              height={venue.map.height}
              viewBox={`0 0 ${venue.map.width} ${venue.map.height}`}
              preserveAspectRatio="xMidYMid meet"
              role="region"
              aria-label="Interactive seating map"
              style={{
                display: 'block',
                background: 'var(--tw-bg-opacity, 1) rgb(241 245 249 / var(--tw-bg-opacity))',
                shapeRendering: 'crispEdges',
                imageRendering: 'crisp-edges'
              }}
            >
              <rect x="0" y="0" width={venue.map.width} height={venue.map.height} className="fill-slate-50 dark:fill-slate-900" />
              {venue.sections.map((section) => (
                <Section
                  key={section.id}
                  section={section}
                  selectedSeatIds={selectedSeatIds}
                  focusedSeatId={state.focusedSeatId}
                  onSeatClick={toggleSeatSelection}
                  onSeatFocus={handleSeatFocus}
                  heatMapEnabled={heatMapEnabled}
                  visibleSeats={useViewportCullingEnabled ? visibleSeats.get(section.id) : undefined}
                />
              ))}
            </svg>
          </TransformComponent>
        </TransformWrapper>
      </div>

      <SeatingMapLegend heatMapEnabled={heatMapEnabled} />
    </div>
  );
}