import { ReactNode } from 'react';

import { Stack } from 'leather-styles/jsx';

interface TransactionListLayoutProps {
  children: ReactNode;
}
export function TransactionListLayout({ children }: TransactionListLayoutProps) {
  return (
    <Stack pb="extra-loose" gap="extra-loose">
      {children}
    </Stack>
  );
}
