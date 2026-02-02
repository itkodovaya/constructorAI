import { test, expect } from '@playwright/test';

test('site builder basic flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Start Building');
  await expect(page.locator('text=Site Editor')).toBeVisible();
  
  // Add a block
  await page.click('text=Add Block');
  await page.click('text=Hero');
  await expect(page.locator('text=Welcome to')).toBeVisible();
});
