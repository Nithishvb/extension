import { BrowserContext, Page } from '@playwright/test';
import {
  TEST_BITCOIN_CONTRACT_ATTESTOR_URLS,
  TEST_BITCOIN_CONTRACT_COUNTERPARTYWALLETDETAILS,
  TEST_BITCOIN_CONTRACT_OFFER,
} from '@tests/mocks/constants';
import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { test } from '../../fixtures/fixtures';

const requestParams = {
  bitcoinContractOffer: TEST_BITCOIN_CONTRACT_OFFER,
  attestorURLs: TEST_BITCOIN_CONTRACT_ATTESTOR_URLS,
  counterpartyWalletDetails: TEST_BITCOIN_CONTRACT_COUNTERPARTYWALLETDETAILS,
};

const foundContractMock = {
  id: 3000,
  uuid: '0x7e19bb8b643b4638986e2184c299fc664b4b2363c04a33b2df55b6ce924f163c',
  state: 'offered',
  content:
    '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',
  key: '03fe21e3444109e30ff7d19da0f530c344cad2e35fbee89afb2413858e4a9d7aa5',
};

function initiateOfferRequest(page: Page) {
  return async (requestParams: {
    bitcoinContractOffer: string;
    attestorURLs: string;
    counterpartyWalletDetails: string;
  }) =>
    page.evaluate(
      async params =>
        (window as any).HiroWalletProvider.request('acceptBitcoinContractOffer', params).catch(
          (e: unknown) => e
        ),
      requestParams
    );
}

async function clickReject(context: BrowserContext) {
  const popup = await context.waitForEvent('page');
  await popup.waitForTimeout(500);

  const rejectButton = popup.getByTestId(
    BitcoinContractRequestSelectors.BitcoinContractRejectButton
  );
  await rejectButton.click();
}

test.describe('Bitcoin Contract Request Test', () => {
  test.beforeEach(async ({ extensionId, globalPage, onboardingPage, homePage, page }) => {
    await globalPage.setupAndUseApiCalls(extensionId);
    await onboardingPage.signInWithTestAccount(extensionId);
    await homePage.clickSettingsButton();
    await page.getByTestId(SettingsSelectors.ChangeNetworkAction).click();
    await page.locator(`text="Testnet"`).click();
    await page.goto('https://leather.io');
    await page.waitForLoadState('networkidle');
  });

  test('that the bitcoin contract offer is properly displayed', async ({ page, context }) => {
    const expectedOfferorName = 'DLC.Link';
    const expectedLockAmount = '0.0001 BTC';
    const expectedExpirationDate = '10/30/2023';

    initiateOfferRequest(page)(requestParams);

    const popup = await context.waitForEvent('page');

    let isFirstRequest = true;

    await popup.route('**/*', async route => {
      console.log(`Intercepted request to ${route.request().url()}`);
      route.continue();
    });

    await popup.route(
      'https://devnet.dlc.link/storage-api/contracts?key=03fe21e3444109e30ff7d19da0f530c344cad2e35fbee89afb2413858e4a9d7aa5&uuid=0x7e19bb8b643b4638986e2184c299fc664b4b2363c04a33b2df55b6ce924f163c',
      async route => {
        if (isFirstRequest) {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          });
          isFirstRequest = false;
        } else {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([foundContractMock]),
          });
        }
      }
    );

    await popup.route('https://devnet.dlc.link/storage-api/contracts', async route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 3000,
          uuid: '0x7e19bb8b643b4638986e2184c299fc664b4b2363c04a33b2df55b6ce924f163c',
          state: 'offered',
          content:
            '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',
          key: '03fe21e3444109e30ff7d19da0f530c344cad2e35fbee89afb2413858e4a9d7aa5',
        }),
      });
    });

    await popup.waitForTimeout(500);

    const offerorText = popup.getByTestId(
      BitcoinContractRequestSelectors.BitcoinContractOfferorText
    );
    const offerorTextContent = await offerorText.innerText();
    const lockAmount = await popup
      .getByTestId(BitcoinContractRequestSelectors.BitcoinContractLockAmount)
      .innerText();
    const expirationDate = await popup
      .getByTestId(BitcoinContractRequestSelectors.BitcoinContractExpirationDate)
      .innerText();

    test.expect(offerorTextContent).toContain(expectedOfferorName);
    test.expect(lockAmount).toEqual(expectedLockAmount);
    test.expect(expirationDate).toEqual(expectedExpirationDate);

    await popup.close();
  });

  test('that user can reject a bitcoin contract offer', async ({ page, context }) => {
    const [result] = await Promise.all([
      initiateOfferRequest(page)(requestParams),
      clickReject(context),
    ]);

    let isFirstRequest = true;

    await page.route(
      'https://devnet.dlc.link/storage-api/contracts?key=03fe21e3444109e30ff7d19da0f530c344cad2e35fbee89afb2413858e4a9d7aa5&uuid=0x7e19bb8b643b4638986e2184c299fc664b4b2363c04a33b2df55b6ce924f163c',
      async route => {
        if (isFirstRequest) {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          });
          isFirstRequest = false;
        } else {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([foundContractMock]),
          });
        }
      }
    );

    await page.route('https://devnet.dlc.link/storage-api/contracts', async route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 3000,
          uuid: '0x7e19bb8b643b4638986e2184c299fc664b4b2363c04a33b2df55b6ce924f163c',
          state: 'offered',
          content:
            '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',
          key: '03fe21e3444109e30ff7d19da0f530c344cad2e35fbee89afb2413858e4a9d7aa5',
        }),
      });
    });

    delete result.id;

    test.expect(result).toEqual({
      jsonrpc: '2.0',
      error: {
        code: 4001,
        message: 'Bitcoin Contract offer was rejected',
      },
    });
  });
});
