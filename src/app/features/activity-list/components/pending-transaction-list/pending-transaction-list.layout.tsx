import { ReactNode } from 'react';

import { Stack } from 'leather-styles/jsx';

interface PendingTransactionListLayoutProps {
  children: ReactNode;
}
export function PendingTransactionListLayout({ children }: PendingTransactionListLayoutProps) {
  return (
    <>
      <styled.span color={token('colors.accent.text-subdued')} textStyle="body.small">
        Pending
      </styled.span>
      <Stack mt="base-loose" pb="extra-loose" gap="loose">
        {children}
      </Stack>
    </>
  );
}
