import { useCallback } from 'react';

import { Box, Flex } from '@stacks/ui';

import { createMoneyFromDecimal } from '@shared/models/money.model';

import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { satToBtc } from '@app/common/money/unit-conversion';
import { BtcIcon } from '@app/components/icons/btc-icon';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Caption, Text } from '@app/components/typography';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';

interface BitcoinContractListItemLayoutProps {
  collateralAmount: number;
  txID: string;
}
export function BitcoinContractListItemLayout({
  collateralAmount,
  txID,
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
      padding={[5, 0, 5, 0]}
      as={'button'}
      onClick={() =>
        handleOpenTxLink({
          blockchain: 'bitcoin',
          suffix: `&submitted=true`,
          txid: txID,
        })
      }
    >
      <Flag img={<Box as={BtcIcon} />} align="middle" width="100%">
        <SpaceBetween width="100%">
          <Text>{'Bitcoin Contract'}</Text>
          <Text fontVariantNumeric="tabular-nums" textAlign="right">
            {satToBtc(collateralAmount).toString()}
          </Text>
        </SpaceBetween>
        <SpaceBetween height="1.25rem" width="100%">
          <Caption>BTC</Caption>
          <Caption>{getFiatValue(satToBtc(collateralAmount).toString())}</Caption>
        </SpaceBetween>
      </Flag>
    </Flex>
  );
}
