import { ReactNode } from 'react';

import { Stack, Text } from 'leather-styles/jsx';

interface PendingTransactionListLayoutProps {
  children: ReactNode;
}
export function PendingTransactionListLayout({ children }: PendingTransactionListLayoutProps) {
  return (
    <>
      <Text color={token('colors.accent.text-subdued')} textStyle="body.small">
        Pending
      </Text>
      <Stack mt="base-loose" pb="extra-loose" gap="loose">
        {children}
      </Stack>
    </>
  );
}
