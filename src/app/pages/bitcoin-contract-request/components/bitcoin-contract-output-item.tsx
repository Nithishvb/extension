import { truncateMiddle } from '@stacks/ui-utils';

import { createMoney } from '@shared/models/money.model';

import { BitcoinContractOutput } from '@app/common/hooks/use-bitcoin-contracts';
import { formatMoney } from '@app/common/money/format-money';

import { BitcoinContractInputOutputItemLayout } from './bitcoin-contract-input-output-item.layout';

export function BitcoinContractOutputItem({ output }: { output: BitcoinContractOutput }) {
  const isUnknownAddress = output.address === '';

  if (isUnknownAddress) return null;

  return (
    <BitcoinContractInputOutputItemLayout
      address={truncateMiddle(output.address)}
      addressHoverLabel={output.address}
      amount={formatMoney(createMoney(Number(output.value), 'BTC'))}
    />
  );
}
