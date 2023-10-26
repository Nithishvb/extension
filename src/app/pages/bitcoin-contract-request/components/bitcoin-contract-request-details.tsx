import { Stack } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function BitcoinContractRequestDetails({ children }: HasChildren) {
  return (
    <Stack gap="space.05" width="100%">
      {children}
    </Stack>
  );
}
