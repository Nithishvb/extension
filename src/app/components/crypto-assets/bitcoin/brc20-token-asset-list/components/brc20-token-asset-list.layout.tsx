import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Stack, StackProps } from 'leather-styles/jsx';

export function Brc20AssetListLayout({ children }: StackProps) {
  return (
    <Stack
      width="100%"
      data-testid={CryptoAssetSelectors.CryptoAssetList}
      pb="extra-loose"
      px="loose"
      gap="extra-loose"
    >
      {children}
    </Stack>
  );
}
