import { memo } from 'react';

import { Stack, StackProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { LeatherIcon } from './icons/leather-icon';

interface LeatherLogoProps extends StackProps {
  isClickable: boolean;
}
export const LeatherLogo = memo((props: LeatherLogoProps) => {
  const { isClickable, ...rest } = props;

  return (
    <Stack
      _hover={{ color: token('colors.brown.11') }}
      alignItems="center"
      color={token('colors.accent.action-primary-default')}
      cursor={isClickable ? 'pointer' : 'unset'}
      isInline
      {...rest}
    >
      <LeatherIcon />
    </Stack>
  );
});
