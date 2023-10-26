import { BitcoinContractOutput } from '@app/common/hooks/use-bitcoin-contracts';

import { BitcoinContractOutputItem } from './bitcoin-contract-output-item';
import { BitcoinContractOutputListLayout } from './bitcoin-contract-output-list.layout';

export function BitcoinContractOutputList({ outputs }: { outputs: BitcoinContractOutput[] }) {
  return (
    <BitcoinContractOutputListLayout>
      {outputs.map((output, i) => (
        <BitcoinContractOutputItem key={i} output={output} />
      ))}
    </BitcoinContractOutputListLayout>
  );
}
