import { Box, Circle } from 'leather-styles/jsx';

import { StxIcon } from '@app/components/icons/stx-icon';
import { TransactionTypeIconWrapper } from '@app/components/transaction/transaction-type-icon-wrapper';

interface TxTransferIconWrapperProps {
  icon: React.FC;
}
export function TxTransferIconWrapper({ icon }: TxTransferIconWrapperProps) {
  return (
    <Circle
      bg={color('accent')}
      color={token('colors.accent.background-primary')}
      flexShrink={0}
      position="relative"
      size="36px"
    >
      <Box as={StxIcon} />
      <TransactionTypeIconWrapper icon={icon} bg={'brand'} />
    </Circle>
  );
}
