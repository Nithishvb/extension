import { ReactNode } from 'react';

import { Box, Stack } from 'leather-styles/jsx';

interface TransactionByDateLayoutProps {
  children: ReactNode;
  date: string;
  displayDate: string;
}
export function TransactionsByDateLayout({
  children,
  date,
  displayDate,
}: TransactionByDateLayoutProps) {
  return (
    <Box key={date}>
      <styled.span textStyle="body.small" color={token('colors.accent.text-subdued')}>
        {displayDate}
      </styled.span>
      <Stack mt="base-loose" gap="space.05">
        {children}
      </Stack>
    </Box>
  );
}
