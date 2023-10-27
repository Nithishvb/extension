import { BitcoinContractInput } from '@app/common/hooks/use-bitcoin-contracts';

import { BitcoinContractInputItem } from './components/bitcoin-contract-input-item';
import { BitcoinContractInputListLayout } from './components/bitcoin-contract-input-list.layout';

export function BitcoinContractInputList({ inputs }: { inputs: BitcoinContractInput[] }) {
  return (
    <BitcoinContractInputListLayout>
      {inputs.map((input, i) => (
        <BitcoinContractInputItem key={i} utxo={input} />
      ))}
    </BitcoinContractInputListLayout>
  );
}
