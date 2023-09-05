import { memo } from 'react';

import { BoxProps, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

export const SettingsMenuItem = memo((props: BoxProps) => {
  const { onClick, children, ...rest } = props;
  return (
    <styled.div
      width="100%"
      px="base"
      py="base"
      cursor="pointer"
      color={color('text-title')}
      _hover={{ backgroundColor: token('colors.brown.2') }}
      onClick={e => {
        onClick?.(e);
      }}
      fontSize={1}
      {...rest}
    >
      {children}
    </styled.div>
  );
});
