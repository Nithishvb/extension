import { truncateMiddle } from '@stacks/ui-utils';

import { createMoney } from '@shared/models/money.model';

import { BitcoinContractInput } from '@app/common/hooks/use-bitcoin-contracts';
import { formatMoney } from '@app/common/money/format-money';

import { BitcoinContractInputOutputItemLayout } from './bitcoin-contract-input-output-item.layout';

export function BitcoinContractInputItem({ utxo }: { utxo: BitcoinContractInput }) {
  return (
    <BitcoinContractInputOutputItemLayout
      address={truncateMiddle(utxo.address)}
      addressHoverLabel={utxo.address}
      amount={formatMoney(createMoney(utxo.value, 'BTC'))}
      txId={truncateMiddle(utxo.txId)}
      txIdHoverLabel={utxo.txId}
    />
  );
}
