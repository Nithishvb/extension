import LedgerWithRedOutline from '@assets/images/ledger/ledger-red-outline.png';
import { Box, Flex } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';
import { Title } from '@app/components/typography';

import { LedgerWrapper } from '../../components/ledger-wrapper';

interface LedgerDeviceInvalidPayloadLayoutProps {
  onClose(): void;
}
export function LedgerDeviceInvalidPayloadLayout({
  onClose,
}: LedgerDeviceInvalidPayloadLayoutProps) {
  return (
    <LedgerWrapper>
      <Box>
        <img src={LedgerWithRedOutline} width="247px" height="55px" />
      </Box>
      <Title mt="extra-loose">Data Invalid</Title>
      <styled.span mt="base-tight" lineHeight="24px" color={token('colors.accent.text-subdued')}>
        Your Ledger device has rejected the payload stating it is invalid
      </styled.span>
      <Flex mt="base-loose">
        <LeatherButton variant="ghost" mr="base-tight" onClick={onClose}>
          Close
        </LeatherButton>
      </Flex>
    </LedgerWrapper>
  );
}
