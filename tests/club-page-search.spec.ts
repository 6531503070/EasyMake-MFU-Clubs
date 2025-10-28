import { test, expect } from '@playwright/test';

test('club-page-search', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('link', { name: 'User Portal' }).click();
  await page.getByRole('link', { name: 'Club', exact: true }).click();
  await expect(page.locator('h1')).toContainText('MFU Clubs');

  await page.getByRole('textbox', { name: 'Search clubs by name,' }).click();
  await page.getByRole('textbox', { name: 'Search clubs by name,' }).fill('Photo');
  await expect(page.locator('body')).toContainText('Photography Club');
  await expect(page.locator('body')).toContainText('Capturing moments and learning photography techniques');
  
  await page.getByRole('textbox', { name: 'Search clubs by name,' }).click();
  await page.getByRole('textbox', { name: 'Search clubs by name,' }).fill('');
  await page.getByRole('button', { name: 'Music' }).click();
  await expect(page.locator('body')).toContainText('Music Band');
  await expect(page.locator('body')).toContainText('Live music performances and jam sessions');
});