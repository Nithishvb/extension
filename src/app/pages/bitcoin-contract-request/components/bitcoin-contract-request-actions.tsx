import { Box, Button, Stack } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { useBtcAssetBalance } from '@app/common/hooks/balance/btc/use-btc-balance';
import { LeatherButton } from '@app/components/button/button';

interface BitcoinContractRequestActionsProps {
  isLoading: boolean;
  bitcoinAddress: string;
  requiredAmount: number;
  onRejectBitcoinContractOffer(): Promise<void>;
  onAcceptBitcoinContractOffer(): Promise<void>;
}
export function BitcoinContractRequestActions({
  isLoading,
  bitcoinAddress,
  requiredAmount,
  onRejectBitcoinContractOffer,
  onAcceptBitcoinContractOffer,
}: BitcoinContractRequestActionsProps) {
  const { btcAvailableAssetBalance } = useBtcAssetBalance(bitcoinAddress);
  const canAccept = btcAvailableAssetBalance.balance.amount.isGreaterThan(requiredAmount);

  return (
    <Box
      bg={token('colors.accent.background-primary')}
      borderTop="1px solid #DCDDE2"
      bottom="0px"
      height="96px"
      position="fixed"
      px="loose"
      width="100%"
      zIndex={999}
    >
      <Stack
        // #4164 FIXME migrate
        // isInline
        mt="loose"
        gap="base"
      >
        <Button
          borderRadius="10px"
          flexGrow={1}
          mode="tertiary"
          onClick={onRejectBitcoinContractOffer}
        >
          Reject
        </Button>
        <LeatherButton
          borderRadius="10px"
          flexGrow={1}
          aria-busy={isLoading}
          disabled={!canAccept}
          onClick={onAcceptBitcoinContractOffer}
        >
          Accept
        </LeatherButton>
      </Stack>
    </Box>
  );
}
