import { color } from '@stacks/ui-utils';
import { Box, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { ChevronDownIcon } from '@app/components/icons/chevron-down-icon';

const labels = ['Address', 'BNS Name'];
const testLabels = ['address', 'bns-name'];

interface RecipientDropdownItemProps {
  index: number;
  isVisible?: boolean;
  onSelectItem(index: number): void;
}
export function RecipientDropdownItem(props: RecipientDropdownItemProps) {
  const { index, isVisible, onSelectItem } = props;

  return (
    <Box
      _hover={{ bg: isVisible ? color('bg-alt') : 'none', borderRadius: '8px' }}
      alignItems="center"
      as="button"
      data-testid={`recipient-select-field-${testLabels[index]}`}
      display="flex"
      height="32px"
      mb="0px !important"
      minWidth="110px"
      onClick={() => onSelectItem(index)}
      pl={isVisible ? 'tight' : 'unset'}
      type="button"
    >
      <styled.span
        color={isVisible ? color('text-body') : token('colors.brown.12')}
        fontSize={1}
        fontWeight={isVisible ? 400 : 500}
        ml="2px"
        mr="tight"
      >
        {labels[index]}
      </styled.span>
      {/* TODO - check if color needs to be passed to icon */}
      {isVisible ? <></> : <ChevronDownIcon color={token('colors.brown.12')} />}
    </Box>
  );
}
