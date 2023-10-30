import { HStack, Stack, styled } from 'leather-styles/jsx';

import { createMoney } from '@shared/models/money.model';

import { formatMoney, i18nFormatCurrency } from '@app/common/money/format-money';
import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';

import { BitcoinContractRequestDetailsSectionLayout } from './bitcoin-contract-details-section/components/bitcoin-contract-request-details-section.layout';

export function BitcoinContractFee(props: { fee: number }) {
  const { fee } = props;
  const feeMoney = createMoney(fee, 'BTC');
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();

  return (
    <BitcoinContractRequestDetailsSectionLayout>
      <HStack alignItems="center" justifyContent="space-between">
        <styled.span textStyle="label.01">Transaction fee</styled.span>
        <Stack alignItems="flex-end" gap="space.01">
          <styled.span textStyle="label.01">{formatMoney(feeMoney)}</styled.span>
          <styled.span textStyle="caption.02">
            {i18nFormatCurrency(calculateBitcoinFiatValue(feeMoney))}
          </styled.span>
        </Stack>
      </HStack>
    </BitcoinContractRequestDetailsSectionLayout>
  );
}
