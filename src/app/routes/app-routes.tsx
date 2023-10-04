import { Suspense } from 'react';
import {
  Navigate,
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { LoadingSpinner } from '@app/components/loading-spinner';
import { ActivityList } from '@app/features/activity-list/activity-list';
import { AddNetwork } from '@app/features/add-network/add-network';
import { Container } from '@app/features/container/container';
import { EditNonceDrawer } from '@app/features/edit-nonce-drawer/edit-nonce-drawer';
import { IncreaseBtcFeeDrawer } from '@app/features/increase-fee-drawer/increase-btc-fee-drawer';
import { IncreaseFeeSentDrawer } from '@app/features/increase-fee-drawer/increase-fee-sent-drawer';
import { IncreaseStxFeeDrawer } from '@app/features/increase-fee-drawer/increase-stx-fee-drawer';
import { leatherIntroDialogRoutes } from '@app/features/leather-intro-dialog/leather-intro-dialog';
import { ledgerJwtSigningRoutes } from '@app/features/ledger/flows/jwt-signing/ledger-sign-jwt.routes';
import { requestBitcoinKeysRoutes } from '@app/features/ledger/flows/request-bitcoin-keys/ledger-request-bitcoin-keys';
import { requestStacksKeysRoutes } from '@app/features/ledger/flows/request-stacks-keys/ledger-request-stacks-keys';
import { ledgerStacksTxSigningRoutes } from '@app/features/ledger/flows/stacks-tx-signing/ledger-sign-tx.routes';
import { RetrieveTaprootToNativeSegwit } from '@app/features/retrieve-taproot-to-native-segwit/retrieve-taproot-to-native-segwit';
import { BitcoinContractRequest } from '@app/pages/bitcoin-contract-request/bitcoin-contract-request';
import { ChooseAccount } from '@app/pages/choose-account/choose-account';
import { FundPage } from '@app/pages/fund/fund';
import { Home } from '@app/pages/home/home';
import { AllowDiagnosticsModal } from '@app/pages/onboarding/allow-diagnostics/allow-diagnostics';
import { BackUpSecretKeyPage } from '@app/pages/onboarding/back-up-secret-key/back-up-secret-key';
import { SignIn } from '@app/pages/onboarding/sign-in/sign-in';
import { WelcomePage } from '@app/pages/onboarding/welcome/welcome';
import { RequestError } from '@app/pages/request-error/request-error';
import { RpcSignStacksTransaction } from '@app/pages/rpc-sign-stacks-transaction/rpc-sign-stacks-transaction';
import { BroadcastError } from '@app/pages/send/broadcast-error/broadcast-error';
import { LockBitcoinSummary } from '@app/pages/send/locked-bitcoin-summary/locked-bitcoin-summary';
import { sendCryptoAssetFormRoutes } from '@app/pages/send/send-crypto-asset-form/send-crypto-asset-form.routes';
import { swapRoutes } from '@app/pages/swap/swap.routes';
import { UnauthorizedRequest } from '@app/pages/unauthorized-request/unauthorized-request';
import { Unlock } from '@app/pages/unlock';
import { ViewSecretKey } from '@app/pages/view-secret-key/view-secret-key';
import { AccountGate } from '@app/routes/account-gate';
import { sendOrdinalRoutes } from '@app/routes/ordinal-routes';
import { receiveRoutes } from '@app/routes/receive-routes';
import { legacyRequestRoutes } from '@app/routes/request-routes';
import { rpcRequestRoutes } from '@app/routes/rpc-routes';
import { settingsRoutes } from '@app/routes/settings-routes';

import { OnboardingGate } from './onboarding-gate';

export function SuspenseLoadingSpinner() {
  return <LoadingSpinner height="600px" />;
}

export function AppRoutes() {
  const routes = useAppRoutes();
  return <RouterProvider router={routes} />;
}

function useAppRoutes() {
  return createHashRouter(
    createRoutesFromElements(
      <Route element={<Container />}>
        <Route
          path={`${RouteUrls.Home}*`}
          element={
            <AccountGate>
              <Home />
            </AccountGate>
          }
        >
          {/* Need to declare this here so settings fire on activity */}
          <Route path={RouteUrls.Activity} element={<ActivityList />}>
            {settingsRoutes}
          </Route>

          {/* Modal routes overlaid on home need to be nested here 
              with relative paths to open in new tabs */}
          {receiveRoutes}
          {settingsRoutes}
          {ledgerStacksTxSigningRoutes}
          {sendOrdinalRoutes}
        </Route>

        {requestBitcoinKeysRoutes}
        {requestStacksKeysRoutes}
        <Route path={RouteUrls.RetrieveTaprootFunds} element={<RetrieveTaprootToNativeSegwit />} />
        <Route path={RouteUrls.IncreaseStxFee} element={<IncreaseStxFeeDrawer />}>
          {ledgerStacksTxSigningRoutes}
        </Route>
        <Route path={RouteUrls.IncreaseBtcFee} element={<IncreaseBtcFeeDrawer />} />
        <Route path={RouteUrls.IncreaseFeeSent} element={<IncreaseFeeSentDrawer />} />

        {ledgerStacksTxSigningRoutes}

        <Route
          path={RouteUrls.RpcReceiveBitcoinContractOffer}
          element={
            <AccountGate>
              <Suspense fallback={<SuspenseLoadingSpinner />}>
                <BitcoinContractRequest />
              </Suspense>
            </AccountGate>
          }
        ></Route>
        <Route path={RouteUrls.BitcoinContractLockSuccess} element={<LockBitcoinSummary />} />
        <Route path={RouteUrls.BitcoinContractLockError} element={<BroadcastError />} />
        <Route
          path={RouteUrls.Onboarding}
          element={
            <OnboardingGate>
              <WelcomePage />
            </OnboardingGate>
          }
        >
          <Route path={RouteUrls.RequestDiagnostics} element={<AllowDiagnosticsModal />} />

          {requestBitcoinKeysRoutes}
          {requestStacksKeysRoutes}
        </Route>
        <Route
          path={RouteUrls.BackUpSecretKey}
          element={
            <OnboardingGate>
              <BackUpSecretKeyPage />
            </OnboardingGate>
          }
        />
        <Route
          path={RouteUrls.SetPassword}
          lazy={async () => {
            const { SetPasswordRoute } = await import(
              '@app/pages/onboarding/set-password/set-password'
            );
            return { Component: SetPasswordRoute };
          }}
        />

        <Route
          path={RouteUrls.SignIn}
          element={
            <OnboardingGate>
              <SignIn />
            </OnboardingGate>
          }
        />
        <Route
          path={RouteUrls.AddNetwork}
          element={
            <AccountGate>
              <AddNetwork />
            </AccountGate>
          }
        />
        <Route
          path={RouteUrls.ChooseAccount}
          element={
            <AccountGate>
              <ChooseAccount />
            </AccountGate>
          }
        >
          {ledgerJwtSigningRoutes}
        </Route>

        <Route
          path={RouteUrls.Fund}
          element={
            <AccountGate>
              <FundPage />
            </AccountGate>
          }
        >
          {receiveRoutes}
          {settingsRoutes}
        </Route>

        {sendCryptoAssetFormRoutes}

        <Route
          path={RouteUrls.ViewSecretKey}
          element={
            <AccountGate>
              <ViewSecretKey />
            </AccountGate>
          }
        >
          {settingsRoutes}
        </Route>
        <Route path={RouteUrls.Unlock} element={<Unlock />}>
          {settingsRoutes}
          {leatherIntroDialogRoutes}
        </Route>

        {legacyRequestRoutes}
        {rpcRequestRoutes}
        <Route path={RouteUrls.UnauthorizedRequest} element={<UnauthorizedRequest />} />
        <Route
          path={RouteUrls.RequestError}
          element={
            <AccountGate>
              <RequestError />
            </AccountGate>
          }
        />

        <Route
          path={RouteUrls.RpcSignStacksTransaction}
          element={
            <AccountGate>
              <RpcSignStacksTransaction />
            </AccountGate>
          }
        >
          <Route path={RouteUrls.EditNonce} element={<EditNonceDrawer />} />
        </Route>

        <Route
          path={RouteUrls.RpcSignBip322Message}
          lazy={async () => {
            const { RpcSignBip322MessageRoute } = await import(
              '@app/pages/rpc-sign-bip322-message/rpc-sign-bip322-message'
            );
            return { Component: RpcSignBip322MessageRoute };
          }}
        />

        {swapRoutes}

        {/* Catch-all route redirects to onboarding */}
        <Route path="*" element={<Navigate replace to={RouteUrls.Onboarding} />} />
      </Route>
    )
  );
}
