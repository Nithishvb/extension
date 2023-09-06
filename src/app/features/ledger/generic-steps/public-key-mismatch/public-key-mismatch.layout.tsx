import LedgerWithRedOutline from '@assets/images/ledger/ledger-red-outline.png';
import { Box, Button, Flex } from 'leather-styles/jsx';

import { Title } from '@app/components/typography';

import { LedgerWrapper } from '../../components/ledger-wrapper';

interface PublicKeyMismatchLayoutProps {
  onClose(): void;
  onTryAgain(): void;
}
export function PublicKeyMismatchLayout({ onClose, onTryAgain }: PublicKeyMismatchLayoutProps) {
  return (
    <LedgerWrapper>
      <Box>
        <img src={LedgerWithRedOutline} width="247px" height="55px" />
      </Box>
      <Title mt="extra-loose">Public key does not match</Title>
      <styled.span mt="base-tight" lineHeight="24px" color={token('colors.accent.text-subdued')}>
        Ensure you're using the same Ledger you used when setting up the Leather
      </styled.span>
      <Flex mt="base-loose">
        <Button mode="tertiary" mr="base-tight" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onTryAgain}>Try again</Button>
      </Flex>
    </LedgerWrapper>
  );
}
