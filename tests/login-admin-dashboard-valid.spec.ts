import { test, expect } from '@playwright/test';

test('login-admin-dashboard-valid', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('link', { name: 'Admin Dashboard' }).click();
  await page.getByRole('textbox', { name: 'you@mfu.ac.th' }).click();
  await page.getByRole('textbox', { name: 'you@mfu.ac.th' }).click();
  await page.getByRole('textbox', { name: 'you@mfu.ac.th' }).fill('leader@mfu.ac.th');
  await page.getByRole('textbox', { name: '••••••••••' }).click();
  await page.getByRole('textbox', { name: '••••••••••' }).fill('1234567890123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByText('Club Admin Panel').click();

  await expect(page.getByRole('complementary')).toContainText('Club Admin Panel');
  await expect(page.getByRole('complementary')).toContainText('MFU Clubs');
});