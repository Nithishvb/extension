import { toast } from 'react-hot-toast';
import { FiCheck, FiCopy, FiExternalLink } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

import { Stack } from '@stacks/ui';
import { Text } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { BitcoinContractTransactionSummaryDetails } from '@app/common/hooks/use-bitcoin-contracts';
import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { satToBtc } from '@app/common/money/unit-conversion';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardFooter,
} from '@app/components/info-card/info-card';
import { ModalHeader } from '@app/components/modal-header';

export function LockBitcoinSummary() {
  const location = useLocation();
  const { state } = location as { state: BitcoinContractTransactionSummaryDetails };

  const { txId, txMoney, txFiatValue, txFiatValueSymbol, symbol, txLink } = state;

  const { onCopy } = useClipboard(txId);
  const { handleOpenTxLink } = useExplorerLink();
  const analytics = useAnalytics();

  function onClickLink() {
    void analytics.track('view_transaction_confirmation', { symbol: 'BTC' });
    handleOpenTxLink(txLink);
  }

  function onClickCopy() {
    onCopy();
    toast.success('ID copied!');
  }

  useRouteHeader(<ModalHeader hideActions defaultClose title="Locked Bitcoin" />);

  return (
    <InfoCard>
      <InfoCardAssetValue
        value={Number(satToBtc(txMoney.amount))}
        fiatValue={i18nFormatCurrency(txFiatValue)}
        fiatSymbol={txFiatValueSymbol}
        symbol={symbol}
        icon={FiCheck}
        my="loose"
        px="loose"
      />
      <Text fontSize={2} fontWeight={200} padding={'25px'} textAlign={'justify'}>
        <span style={{ fontWeight: 500 }}>Success!</span> Your bitcoin has been locked securely. All
        that's left is for it to be confirmed on the blockchain. After confirmation, you can proceed
        with borrowing against it.
      </Text>
      <InfoCardFooter>
        <Stack spacing="base" isInline width="100%">
          <InfoCardBtn onClick={onClickLink} icon={FiExternalLink} label="View Details" />
          <InfoCardBtn onClick={onClickCopy} icon={FiCopy} label="Copy ID" />
        </Stack>
      </InfoCardFooter>
    </InfoCard>
  );
}
