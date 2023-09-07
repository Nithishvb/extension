import { truncateMiddle } from '@stacks/ui-utils';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Flex, Spinner, Stack, StackProps, color, useMediaQuery } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';

import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';

import { CaptionDotSeparator } from '../caption-dot-separator';
import { CheckmarkIcon } from '../icons/checkmark-icon';
import { Flag } from '../layout/flag';
import { SpaceBetween } from '../layout/space-between';

interface AccountListItemLayoutProps extends StackProps {
  isLoading: boolean;
  isActive: boolean;
  index: number;
  stxAddress: string;
  btcAddress: string;
  accountName: React.ReactNode;
  avatar: React.JSX.Element;
  balanceLabel: React.ReactNode;
  hasCopied?: boolean;
  onCopyToClipboard?(e: React.MouseEvent): void;
  onClickBtcCopyIcon?(e: React.MouseEvent): void;
  onSelectAccount(): void;
}
export function AccountListItemLayout(props: AccountListItemLayoutProps) {
  const {
    index,
    isLoading,
    isActive,
    stxAddress,
    btcAddress,
    accountName,
    avatar,
    balanceLabel,
    onSelectAccount,
    hasCopied,
    onCopyToClipboard,
    onClickBtcCopyIcon,
    children = null,
    ...rest
  } = props;

  const [isNarrowViewport] = useMediaQuery('(max-width: 400px)');
  const isBitcoinEnabled = useConfigBitcoinEnabled();

  return (
    <Flex
      width="100%"
      key={`account-${index}`}
      data-testid={SettingsSelectors.SwitchAccountItemIndex.replace('[index]', `${index}`)}
      cursor="pointer"
      position="relative"
      onClick={onSelectAccount}
      {...rest}
    >
      <Flag align="middle" img={avatar} spacing="space.04" width="100%">
        {/* // FIXME isinline */}
        <Stack gap="extra-tight">
          <SpaceBetween>
            <Stack alignItems="center" gap="space.02">
              {accountName}
              {isActive && <CheckmarkIcon />}
            </Stack>
            {isLoading ? (
              <Spinner
                position="absolute"
                right={0}
                top="calc(50% - 8px)"
                color={token('colors.accent.text-subdued')}
                size="18px"
              />
            ) : (
              balanceLabel
            )}
          </SpaceBetween>
          <Stack
            alignItems="center"
            gap="6px"
            // #4164 FIXME migrate
            //isInline
            whiteSpace="nowrap"
          >
            <CaptionDotSeparator>
              <styled.span textStyle="caption.02">
                {truncateMiddle(stxAddress, isNarrowViewport ? 3 : 4)}
              </styled.span>
              {isBitcoinEnabled && (
                <styled.span textStyle="caption.02">{truncateMiddle(btcAddress, 5)}</styled.span>
              )}
            </CaptionDotSeparator>
          </Stack>
        </Stack>
      </Flag>
      {children}
    </Flex>
  );
}
