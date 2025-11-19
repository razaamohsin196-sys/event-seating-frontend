import { Seat, Section } from '@/types/venue';

export interface AdjacentSeatGroup {
  section: Section;
  seats: Seat[];
}