import { SeatingProvider } from './context/SeatingContext';
import { Layout } from './components/Layout/Layout';
import { SeatingMap } from './components/SeatingMap/SeatingMap';
import { SelectionSummary } from './components/SelectionSummary/SelectionSummary';
import { AdjacentSeatsFinder } from './components/AdjacentSeatsFinder/AdjacentSeatsFinder';
import { SeatDetails } from './components/SeatingMap/SeatDetails';
import { useSeating } from './context/SeatingContext';
import { findSeatById } from './utils/seatUtils';
import './App.css';

function AppContent() {
  const { state } = useSeating();
  const venue = state.venue;
  
  const focusedSeat = state.focusedSeatId && venue
    ? findSeatById(venue.sections, state.focusedSeatId) || null
    : null;

  return (
    <Layout>
      <div className="app-container">
        <div className="seating-map-container">
          <SeatingMap />
        </div>
        
        <div className="sidebar-container">
          <AdjacentSeatsFinder />
          <SeatDetails seat={focusedSeat} />
          <SelectionSummary />
        </div>
      </div>
    </Layout>
  );
}

function App() {
  return (
    <SeatingProvider>
      <AppContent />
    </SeatingProvider>
  );
}

export default App;