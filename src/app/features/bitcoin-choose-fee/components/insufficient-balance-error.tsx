import { Box, BoxProps } from 'leather-styles/jsx';

export function InsufficientBalanceError(props: BoxProps) {
  return (
    <Box display="flex" alignItems="center" minHeight="40px" {...props}>
      <styled.span color={token('colors.error')} fontSize={1} textAlign="center">
        Fee is too expensive for available bitcoin balance
      </styled.span>
    </Box>
  );
}
