// #4164 FIXME migrate DynamicColorCircle
import { DynamicColorCircle } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import { Stack, StackProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { formatContractId } from '@app/common/utils';
import { Caption, Title } from '@app/components/typography';

interface ContractPreviewLayoutProps extends StackProps {
  contractAddress: string;
  contractName: string;
  functionName?: string;
}

export function ContractPreviewLayout(props: ContractPreviewLayoutProps) {
  const { contractAddress, contractName, functionName, ...rest } = props;

  return (
    <Stack
      p="space.04"
      borderRadius="12px"
      gap="space.04"
      alignItems="center"
      isInline
      border="1px solid"
      borderColor={token('colors.accent.background-primary')}
      _hover={
        rest.onClick
          ? {
              cursor: 'pointer',
            }
          : undefined
      }
      {...rest}
    >
      <DynamicColorCircle
        size="42px"
        position="relative"
        string={`${formatContractId(contractAddress, contractName)}${
          functionName ? `::${functionName}` : ''
        }`}
        backgroundSize="100%"
      />
      <Stack gap="base-tight">
        <Title as="h3" fontWeight="500">
          {functionName || contractName}
        </Title>
        <Caption>
          {truncateMiddle(contractAddress, functionName ? 4 : 6)}
          {functionName ? `.${contractName}` : ''}
        </Caption>
      </Stack>
    </Stack>
  );
}
