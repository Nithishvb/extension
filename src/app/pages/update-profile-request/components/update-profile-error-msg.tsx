import { FiAlertTriangle } from 'react-icons/fi';

import { Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Caption } from '@app/components/typography';

interface ErrorMessageProps {
  errorMessage: string;
}
export function ErrorMessage(props: ErrorMessageProps) {
  const { errorMessage } = props;
  if (!errorMessage) return null;

  /** Stacks UI Stack 
   *
   * Replacing <Stack isInline with
   *  
   * var spacingProps = useCallback(function (theme) {
    var value = get(theme, "space")[spacing] || spacing;
    return isInline ? {
      marginTop: 0,
      marginInlineEnd: value,
      marginBottom: 0,
      marginInlineStart: 0
    } : {
      marginBottom: value
    };
   */
  return (
    <Stack
      alignItems="center"
      bg="#FCEEED"
      p="base"
      borderRadius="12px"
      mt={0}
      mb={0}
      marginInlineStart={0}
      marginInlineEnd={0} // FIXME and refactor this as per design rather than stacksui
    >
      <styled.span>
        <FiAlertTriangle color={token('colors.error')} strokeWidth={2} />
      </styled.span>
      <Caption color={token('colors.error')}>{errorMessage}</Caption>
    </Stack>
  );
}
