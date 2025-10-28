// https://v0-mfu-clubs-website.vercel.app/
// https://v0-mfu-clubs-website.vercel.app/club

import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://v0-mfu-clubs-website.vercel.app/');
  await page.getByRole('link', { name: 'Club', exact: true }).click();
  await expect(page.locator('h1')).toContainText('MFU Clubs');
  await page.locator('h1').click();
});