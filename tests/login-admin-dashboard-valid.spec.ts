import { test, expect } from '@playwright/test';

test('login-admin-dashboard-valid', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  
  await page.getByRole('link', { name: 'Admin Dashboard' }).click();
  await expect(page.locator('body')).toContainText('EasyMake • MFU Clubs');
  await expect(page.getByRole('heading')).toContainText('Admin Sign In');

  await page.getByRole('textbox', { name: 'you@mfu.ac.th' }).click();
  await page.getByRole('textbox', { name: 'you@mfu.ac.th' }).fill('admin@mfu.ac.th');
  await page.getByRole('textbox', { name: '••••••••••' }).click();
  await page.getByRole('textbox', { name: '••••••••••' }).fill('Admin@123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // TODO: check if the user is redirected to the admin dashboard
  // await expect(page.locator('body')).toContainText('All Clubs');
});