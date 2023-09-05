import { forwardRefWithAs } from '@stacks/ui-core';
import { Stack, StackProps } from 'leather-styles/jsx';

// #4164 FIXME migrate - could be able to replace this <SpaceBetween with a different Panda prop
export const SpaceBetween = forwardRefWithAs<StackProps, 'div'>((props, ref) => (
  <Stack
    // #4164 FIXME migrate
    // isInline
    alignItems="center"
    justifyContent="space-between"
    {...props}
    ref={ref}
  />
));
