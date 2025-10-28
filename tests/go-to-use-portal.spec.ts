import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  
  await page.getByRole('link', { name: 'User Portal' }).click();
  await expect(page.locator('h1')).toContainText('Club Hub');
  await expect(page.getByRole('navigation')).toContainText('Club Hub');
});