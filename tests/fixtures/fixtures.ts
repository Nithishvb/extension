import { BrowserContext, test as base, chromium } from '@playwright/test';
import { GlobalPage } from '@tests/page-object-models/global.page';
import { HomePage } from '@tests/page-object-models/home.page';
import { OnboardingPage } from '@tests/page-object-models/onboarding.page';
import { SendPage } from '@tests/page-object-models/send.page';
import path from 'path';

interface TestFixtures {
  context: BrowserContext;
  extensionId: string;
  globalPage: GlobalPage;
  homePage: HomePage;
  onboardingPage: OnboardingPage;
  sendPage: SendPage;
}

/**
 * Loads the extension into the browser context. Use this test function with
 * Playwright to avoid having to manually load the extension into the browser
 * context in each test. Created by following,
 * https://playwright.dev/docs/chrome-extensions
 */
export const test = base.extend<TestFixtures>({
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, '../../dist');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      permissions: ['clipboard-read'],
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        // force GPU hardware acceleration
        // (even in headless mode)
        '--use-gl=egl',
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.backgroundPages();
    if (!background) background = await context.waitForEvent('backgroundpage');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
  globalPage: async ({ page }, use) => {
    const errors: any[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        if (msg.text().includes('WebSocket connection')) return;
        if (msg.text().includes('Failed to load resource')) return;
        errors.push(`[${msg.type()}] ${msg.text()}`);
      }
    });
    page.on('pageerror', error => {
      errors.push(`[${error.name}] ${error.message}`);
    });
    await use(new GlobalPage(page));
    test.expect(errors).toStrictEqual([]);
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  onboardingPage: async ({ page }, use) => {
    await use(new OnboardingPage(page));
  },
  sendPage: async ({ page }, use) => {
    await use(new SendPage(page));
  },
});
