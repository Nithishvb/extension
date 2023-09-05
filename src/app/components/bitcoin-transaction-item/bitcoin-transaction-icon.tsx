// #4164 FIXME migrate colorFromTx then remove this
import { Box, color } from '@stacks/ui';
import { BoxProps, Circle, Flex } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { BtcIcon } from '@app/components/icons/btc-icon';

import { IconForTx, colorFromTx } from './utils';

interface TransactionIconProps extends BoxProps {
  transaction: BitcoinTx;
  btcAddress: string;
}

export function BitcoinTransactionIcon({ transaction, btcAddress, ...rest }: TransactionIconProps) {
  return (
    <Flex position="relative">
      <BtcIcon />
      <Circle
        bottom="-2px"
        right="-9px"
        position="absolute"
        size="21px"
        bg={color(colorFromTx(transaction))}
        color={token('colors.accent.background-primary')}
        border="2px solid"
        borderColor={token('colors.accent.background-primary')}
        {...rest}
      >
        {/* // #4164 FIXME refactor this IconForTx */}
        <Box size="13px" as={IconForTx(btcAddress, transaction)} />
      </Circle>
    </Flex>
  );
}
