import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet, useLocation } from 'react-router-dom';

import { useInitalizeAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useLocationState } from '@app/common/hooks/use-location-state';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { useOnSignOut } from '@app/routes/hooks/use-on-sign-out';
import { useOnWalletLock } from '@app/routes/hooks/use-on-wallet-lock';
import { useHasStateRehydrated } from '@app/store';
import { useRouteHeaderState } from '@app/store/ui/ui.hooks';

import { useRestoreFormState } from '../popup-send-form-restoration/use-restore-form-state';
import { SettingsDropdown } from '../settings-dropdown/settings-dropdown';
import { SwitchAccountDrawer } from '../switch-account-drawer/switch-account-drawer';
import { ContainerLayout } from './container.layout';

export function Container() {
  const [routeHeader] = useRouteHeaderState();
  const location = useLocation();
  const backgroundLocation = useLocationState('backgroundLocation');
  const analytics = useAnalytics();
  const hasStateRehydrated = useHasStateRehydrated();
  // console.info('container location:', location, 'bg:', backgroundLocation);

  useOnWalletLock(() => window.close());
  useOnSignOut(() => window.close());

  useRestoreFormState();

  useInitalizeAnalytics();

  useEffect(
    () => void analytics.page('view', `${location.pathname}`),
    [analytics, location.pathname]
  );

  if (!hasStateRehydrated) return <LoadingSpinner />;

  return (
    <>
      <SwitchAccountDrawer />
      <SettingsDropdown />
      <Toaster position="bottom-center" toastOptions={{ style: { fontSize: '14px' } }} />
      <ContainerLayout header={routeHeader}>
        <Outlet />
      </ContainerLayout>
    </>
  );
}
