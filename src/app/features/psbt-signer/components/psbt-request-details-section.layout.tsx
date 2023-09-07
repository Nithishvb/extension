import { Stack, StackProps } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function PsbtRequestDetailsSectionLayout({ children, ...props }: HasChildren & StackProps) {
  return (
    <Stack
      border="4px solid"
      borderColor={token('colors.accent.background-primary')}
      borderRadius="16px"
      p="space.05"
      gap="extra-tight"
      width="100%"
      {...props}
    >
      {children}
    </Stack>
  );
}
