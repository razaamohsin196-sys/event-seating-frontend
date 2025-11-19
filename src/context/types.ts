import { Dispatch } from 'react';
import { Seat, Venue } from '@/types/venue';

export interface SeatingState {
  venue: Venue | null;
  selectedSeats: Seat[];
  focusedSeatId: string | null;
  loading: boolean;
  error: Error | null;
  heatMapEnabled: boolean; // Heat map visualization toggle
}

export type SeatingAction =
  | { type: 'SET_VENUE'; payload: Venue }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SELECT_SEAT'; payload: Seat }
  | { type: 'DESELECT_SEAT'; payload: string }
  | { type: 'TOGGLE_SEAT'; payload: Seat }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'LOAD_SELECTION'; payload: Seat[] }
  | { type: 'SET_FOCUSED_SEAT'; payload: string | null }
  | { type: 'TOGGLE_HEAT_MAP' }; // Toggle heat map visualization

export interface SeatingContextValue {
  state: SeatingState;
  dispatch: Dispatch<SeatingAction>;
  selectSeat: (seat: Seat) => void;
  deselectSeat: (seatId: string) => void;
  clearSelection: () => void;
  toggleSeatSelection: (seat: Seat) => void;
  isSeatSelected: (seatId: string) => boolean;
  canSelectMoreSeats: boolean;
  toggleHeatMap: () => void; // Toggle heat map function
}