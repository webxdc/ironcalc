import { test, expect } from '@playwright/test';

// A diff recorded from a real edit (B2 = 42) on a peer with the uuid below.
// Because the sender uuid differs from a fresh instance's own uuid, the app
// treats it as a genuine remote update rather than skipping it as an echo.
const B2_DIFF = {
  data: 'AQEBAAQABAIEAgI0MgA=',
  sender: '6088ce72-5c43-419d-9e60-2605d477d46a',
};

test('applies an incoming diff from another peer', async ({ page }) => {
  await page.goto('/');

  // Wait for the model to initialize (exposed via the dev-only window hook).
  await page.waitForFunction(() => !!window.__model);

  // Replay the recorded diff as if another peer had sent it.
  await page.evaluate((payload) => {
    window.webxdc.sendUpdate({ payload }, '');
  }, B2_DIFF);

  // The diff should land in the model: B2 (sheet 0, row 2, col 2) becomes "42".
  await expect
    .poll(() => page.evaluate(() => window.__model?.getFormattedCellValue(0, 2, 2)))
    .toBe('42');
});
