import { test, expect } from '@playwright/test';

const PAGE = '/tests/e2e/fixtures/index.html';

async function setTheme(page, attributes) {
  await page.locator('html').evaluate((element, values) => {
    for (const [name, value] of Object.entries(values)) {
      element.setAttribute(name, value);
    }
  }, attributes);
}

test.beforeEach(async ({ page }) => {
  await page.goto(PAGE);
});

test('aplica las variables del tema claro', async ({ page }) => {
  const panel = page.locator('#panel');

  await expect(panel).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(panel).toHaveCSS('color', 'rgb(17, 24, 39)');
});

test('cambia al tema oscuro sin modificar las clases', async ({ page }) => {
  const panel = page.locator('#panel');
  const originalClasses = await panel.getAttribute('class');

  await setTheme(page, { 'data-theme-scheme': 'dark' });
  await expect(panel).toHaveCSS('background-color', 'rgb(17, 24, 39)');
  await expect(panel).toHaveCSS('color', 'rgb(249, 250, 251)');

  expect(await panel.getAttribute('class')).toBe(originalClasses);
});

test('aplica contraste alto', async ({ page }) => {
  await setTheme(page, { 'data-theme-contrast': 'high' });

  const panel = page.locator('#panel');

  await expect(panel).toHaveCSS('border-top-width', '4px');
  await expect(panel).toHaveCSS('border-top-color', 'rgb(0, 0, 0)');
});

test('combina esquema oscuro y contraste alto', async ({ page }) => {
  await setTheme(page, { 'data-theme-scheme': 'dark', 'data-theme-contrast': 'high' });

  const panel = page.locator('#panel');

  await expect(panel).toHaveCSS('background-color', 'rgb(17, 24, 39)');
  await expect(panel).toHaveCSS('border-top-color', 'rgb(255, 255, 255)');
});

test('desactiva transiciones con movimiento reducido', async ({ page }) => {
  const button = page.locator('#animated-button');

  await setTheme(page, { 'data-theme-motion': 'reduced' });
  await expect(button).toHaveCSS('transition-property', 'none');
});

test('mantiene la variante oscura funcional', async ({ page }) => {
  await setTheme(page, { 'data-theme-scheme': 'dark' });
  await expect(page.locator('#panel')).toHaveCSS('font-weight', '700');
});
