import { Box, Flex, Stack, color } from '@stacks/ui';
import { Caption } from '@app/components/typography';
import { Tooltip } from '@app/components/tooltip';
import { FiInfo } from 'react-icons/fi';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';
const pendingWaitingMessage =
  'This transaction is waiting to be confirmed. Depending on network congestion, this may take anywhere from a few minutes, to a couple of hours.';

export function PendingLabel() {
  return (
    <Flex>
      <Caption
        data-testid={SendFormSelectors.PendingStatus}
        variant="c2"
        color={color('feedback-alert')}
      >
        Pending
      </Caption>
      <Tooltip
        label={pendingWaitingMessage}
        labelProps={{ bg: '#e2e2e2', padding: '5px', borderRadius: '5px' }}
        placement="bottom"
      >
        <Stack>
          <Box
            _hover={{ cursor: 'pointer' }}
            as={FiInfo}
            color={color('feedback-alert')}
            ml={'2px'}
            size="10px"
          />
        </Stack>
      </Tooltip>
    </Flex>
  );
}