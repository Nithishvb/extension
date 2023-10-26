import { BitcoinContractRequestSelectors } from '@tests/selectors/bitcoin-contract-request.selectors';
import { Box, HStack } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';

interface BitcoinContractRequestActionsProps {
  isLoading: boolean;
  canAccept: boolean;
  onRejectBitcoinContractOffer(): Promise<void>;
  onAcceptBitcoinContractOffer(): Promise<void>;
}
export function BitcoinContractRequestActions({
  isLoading,
  canAccept,
  onRejectBitcoinContractOffer,
  onAcceptBitcoinContractOffer,
}: BitcoinContractRequestActionsProps) {
  return (
    <Box
      borderTop="1px solid #DCDDE2"
      bottom="0px"
      height="96px"
      position="absolute"
      px="loose"
      width="100%"
      zIndex={999}
    >
      <HStack gap="space.04" mt="space.05">
        <LeatherButton
          flexGrow={1}
          onClick={onRejectBitcoinContractOffer}
          variant="outline"
          data-testid={BitcoinContractRequestSelectors.BitcoinContractRejectButton}
        >
          Cancel
        </LeatherButton>
        <LeatherButton
          flexGrow={1}
          aria-busy={isLoading}
          aria-disabled={!canAccept}
          onClick={onAcceptBitcoinContractOffer}
          data-testid={BitcoinContractRequestSelectors.BitcoinContractAcceptButton}
        >
          Sign
        </LeatherButton>
      </HStack>
    </Box>
  );
}
