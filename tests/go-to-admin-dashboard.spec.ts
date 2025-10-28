import { test, expect } from '@playwright/test';

test('go-to-admin-dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  
  await page.getByRole('link', { name: 'Admin Dashboard' }).click();
  await expect(page.locator('body')).toContainText('EasyMake • MFU Clubs');
  await expect(page.getByRole('heading')).toContainText('Admin Sign In');
});