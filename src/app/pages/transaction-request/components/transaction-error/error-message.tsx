import { memo } from 'react';

import { Stack, StackProps } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { ErrorIcon } from '@app/components/icons/error-icon';

interface ErrorMessageProps extends StackProps {
  title: string;
  body: string | React.JSX.Element;
  actions?: React.JSX.Element;
}
export const ErrorMessage = memo(({ title, body, actions, ...rest }: ErrorMessageProps) => {
  return (
    <Stack
      bg={token('colors.accent.background-primary')}
      border="4px solid #FCEEED"
      borderRadius="12px"
      gap="extra-loose"
      mb="loose"
      p="loose"
      {...rest}
    >
      <Stack gap="base-loose">
        {/* FIXME - isInline */}
        <Stack alignItems="center" color={token('colors.error')}>
          <ErrorIcon />
          <styled.h1 textStyle="label.01">{title}</styled.h1>
        </Stack>
        <styled.span textStyle="caption.01">{body}</styled.span>
      </Stack>
      {actions && <Stack gap="base-tight">{actions}</Stack>}
    </Stack>
  );
});
