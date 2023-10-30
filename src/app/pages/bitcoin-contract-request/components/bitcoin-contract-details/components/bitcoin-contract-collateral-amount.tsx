import { Stack } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';
import { HStack, styled } from 'leather-styles/jsx';

import { createMoney } from '@shared/models/money.model';

import { formatMoney, i18nFormatCurrency } from '@app/common/money/format-money';
import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';

import { BitcoinContractRequestDetailsSectionLayout } from './bitcoin-contract-details-section/components/bitcoin-contract-request-details-section.layout';

interface BitcoinContractCollateralAmountProps {
  bitcoinAddress: string;
  collateralAmount: number;
}
export function BitcoinContractCollateralAmount({
  bitcoinAddress,
  collateralAmount,
}: BitcoinContractCollateralAmountProps) {
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();
  const collateralAmountMoney = createMoney(collateralAmount, 'BTC');
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
          <styled.span textStyle="label.01">{formatMoney(collateralAmountMoney)}</styled.span>
          <styled.span
            textStyle="caption.02"
            data-testid={BitcoinContractRequestSelectors.BitcoinContractLockAmount}
          >
            {i18nFormatCurrency(calculateBitcoinFiatValue(collateralAmountMoney))}
          </styled.span>
        </Stack>
      </HStack>
    </BitcoinContractRequestDetailsSectionLayout>
  );
}
