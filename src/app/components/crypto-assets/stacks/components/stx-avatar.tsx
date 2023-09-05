import { BoxProps, Circle } from 'leather-styles/jsx';

import { StxIcon } from '@app/components/icons/stx-icon';

import { StacksUnanchoredStatusIcon } from './stacks-unanchored-status-icon';

interface StxAvatarProps extends BoxProps {
  isUnanchored?: boolean;
}
export function StxAvatar({ isUnanchored, ...props }: StxAvatarProps) {
  return (
    <Circle
      bg={color('accent')}
      color={token('colors.accent.background-primary')}
      position="relative"
      size="36px"
      {...props}
    >
      <StxIcon />
      {isUnanchored ? <StacksUnanchoredStatusIcon /> : null}
    </Circle>
  );
}
