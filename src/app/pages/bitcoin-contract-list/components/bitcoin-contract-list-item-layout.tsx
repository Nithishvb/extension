import { useCallback } from 'react';

import { Box, Flex } from '@stacks/ui';

import { createMoneyFromDecimal } from '@shared/models/money.model';

import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { satToBtc } from '@app/common/money/unit-conversion';
import { BitcoinContractIcon } from '@app/components/icons/bitcoin-contract-icon';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Caption, Text } from '@app/components/typography';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';

interface BitcoinContractListItemLayoutProps {
  id: string;
  state: string;
  collateralAmount: string;
  txId: string;
}
export function BitcoinContractListItemLayout({
  id,
  state,
  collateralAmount,
  txId,
}: BitcoinContractListItemLayoutProps) {
  const { handleOpenTxLink } = useExplorerLink();
  const bitcoinMarketData = useCryptoCurrencyMarketData('BTC');

  const getFiatValue = useCallback(
    (value: string) =>
      i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoneyFromDecimal(Number(value), 'BTC'), bitcoinMarketData)
      ),
    [bitcoinMarketData]
  );

  return (
    <Flex
      margin={0}
      padding={[3, 0, 3, 0]}
      as={'button'}
      onClick={() =>
        handleOpenTxLink({
          blockchain: 'bitcoin',
          suffix: `&submitted=true`,
          txid: txId,
        })
      }
    >
      <Flag img={<Box as={BitcoinContractIcon} />} align="middle" width="100%">
        <SpaceBetween width="100%">
          <Text>{id}</Text>
          <Text fontVariantNumeric="tabular-nums" textAlign="right">
            {satToBtc(parseInt(collateralAmount)).toString()}
          </Text>
        </SpaceBetween>
        <SpaceBetween height="1.25rem" width="100%">
          <Caption>{state}</Caption>
          <Caption>{getFiatValue(satToBtc(parseInt(collateralAmount)).toString())}</Caption>
        </SpaceBetween>
      </Flag>
    </Flex>
  );
}
