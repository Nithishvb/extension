import { FiInfo } from 'react-icons/fi';

import { Box, Flex } from 'leather-styles/jsx';

import { Tooltip } from '@app/components/tooltip';
import { Caption } from '@app/components/typography';

interface LedgerScreenDetailProps {
  children: React.ReactNode;
  title: string;
  tooltipLabel?: string;
}
export function LedgerScreenDetail(props: LedgerScreenDetailProps) {
  const { children, title, tooltipLabel } = props;

  return (
    <Flex borderColor="#DCDDE2" flexDirection="column">
      <Caption>
        {tooltipLabel ? (
          <Tooltip label={tooltipLabel} placement="top">
            <Flex display="inline-flex" cursor="question">
              {title}
              <Box
                as={FiInfo}
                color={token('colors.accent.text-subdued')}
                ml="extra-tight"
                size="14px"
                mt="3px"
              />
            </Flex>
          </Tooltip>
        ) : (
          <>{title}</>
        )}
      </Caption>
      <Flex alignItems="center" mt="space.04">
        <styled.span overflowWrap="break-word" width="100%">
          {children}
        </styled.span>
      </Flex>
    </Flex>
  );
}
