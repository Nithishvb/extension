import { Flex, StackProps } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';
import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import { Money } from '@shared/models/money.model';

import { formatBalance } from '@app/common/format-balance';
import { ftDecimals } from '@app/common/stacks-utils';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';
import { Caption, Text } from '@app/components/typography';

import { LoadingSpinner } from '../loading-spinner';

interface BitcoinContractEntryPointLayoutProps extends StackProps {
  balance: Money;
  caption: string;
  icon: React.JSX.Element;
  usdBalance?: string;
  isLoading?: boolean;
  onClick: () => void;
}
export const BitcoinContractEntryPointLayout = forwardRefWithAs(
  (props: BitcoinContractEntryPointLayoutProps) => {
    const { balance, caption, icon, usdBalance, isLoading, onClick } = props;

    const amount = balance.decimals
      ? ftDecimals(balance.amount, balance.decimals)
      : balance.amount.toString();
    const dataTestId = CryptoAssetSelectors.CryptoAssetListItem.replace(
      '{symbol}',
      balance.symbol.toLowerCase()
    );
    const formattedBalance = formatBalance(amount);

    return (
      <Flex as={'button'} onClick={onClick} data-testid={dataTestId} outline={0}>
        <Flag img={icon} align="middle" width="100%">
          <SpaceBetween width="100%">
            <Text>{'Bitcoin Contracts'}</Text>
            <Tooltip
              label={formattedBalance.isAbbreviated ? balance.amount.toString() : undefined}
              placement="left-start"
            >
              <Text
                data-testid={'Bitcoin Contracts'}
                fontVariantNumeric="tabular-nums"
                textAlign="right"
              >
                {isLoading ? <LoadingSpinner /> : formattedBalance.value}
              </Text>
            </Tooltip>
          </SpaceBetween>
          <SpaceBetween height="1.25rem" width="100%">
            <Caption>{caption}</Caption>
            <Flex>{isLoading ? '' : <Caption>{usdBalance}</Caption>}</Flex>
          </SpaceBetween>
        </Flag>
      </Flex>
    );
  }
);
