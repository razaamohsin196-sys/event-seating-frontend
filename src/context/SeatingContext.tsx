import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Seat } from '@/types/venue';
import { SeatingState, SeatingContextValue } from './types';
import { seatingReducer } from './seatingReducer';
import { useVenueData } from '@/hooks/useVenueData';
import { useSelectionPersistence } from '@/hooks/useSelectionPersistence';
import { MAX_SEAT_SELECTION } from '@/utils/constants';

const initialState: SeatingState = {
  venue: null,
  selectedSeats: [],
  focusedSeatId: null,
  loading: true,
  error: null,
  heatMapEnabled: false,
  venueFile: 'venue.json',
};


const SeatingContext = createContext<SeatingContextValue | undefined>(undefined);

interface SeatingProviderProps {
  children: ReactNode;
}

export function SeatingProvider({ children }: SeatingProviderProps) {
  const [state, dispatch] = useReducer(seatingReducer, initialState);
  const { venue, loading, error } = useVenueData(state.venueFile);

  useEffect(() => {
    if (venue) {
      dispatch({ type: 'SET_VENUE', payload: venue });
    }
  }, [venue]);

  useEffect(() => {
    if (loading) {
      dispatch({ type: 'SET_LOADING', payload: true });
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      dispatch({ type: 'SET_ERROR', payload: error });
    }
  }, [error]);

  const handleLoadSelection = useCallback((seats: Seat[]) => {
    dispatch({ type: 'LOAD_SELECTION', payload: seats });
  }, []);

  useSelectionPersistence({
    venue,
    selectedSeats: state.selectedSeats,
    onLoadSelection: handleLoadSelection,
  });

  const selectSeat = useCallback((seat: Seat) => {
    dispatch({ type: 'SELECT_SEAT', payload: seat });
  }, []);

  const deselectSeat = useCallback((seatId: string) => {
    dispatch({ type: 'DESELECT_SEAT', payload: seatId });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const toggleSeatSelection = useCallback((seat: Seat) => {
    dispatch({ type: 'TOGGLE_SEAT', payload: seat });
  }, []);

  const isSeatSelected = useCallback((seatId: string): boolean => {
    return state.selectedSeats.some((seat) => seat.id === seatId);
  }, [state.selectedSeats]);

  const canSelectMoreSeats = state.selectedSeats.length < MAX_SEAT_SELECTION;

  const toggleHeatMap = useCallback(() => {
    dispatch({ type: 'TOGGLE_HEAT_MAP' });
  }, []);

  const switchVenueFile = useCallback((venueFile: string) => {
    dispatch({ type: 'SET_VENUE_FILE', payload: venueFile });
  }, []);

  const value: SeatingContextValue = useMemo(() => ({
    state,
    dispatch,
    selectSeat,
    deselectSeat,
    clearSelection,
    toggleSeatSelection,
    isSeatSelected,
    canSelectMoreSeats,
    toggleHeatMap,
    switchVenueFile,
  }), [state, selectSeat, deselectSeat, clearSelection, toggleSeatSelection, isSeatSelected, canSelectMoreSeats, toggleHeatMap, switchVenueFile]);

  return <SeatingContext.Provider value={value}>{children}</SeatingContext.Provider>;
}

export function useSeating() {
  const context = useContext(SeatingContext);
  if (context === undefined) {
    throw new Error('useSeating must be used within a SeatingProvider');
  }
  return context;
}