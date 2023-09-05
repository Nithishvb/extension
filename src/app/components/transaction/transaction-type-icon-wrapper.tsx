import { Box, BoxProps, Circle } from 'leather-styles/jsx';

interface TransactionTypeIconWrapperProps extends BoxProps {
  icon: React.FC;
  bg: any;
}
export function TransactionTypeIconWrapper({
  bg,
  icon: Icon,
  ...rest
}: TransactionTypeIconWrapperProps) {
  return (
    <Circle
      bottom="-2px"
      right="-9px"
      position="absolute"
      size="21px"
      bg={color(bg)}
      color={token('colors.accent.background-primary')}
      border="2px solid"
      borderColor={token('colors.accent.background-primary')}
      {...rest}
    >
      <Box size="13px" as={Icon} />
    </Circle>
  );
}
