import { Box, Stack } from '@stacks/ui';
import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { LockIcon } from '@app/components/icons/lock-icon';
import { Tooltip } from '@app/components/tooltip';

const immutableLabel =
  'Any modification to the transaction, including the fee amount or other inputs/outputs, will invalidate the signature.';

export function BitcoinContractRequestDetailsHeader() {
  return (
    <Stack alignItems="center" isInline spacing="tight">
      <styled.h2 textStyle="heading.05">Transaction</styled.h2>
      <Tooltip label={immutableLabel} maxWidth="230px" placement="bottom">
        <Stack
          alignItems="center"
          border="1px solid"
          borderColor={token('colors.accent.text-subdued')}
          borderRadius="24px"
          isInline
          px="tight"
          py="extra-tight"
          spacing="extra-tight"
        >
          <Box size="12px">
            <LockIcon color={token('colors.accent.text-subdued')} height="12px" width="12px" />
          </Box>
          <styled.span color={token('colors.accent.text-subdued')} textStyle="caption.02">
            Certain
          </styled.span>
        </Stack>
      </Tooltip>
    </Stack>
  );
}
