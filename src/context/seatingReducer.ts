import { SeatingState, SeatingAction } from './types';
import { MAX_SEAT_SELECTION } from '@/utils/constants';
import { canSelectSeat } from '@/utils/seatUtils';

export function seatingReducer(state: SeatingState, action: SeatingAction): SeatingState {
  switch (action.type) {
    case 'SET_VENUE':
      return { ...state, venue: action.payload, loading: false };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'TOGGLE_HEAT_MAP':
      return { ...state, heatMapEnabled: !state.heatMapEnabled };

    case 'SELECT_SEAT': {
      // Check if seat can be selected
      if (!canSelectSeat(action.payload)) {
        return state;
      }

      // Check if already selected
      if (state.selectedSeats.some((s) => s.id === action.payload.id)) {
        return state;
      }

      // Check max selection limit
      if (state.selectedSeats.length >= MAX_SEAT_SELECTION) {
        return state;
      }

      return {
        ...state,
        selectedSeats: [...state.selectedSeats, action.payload],
      };
    }

    case 'TOGGLE_SEAT': {
      const isSelected = state.selectedSeats.some((s) => s.id === action.payload.id);
      
      if (isSelected) {
        return {
          ...state,
          selectedSeats: state.selectedSeats.filter((seat) => seat.id !== action.payload.id),
        };
      } else {
        // Check if seat can be selected
        if (!canSelectSeat(action.payload)) {
          return state;
        }

        // Check max selection limit
        if (state.selectedSeats.length >= MAX_SEAT_SELECTION) {
          return state;
        }

        return {
          ...state,
          selectedSeats: [...state.selectedSeats, action.payload],
        };
      }
    }

    case 'DESELECT_SEAT':
      return {
        ...state,
        selectedSeats: state.selectedSeats.filter((seat) => seat.id !== action.payload),
      };

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedSeats: [],
      };

    case 'LOAD_SELECTION': {
      // Validate that all seats are still available
      const validSeats = action.payload.filter((seat) => canSelectSeat(seat));
      return {
        ...state,
        selectedSeats: validSeats.slice(0, MAX_SEAT_SELECTION),
      };
    }

    case 'SET_FOCUSED_SEAT':
      return {
        ...state,
        focusedSeatId: action.payload,
      };

    default:
      return state;
  }
}