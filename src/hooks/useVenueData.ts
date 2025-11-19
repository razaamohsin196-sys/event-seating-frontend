import { useState, useEffect } from 'react';
import { Venue } from '@/types/venue';
import { fetchVenueData } from '@/services/venueService';

interface UseVenueDataReturn {
  venue: Venue | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook to load venue data
 */
export function useVenueData(venueFile?: string): UseVenueDataReturn {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadVenue = async () => {
      try {
        setLoading(true);
        const data = await fetchVenueData(venueFile);
        
        if (isMounted) {
          setVenue(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load venue data'));
          setVenue(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVenue();

    return () => {
      isMounted = false;
    };
  }, [venueFile]);

  return { venue, loading, error };
}