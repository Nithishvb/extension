import { FiAlertCircle } from 'react-icons/fi';

import { Box, Stack, StackProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

export function ErrorLabel({ children, ...rest }: StackProps) {
  return (
    <Stack gap="tight" color={color('feedback-error')} isInline alignItems="flex-start" {...rest}>
      <FiAlertCircle
        size="1rem"
        color={token('colors.error')}
        style={{ position: 'relative' }}
        strokeWidth={1.5}
      />
      <Box>{children}</Box>
    </Stack>
  );
}
