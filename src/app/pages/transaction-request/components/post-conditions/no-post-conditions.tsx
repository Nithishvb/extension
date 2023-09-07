import { FiLock } from 'react-icons/fi';

import { Box, Circle, Stack } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Body } from '@app/components/typography';

export function NoPostConditions(): React.JSX.Element {
  return (
    <Stack
      alignItems="center"
      gap="space.04"
      p="base-loose"
      // #4164 FIXME refactor isInline
      // isInline
    >
      {/* // #4164 FIXME check this colour  - changing them all to .background-secondary*/}
      {/* token('colors.accent.background-secondary') */}
      <Circle bg={token('colors.accent.background-secondary')} flexShrink={0}>
        <FiLock />
      </Circle>
      <Box flexGrow={1}>
        <Body>
          No transfers (besides fees) will be made from your account or the transaction will abort.
        </Body>
      </Box>
    </Stack>
  );
}
