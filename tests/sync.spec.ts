import { test, expect } from '@playwright/test';

// We recorded a real edit, setting B2 to 42 on a peer. We use the sender
// UUID from that recording so that the diff is treated as a genuine remote update.
const B2_DIFF = {
  data: 'AQEBAAQABAIEAgI0MgA=',
  sender: '6088ce72-5c43-419d-9e60-2605d477d46a',
};

test('incoming diff updates the model', async ({ page }) => {
  await page.goto('/');

  // we wait for the model to be available
  await page.waitForFunction(() => !!window.__model);

  // the diff arrives
  await page.evaluate((payload) => {
    window.webxdc.sendUpdate({ payload }, '');
  }, B2_DIFF);

  // The diff should land in the model: B2 (sheet 0, row 2, col 2) becomes "42".
  await expect
    .poll(() => page.evaluate(() => window.__model?.getFormattedCellValue(0, 2, 2)))
    .toBe('42');
});

// We read the value of the in-cell editor; the uncommitted text.
function activeEditor(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const ae = document.activeElement as HTMLTextAreaElement | null;
    return { tag: ae?.tagName ?? null, value: ae?.value ?? null };
  });
}

test('an incoming diff does not disrupt an in-progress edit', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => !!window.__model);

  // we are editing A1 but do not commit
  await page.mouse.click(70, 110);
  await page.keyboard.type('hello');

  // we verify that we can see the value in the in-cell editor
  expect(await activeEditor(page)).toEqual({ tag: 'TEXTAREA', value: 'hello' });

  // now we get an update (of B2, not even what we're editing)
  await page.evaluate((payload) => {
    window.webxdc.sendUpdate({ payload }, '');
  }, B2_DIFF);

  // it appears in the model
  await expect
    .poll(() => page.evaluate(() => window.__model?.getFormattedCellValue(0, 2, 2)))
    .toBe('42');

  // but it shouldn't disrupt our edit: the editor still holds "hello" and is focused.
  expect(await activeEditor(page)).toEqual({ tag: 'TEXTAREA', value: 'hello' });

  // and if we commit that value it should show up in the model
  await page.keyboard.press('Enter');
  await expect
    .poll(() => page.evaluate(() => window.__model?.getFormattedCellValue(0, 1, 1)))
    .toBe('hello');
});
