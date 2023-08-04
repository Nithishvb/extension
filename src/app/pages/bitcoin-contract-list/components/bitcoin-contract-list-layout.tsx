import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { Stack } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';

interface BitcoinContractListProps {
  children: ReactNode;
}
export function BitcoinContractListLayout({ children }: BitcoinContractListProps) {
  const navigate = useNavigate();
  useRouteHeader(<Header title="Bitcoin Contracts" onClose={() => navigate(RouteUrls.Home)} />);
  return (
    <Stack width="100%" spacing="extra-tight" overflow={'scroll'}>
      {children}
    </Stack>
  );
}
