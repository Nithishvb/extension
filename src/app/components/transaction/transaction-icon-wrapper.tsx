import { Box, BoxProps, Circle } from 'leather-styles/jsx';

import { StacksTx } from '@shared/models/transactions/stacks-transaction.model';

import { TransactionTypeIcon } from './transaction-type-icon';

interface TransactionIconWrapperProps extends BoxProps {
  icon: React.FC;
  transaction: StacksTx;
}
export function TransactionIconWrapper({
  icon: Icon,
  transaction,
  ...rest
}: TransactionIconWrapperProps) {
  return (
    <Circle
      bg={color('accent')}
      color={token('colors.accent.background-primary')}
      flexShrink={0}
      position="relative"
      size="36px"
      {...rest}
    >
      <Box as={Icon} />
      <TransactionTypeIcon transaction={transaction} />
    </Circle>
  );
}
