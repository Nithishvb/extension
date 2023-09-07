import { FiAlertCircle } from 'react-icons/fi';

import { Box, Stack } from 'leather-styles/jsx';

export function SponsoredLabel(): React.JSX.Element {
  return (
    <Stack width="100%">
      <Stack
        alignItems="center"
        bg={token('colors.accent.background-secondary')}
        borderRadius="10px"
        height="48px"
        isInline
        pl="space.04"
      >
        <Box
          _hover={{ cursor: 'pointer' }}
          as={FiAlertCircle}
          color={color('accent')}
          size="16px"
        />
        <styled.span
          color={token('colors.accent.action-primary-default')}
          fontSize="12px"
          fontWeight="500"
        >
          This transaction is sponsored, so no fee is charged
        </styled.span>
      </Stack>
    </Stack>
  );
}
