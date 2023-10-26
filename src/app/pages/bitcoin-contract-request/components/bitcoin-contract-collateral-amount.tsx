import { Stack } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import { HStack, styled } from 'leather-styles/jsx';

import { Money } from '@shared/models/money.model';

import { formatMoney, i18nFormatCurrency } from '@app/common/money/format-money';
import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';

import { BitcoinContractRequestDetailsSectionLayout } from './bitcoin-contract-request-details-section-layout';

interface BitcoinContractCollateralAmountProps {
  bitcoinAddress: string;
  collateralAmount: Money;
}
export function BitcoinContractCollateralAmount({
  bitcoinAddress,
  collateralAmount,
}: BitcoinContractCollateralAmountProps) {
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();
  return (
    <BitcoinContractRequestDetailsSectionLayout>
      <HStack alignItems="center" justifyContent="space-between">
        <Stack>
          <styled.span textStyle="label.01">Collateral Amount</styled.span>
          <styled.span mr="space.02" textStyle="caption.01">
            {truncateMiddle(bitcoinAddress)}
          </styled.span>
        </Stack>
        <Stack alignItems="flex-end" gap="space.01">
          <styled.span textStyle="label.01">{formatMoney(collateralAmount)}</styled.span>
          <styled.span textStyle="caption.02">
            {i18nFormatCurrency(calculateBitcoinFiatValue(collateralAmount))}
          </styled.span>
        </Stack>
      </HStack>
    </BitcoinContractRequestDetailsSectionLayout>
  );
}
