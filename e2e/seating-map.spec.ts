import { test, expect } from '@playwright/test';

test.describe('Event Seating Map', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for venue data to load
    await page.waitForSelector('text=Metropolis Arena');
  });

  test('should load and display the venue', async ({ page }) => {
    // Check header
    await expect(page.locator('h1')).toContainText('Event Seating');
    
    // Check venue name
    await expect(page.locator('h2')).toContainText('Metropolis Arena');
    
    // Check that seats are rendered
    await expect(page.locator('circle[data-seat-id]')).toHaveCount(88);
  });

  test('should select a seat when clicked', async ({ page }) => {
    // Click on the first available seat
    const firstSeat = page.locator('circle[data-status="available"]').first();
    await firstSeat.click();
    
    // Check that seat details are displayed
    await expect(page.locator('text=Seat Details')).toBeVisible();
    
    // Check that selection summary shows 1 seat
    await expect(page.locator('text=1 / 8')).toBeVisible();
  });

  test('should enforce 8-seat maximum limit', async ({ page }) => {
    // Select 8 seats
    const availableSeats = page.locator('circle[data-status="available"]');
    for (let i = 0; i < 8; i++) {
      await availableSeats.nth(i).click();
      await page.waitForTimeout(100); // Small delay between clicks
    }
    
    // Check that maximum message is displayed
    await expect(page.locator('text=Maximum seats selected')).toBeVisible();
    
    // Check counter shows 8/8
    await expect(page.locator('text=8 / 8')).toBeVisible();
  });

  test('should deselect a seat when clicked again', async ({ page }) => {
    // Select a seat
    const seat = page.locator('circle[data-status="available"]').first();
    await seat.click();
    await expect(page.locator('text=1 / 8')).toBeVisible();
    
    // Click the same seat again to deselect
    await seat.click();
    await expect(page.locator('text=0 / 8')).toBeVisible();
  });

  test('should remove seat from summary', async ({ page }) => {
    // Select a seat
    await page.locator('circle[data-status="available"]').first().click();
    
    // Click remove button in summary
    await page.locator('button[aria-label*="Remove seat"]').first().click();
    
    // Check that selection is empty
    await expect(page.locator('text=No seats selected')).toBeVisible();
  });

  test('should clear all selected seats', async ({ page }) => {
    // Select multiple seats
    const availableSeats = page.locator('circle[data-status="available"]');
    await availableSeats.nth(0).click();
    await availableSeats.nth(1).click();
    await availableSeats.nth(2).click();
    
    // Click Clear All button
    await page.locator('button:has-text("Clear All")').click();
    
    // Check that selection is empty
    await expect(page.locator('text=No seats selected')).toBeVisible();
  });

  test('should toggle heat map view', async ({ page }) => {
    // Click Heat Map button
    await page.locator('button:has-text("Heat Map")').click();
    
    // Check that heat map legend is displayed
    await expect(page.locator('text=Tier 1 ($150)')).toBeVisible();
    await expect(page.locator('text=Tier 2 ($100)')).toBeVisible();
    await expect(page.locator('text=Tier 3 ($75)')).toBeVisible();
    await expect(page.locator('text=Tier 4 ($50)')).toBeVisible();
  });

  test('should find adjacent seats', async ({ page }) => {
    // Enter number of seats
    await page.locator('input[aria-label="Number of adjacent seats to find"]').fill('2');
    
    // Click Find Seats button
    await page.locator('button:has-text("Find Seats")').click();
    
    // Check that modal is displayed
    await expect(page.locator('text=Found')).toBeVisible();
    await expect(page.locator('text=adjacent seats')).toBeVisible();
  });

  test('should persist selection after page reload', async ({ page }) => {
    // Select a seat
    await page.locator('circle[data-status="available"]').first().click();
    await expect(page.locator('text=1 / 8')).toBeVisible();
    
    // Reload page
    await page.reload();
    await page.waitForSelector('text=Metropolis Arena');
    
    // Check that selection is restored
    await expect(page.locator('text=1 / 8')).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    // Check initial state (light mode)
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
    
    // Click dark mode toggle
    await page.locator('button[aria-label*="dark mode"]').click();
    
    // Check that dark mode is applied
    await expect(html).toHaveClass(/dark/);
    
    // Toggle back to light mode
    await page.locator('button[aria-label*="light mode"]').click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test('should display keyboard navigation hint', async ({ page }) => {
    await expect(page.locator('text=Use arrow keys to navigate')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    // Check ARIA labels
    await expect(page.locator('[aria-label="Interactive seating map"]')).toBeVisible();
    
    // Check that seats have proper ARIA attributes
    const seat = page.locator('circle[data-seat-id]').first();
    await expect(seat).toHaveAttribute('role', 'button');
    await expect(seat).toHaveAttribute('aria-label');
  });

  test('should calculate total price correctly', async ({ page }) => {
    // Select multiple seats and verify total
    const availableSeats = page.locator('circle[data-status="available"]');
    
    // Select 2 seats
    await availableSeats.nth(0).click();
    await availableSeats.nth(1).click();
    
    // Check that total is displayed (should be $300 for 2 tier-1 seats)
    await expect(page.locator('text=Total')).toBeVisible();
    await expect(page.locator('text=$300')).toBeVisible();
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should display mobile layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=Metropolis Arena');
    
    // Check that content is visible on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Metropolis Arena')).toBeVisible();
  });
});