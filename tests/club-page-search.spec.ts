import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('link', { name: 'User Portal' }).click();
  await expect(page.locator('h1')).toContainText('Club Hub');
  await expect(page.getByRole('navigation')).toContainText('Club Hub');

  await page.getByRole('textbox', { name: 'Search clubs by name,' }).fill('Photo');
  await expect(page.locator('body')).toContainText('Photography Club');
  await expect(page.locator('body')).toContainText('Capturing moments and learning photography techniques');
  await page.getByRole('button', { name: 'Music' }).click();
  await expect(page.locator('body')).toContainText('Music Band');
  await expect(page.locator('body')).toContainText('Live music performances and jam sessions');
  await expect(page.locator('body')).toContainText('Choir Club');
  await expect(page.locator('body')).toContainText('Vocal harmony and choir performances for university events');
});