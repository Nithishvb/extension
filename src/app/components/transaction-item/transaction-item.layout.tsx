import { Box, Flex, Stack } from 'leather-styles/jsx';

import { SpaceBetween } from '@app/components/layout/space-between';

interface TransactionItemLayoutProps {
  openTxLink(): void;
  txCaption: React.JSX.Element;
  txTitle: React.JSX.Element;
  txValue: React.JSX.Element;
  txIcon?: React.JSX.Element;
  txStatus?: React.JSX.Element;
  belowCaptionEl?: React.JSX.Element;
  children?: React.JSX.Element;
}
export function TransactionItemLayout({
  openTxLink,
  txCaption,
  txIcon,
  txStatus,
  txTitle,
  txValue,
  belowCaptionEl,
  children,
  ...rest
}: TransactionItemLayoutProps) {
  return (
    <Box position="relative" cursor="pointer" {...rest}>
      <Stack
        alignItems="center"
        // #4164 FIXME migrate
        // isInline
        onClick={openTxLink}
        position="relative"
        gap="base-loose"
        zIndex={2}
      >
        {txIcon && txIcon}
        <Flex flexDirection="column" justifyContent="space-between" flexGrow={1} minWidth="0px">
          <SpaceBetween spacing="extra-loose">
            {txTitle} {txValue}
          </SpaceBetween>
          <Stack
            alignItems="center"
            // #4164 FIXME migrate
            //isInline
          >
            {txCaption} {txStatus && txStatus}
            {belowCaptionEl ? belowCaptionEl : null}
          </Stack>
        </Flex>
      </Stack>
      {children}
    </Box>
  );
}
