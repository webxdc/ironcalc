# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sync.spec.ts >> an incoming diff does not disrupt an in-progress edit
- Location: tests/sync.spec.ts:38:1

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 2
+ Received  + 2

  Object {
-   "tag": "TEXTAREA",
-   "value": "hello",
+   "tag": "DIV",
+   "value": null,
  }
```

# Page snapshot

```yaml
- generic:
  - generic [active] [ref=e4]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - button "Undo" [disabled] [ref=e8]:
          - img [ref=e10]
        - button "Redo" [disabled] [ref=e13]:
          - img [ref=e15]
      - generic [ref=e19]:
        - button "Copy styles" [ref=e20] [cursor=pointer]:
          - img [ref=e22]
        - button "Clear formatting" [ref=e26] [cursor=pointer]:
          - img [ref=e28]
      - generic [ref=e34]:
        - button "Format as currency" [ref=e35] [cursor=pointer]:
          - img [ref=e37]
        - button "Format as percentage" [ref=e39] [cursor=pointer]:
          - img [ref=e41]
        - button "Decrease decimal places" [ref=e45] [cursor=pointer]:
          - img [ref=e47]
        - button "Increase decimal places" [ref=e50] [cursor=pointer]:
          - img [ref=e52]
        - button "123" [ref=e58] [cursor=pointer]:
          - text: "123"
          - img [ref=e60]
      - generic [ref=e63]:
        - button "Decrease font size" [ref=e64] [cursor=pointer]:
          - img [ref=e66]
        - textbox "Font size" [ref=e67]: "12"
        - button "Increase font size" [ref=e68] [cursor=pointer]:
          - img [ref=e70]
      - generic [ref=e72]:
        - button "Bold" [ref=e73] [cursor=pointer]:
          - img [ref=e75]
        - button "Italic" [ref=e77] [cursor=pointer]:
          - img [ref=e79]
        - button "Underline" [ref=e81] [cursor=pointer]:
          - img [ref=e83]
        - button "Strikethrough" [ref=e85] [cursor=pointer]:
          - img [ref=e87]
      - generic [ref=e91]:
        - button "Font color" [ref=e92] [cursor=pointer]:
          - img [ref=e94]
        - button "Fill color" [ref=e97] [cursor=pointer]:
          - img [ref=e99]
        - button "Borders" [ref=e104] [cursor=pointer]:
          - img [ref=e106]
        - button "Conditional formatting" [ref=e108] [cursor=pointer]:
          - img [ref=e110]
        - button "Themes" [ref=e115] [cursor=pointer]:
          - img [ref=e117]
        - button "Cell styles" [ref=e121] [cursor=pointer]:
          - img [ref=e123]
      - generic [ref=e128]:
        - button "Align left" [ref=e129] [cursor=pointer]:
          - img [ref=e131]
        - button "Align center" [ref=e132] [cursor=pointer]:
          - img [ref=e134]
        - button "Align right" [ref=e135] [cursor=pointer]:
          - img [ref=e137]
        - button "Align top" [ref=e138] [cursor=pointer]:
          - img [ref=e140]
        - button "Align middle" [ref=e142] [cursor=pointer]:
          - img [ref=e144]
        - button "Align bottom" [pressed] [ref=e148] [cursor=pointer]:
          - img [ref=e150]
        - button "Wrap text" [ref=e152] [cursor=pointer]:
          - img [ref=e154]
      - generic [ref=e158]:
        - button "Download as PNG" [ref=e159] [cursor=pointer]:
          - img [ref=e161]
        - button "Show/hide grid lines" [ref=e166] [cursor=pointer]:
          - img [ref=e168]
    - generic [ref=e171]:
      - generic [ref=e172]:
        - button "A1" [ref=e176] [cursor=pointer]:
          - text: A1
          - img [ref=e178]
        - generic [ref=e181]:
          - img [ref=e183]
          - textbox [ref=e187]
      - generic [ref=e194]:
        - generic [ref=e195]: A
        - generic [ref=e197]: B
        - generic [ref=e199]: C
        - generic [ref=e201]: D
        - generic [ref=e203]: E
        - generic [ref=e205]: F
        - generic [ref=e207]: G
        - generic [ref=e209]: H
        - generic [ref=e211]: I
        - generic [ref=e213]: J
        - generic [ref=e215]: K
        - generic [ref=e217]: L
        - generic [ref=e219]: M
        - generic [ref=e221]: "N"
      - generic [ref=e247]:
        - generic [ref=e248]:
          - button "Add sheet" [ref=e249] [cursor=pointer]:
            - img [ref=e251]
          - button "Sheet list" [ref=e252] [cursor=pointer]:
            - img [ref=e254]
        - tab "Sheet1 Open sheet menu" [selected] [ref=e257] [cursor=pointer]:
          - generic [ref=e258]: Sheet1
          - button "Open sheet menu" [ref=e259]:
            - img [ref=e260]
        - button "en-US English" [ref=e263] [cursor=pointer]:
          - text: en-US
          - text: English
  - generic [ref=e265]:
    - banner [ref=e266]: webxdc dev tools
    - img [ref=e267]
    - link "Add Peer" [ref=e268] [cursor=pointer]:
      - /url: javascript:void(0);
    - text: "|"
    - link "Reset" [ref=e269] [cursor=pointer]:
      - /url: javascript:void(0);
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // A diff recorded from a real edit (B2 = 42) on a peer with the uuid below.
  4  | // Because the sender uuid differs from a fresh instance's own uuid, the app
  5  | // treats it as a genuine remote update rather than skipping it as an echo.
  6  | const B2_DIFF = {
  7  |   data: 'AQEBAAQABAIEAgI0MgA=',
  8  |   sender: '6088ce72-5c43-419d-9e60-2605d477d46a',
  9  | };
  10 | 
  11 | test('applies an incoming diff from another peer', async ({ page }) => {
  12 |   await page.goto('/');
  13 | 
  14 |   // Wait for the model to initialize (exposed via the dev-only window hook).
  15 |   await page.waitForFunction(() => !!window.__model);
  16 | 
  17 |   // Replay the recorded diff as if another peer had sent it.
  18 |   await page.evaluate((payload) => {
  19 |     window.webxdc.sendUpdate({ payload }, '');
  20 |   }, B2_DIFF);
  21 | 
  22 |   // The diff should land in the model: B2 (sheet 0, row 2, col 2) becomes "42".
  23 |   await expect
  24 |     .poll(() => page.evaluate(() => window.__model?.getFormattedCellValue(0, 2, 2)))
  25 |     .toBe('42');
  26 | });
  27 | 
  28 | // Reads the currently focused element's tag and (if a textarea) its value.
  29 | // While a cell is being edited, this is the in-cell editor holding the
  30 | // uncommitted text.
  31 | function activeEditor(page: import('@playwright/test').Page) {
  32 |   return page.evaluate(() => {
  33 |     const ae = document.activeElement as HTMLTextAreaElement | null;
  34 |     return { tag: ae?.tagName ?? null, value: ae?.value ?? null };
  35 |   });
  36 | }
  37 | 
  38 | test('an incoming diff does not disrupt an in-progress edit', async ({ page }) => {
  39 |   await page.goto('/');
  40 |   await page.waitForFunction(() => !!window.__model);
  41 | 
  42 |   // Start editing A1: select it (click the grid) and type, without committing.
  43 |   await page.mouse.click(70, 110);
  44 |   await page.keyboard.type('hello');
  45 | 
  46 |   // The in-cell editor is a focused textarea holding the uncommitted text.
  47 |   expect(await activeEditor(page)).toEqual({ tag: 'TEXTAREA', value: 'hello' });
  48 | 
  49 |   // A remote peer updates a different cell (B2) while we are mid-edit.
  50 |   await page.evaluate((payload) => {
  51 |     window.webxdc.sendUpdate({ payload }, '');
  52 |   }, B2_DIFF);
  53 | 
  54 |   // The remote update should land in the model...
  55 |   await expect
  56 |     .poll(() => page.evaluate(() => window.__model?.getFormattedCellValue(0, 2, 2)))
  57 |     .toBe('42');
  58 | 
  59 |   // ...without disrupting our edit: the editor still holds "hello" and is focused.
> 60 |   expect(await activeEditor(page)).toEqual({ tag: 'TEXTAREA', value: 'hello' });
     |                                    ^ Error: expect(received).toEqual(expected) // deep equality
  61 | 
  62 |   // Committing then shows our value in A1.
  63 |   await page.keyboard.press('Enter');
  64 |   await expect
  65 |     .poll(() => page.evaluate(() => window.__model?.getFormattedCellValue(0, 1, 1)))
  66 |     .toBe('hello');
  67 | });
  68 | 
```