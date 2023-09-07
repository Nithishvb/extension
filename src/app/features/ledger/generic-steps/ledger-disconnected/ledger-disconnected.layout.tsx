import LedgerDisconnected from '@assets/images/ledger/ledger-disconnected.png';
import { Box, Button, Stack } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';

import { LedgerTitle } from '../../components/ledger-title';
import { LedgerWrapper } from '../../components/ledger-wrapper';

interface LedgerDisconnectedLayoutProps {
  onConnectAgain(): void;
  onClose(): void;
}
export function LedgerDisconnectedLayout(props: LedgerDisconnectedLayoutProps) {
  const { onConnectAgain, onClose } = props;
  return (
    <LedgerWrapper>
      <Box mb="space.05" mt="space.02">
        <img src={LedgerDisconnected} width="242px" />
      </Box>
      <LedgerTitle mb="space.05" mt="space.05" mx="40px">
        Your Ledger has disconnected
      </LedgerTitle>
      <Stack isInline mb="space.05">
        <Button borderRadius="10px" mode="tertiary" onClick={onClose}>
          Close
        </Button>
        <LeatherButton height="40px" onClick={onConnectAgain}>
          Connect again
        </LeatherButton>
      </Stack>
    </LedgerWrapper>
  );
}
