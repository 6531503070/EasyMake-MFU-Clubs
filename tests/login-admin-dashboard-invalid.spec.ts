import { test, expect } from '@playwright/test';

test('login-admin-dashboard-invalid', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  
  await page.getByRole('link', { name: 'Admin Dashboard' }).click();
  await expect(page.locator('body')).toContainText('EasyMake • MFU Clubs');
  await expect(page.getByRole('heading')).toContainText('Admin Sign In');

  await page.getByRole('textbox', { name: 'you@mfu.ac.th' }).click();
  await page.getByRole('textbox', { name: 'you@mfu.ac.th' }).fill('abc1234');
  await page.getByRole('textbox', { name: '••••••••••' }).click();
  await page.getByRole('textbox', { name: '••••••••••' }).fill('1234');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'you@mfu.ac.th' }).click();
  await page.getByRole('textbox', { name: 'you@mfu.ac.th' }).fill('abc1234@gmail.com');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.locator('body')).toContainText('Failed to fetch');
});