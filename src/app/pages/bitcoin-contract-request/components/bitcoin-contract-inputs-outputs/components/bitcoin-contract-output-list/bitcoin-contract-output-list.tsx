import { BitcoinContractOutput } from '@app/common/hooks/use-bitcoin-contracts';

import { BitcoinContractOutputItem } from './components/bitcoin-contract-output-item';
import { BitcoinContractOutputListLayout } from './components/bitcoin-contract-output-list.layout';

export function BitcoinContractOutputList({ outputs }: { outputs: BitcoinContractOutput[] }) {
  return (
    <BitcoinContractOutputListLayout>
      {outputs.map((output, i) => (
        <BitcoinContractOutputItem key={i} output={output} />
      ))}
    </BitcoinContractOutputListLayout>
  );
}
