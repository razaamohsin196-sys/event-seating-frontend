// Script to generate a venue with 15,000 seats for performance testing
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOTAL_SEATS = 15000;
const SECTIONS = 20; // 20 sections
const ROWS_PER_SECTION = 25; // 25 rows per section
const SEATS_PER_ROW = 30; // 30 seats per row = 15,000 total

const STATUSES = ['available', 'reserved', 'sold', 'held'];
const PRICE_TIERS = [1, 2, 3, 4];

function generateVenue() {
  const sections = [];
  
  // Create 20 sections in a grid layout
  for (let sectionIdx = 0; sectionIdx < SECTIONS; sectionIdx++) {
    const sectionRow = Math.floor(sectionIdx / 5); // 5 sections per row
    const sectionCol = sectionIdx % 5;
    
    const sectionId = String.fromCharCode(65 + sectionIdx); // A, B, C, ...
    const section = {
      id: sectionId,
      label: `Section ${sectionId}`,
      transform: {
        x: sectionCol * 950,
        y: sectionRow * 800,
        scale: 1
      },
      rows: []
    };
    
    // Create 25 rows per section
    for (let rowIdx = 0; rowIdx < ROWS_PER_SECTION; rowIdx++) {
      const row = {
        index: rowIdx + 1,
        seats: []
      };
      
      // Create 30 seats per row
      for (let seatIdx = 0; seatIdx < SEATS_PER_ROW; seatIdx++) {
        const seatId = `${sectionId}-${rowIdx + 1}-${String(seatIdx + 1).padStart(2, '0')}`;
        
        // Distribute statuses: 70% available, 15% reserved, 10% sold, 5% held
        const rand = Math.random();
        let status;
        if (rand < 0.70) status = 'available';
        else if (rand < 0.85) status = 'reserved';
        else if (rand < 0.95) status = 'sold';
        else status = 'held';
        
        // Price tiers based on section and row (closer = more expensive)
        let priceTier;
        if (sectionRow < 1) priceTier = 1; // Front sections
        else if (sectionRow < 2) priceTier = 2;
        else if (sectionRow < 3) priceTier = 3;
        else priceTier = 4; // Back sections
        
        const seat = {
          id: seatId,
          col: seatIdx + 1,
          x: 50 + (seatIdx * 28),
          y: 50 + (rowIdx * 28),
          priceTier: priceTier,
          status: status
        };
        
        row.seats.push(seat);
      }
      
      section.rows.push(row);
    }
    
    sections.push(section);
  }
  
  return {
    venueId: "mega-arena-01",
    name: "Mega Arena (15,000 Seats)",
    map: {
      width: 5000,
      height: 3400
    },
    sections: sections
  };
}

// Generate and save
console.log('Generating 15,000 seat venue...');
const venue = generateVenue();

const totalSeats = venue.sections.reduce((total, section) => {
  return total + section.rows.reduce((rowTotal, row) => rowTotal + row.seats.length, 0);
}, 0);

console.log(`Generated ${totalSeats} seats across ${venue.sections.length} sections`);

const outputPath = path.join(__dirname, '..', 'public', 'venue-15k.json');
fs.writeFileSync(outputPath, JSON.stringify(venue, null, 2));

console.log(`Saved to ${outputPath}`);
console.log('File size:', (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2), 'MB');