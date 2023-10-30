import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';
import { HStack, Stack, styled } from 'leather-styles/jsx';

import { BitcoinContractRequestDetailsSectionLayout } from './bitcoin-contract-details-section/components/bitcoin-contract-request-details-section.layout';

export function BitcoinContractExpirationDate(props: { expirationDate: string }) {
  const { expirationDate } = props;

  return (
    <BitcoinContractRequestDetailsSectionLayout>
      <HStack alignItems="center" justifyContent="space-between">
        <styled.span textStyle="label.01">Expiration Date</styled.span>
        <Stack alignItems="flex-end" gap="space.01">
          <styled.span
            textStyle="label.01"
            data-testid={BitcoinContractRequestSelectors.BitcoinContractExpirationDate}
          >
            {expirationDate}
          </styled.span>
        </Stack>
      </HStack>
    </BitcoinContractRequestDetailsSectionLayout>
  );
}
