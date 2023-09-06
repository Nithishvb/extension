import { Stack, StackProps } from 'leather-styles/jsx';

import { isValidUrl } from '@shared/utils/validate-url';

import { StacksAssetAvatar } from '@app/components/crypto-assets/stacks/components/stacks-asset-avatar';
import { SpaceBetween } from '@app/components/layout/space-between';

interface AssetItemProps extends StackProps {
  iconString: string;
  amount: string | number;
  ticker: string;
}

export function TxAssetItem(props: AssetItemProps): React.JSX.Element {
  const { iconString, amount, ticker, ...rest } = props;
  const imageCanonicalUri = isValidUrl(iconString) ? iconString : undefined;

  return (
    <SpaceBetween alignItems="center" flexGrow={1} width="100%" {...rest}>
      <Stack isInline>
        <StacksAssetAvatar
          gradientString={iconString}
          imageCanonicalUri={imageCanonicalUri}
          isStx={iconString === 'STX'}
          size="32px"
        />
        <styled.span fontWeight="500" fontSize={4}>
          {ticker}
        </styled.span>
      </Stack>
      <styled.span fontWeight="500" fontSize={4}>
        {amount}
      </styled.span>
    </SpaceBetween>
  );
}
