import { truncateMiddle } from '@stacks/ui-utils';
import { Stack } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';

import { SpaceBetween } from '@app/components/layout/space-between';

interface SendTransferDetailsProps {
  address: string;
  amount: string;
  currentAddress: string;
}
export function SendTransferDetails({ address, amount, currentAddress }: SendTransferDetailsProps) {
  return (
    <Stack
      border="4px solid"
      borderColor={token('colors.accent.background-primary')}
      borderRadius="16px"
      p="loose"
      gap="base"
      width="100%"
    >
      <SpaceBetween spacing="base">
        <styled.span textStyle="caption.01">From</styled.span>
        <styled.span textStyle="label.01">{truncateMiddle(currentAddress)}</styled.span>
      </SpaceBetween>
      <SpaceBetween spacing="base">
        <styled.span textStyle="caption.01">To</styled.span>
        <styled.span textStyle="label.01">{truncateMiddle(address)}</styled.span>
      </SpaceBetween>
      <SpaceBetween spacing="base">
        <styled.span textStyle="caption.01">Amount</styled.span>
        <styled.span textStyle="label.01">{amount}</styled.span>
      </SpaceBetween>
    </Stack>
  );
}
