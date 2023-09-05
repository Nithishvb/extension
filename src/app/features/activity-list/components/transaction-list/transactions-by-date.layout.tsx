import { ReactNode } from 'react';

import { Box, Stack, Text } from 'leather-styles/jsx';

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
      <Text textStyle="body.small" color={color('text-caption')}>
        {displayDate}
      </Text>
      <Stack mt="base-loose" gap="loose">
        {children}
      </Stack>
    </Box>
  );
}
