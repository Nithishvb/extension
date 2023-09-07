import { FiCheck } from 'react-icons/fi';

import { Flex, FlexProps } from 'leather-styles/jsx';

import { Caption } from '@app/components/typography';

interface LedgerSuccessLabelProps extends FlexProps {
  children: React.ReactNode;
}
export function LedgerSuccessLabel({ children, ...props }: LedgerSuccessLabelProps) {
  return (
    <Flex alignItems="center" color={color('feedback-success')} flexDirection="row" {...props}>
      <FiCheck />
      <Caption color="inherited" ml="space.02">
        {children}
      </Caption>
    </Flex>
  );
}
