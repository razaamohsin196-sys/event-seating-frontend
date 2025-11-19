import { Venue } from '@/types/venue';

export const fetchVenueData = async (venueFile: string = 'venue.json'): Promise<Venue> => {
  try {

    const response = await fetch(`/${venueFile}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch venue data: ${response.statusText}`);
    }
    
    const data = await response.json();
  
    // Basic validation
    if (!data.venueId || !data.name || !data.map || !data.sections) {
      throw new Error('Invalid venue data structure');
    }
    
    return data as Venue;
  } catch (error) {
    console.error('Error loading venue data:', error);
    throw error;
  }
};

/**
 * Validate venue data structure
 */
export const validateVenueData = (data: unknown): data is Venue => {
  if (typeof data !== 'object' || data === null) return false;
  
  const venue = data as Partial<Venue>;
  
  return !!(
    venue.venueId &&
    venue.name &&
    venue.map &&
    typeof venue.map.width === 'number' &&
    typeof venue.map.height === 'number' &&
    Array.isArray(venue.sections)
  );
};