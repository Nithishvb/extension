import { useState } from 'react';

import {
  BitcoinContractInput,
  BitcoinContractOutput,
} from '@app/common/hooks/use-bitcoin-contracts';

import { BitcoinContractRequestDetailsSectionHeader } from '../bitcoin-contract-details/components/bitcoin-contract-details-section/components/bitcoin-contract-request-details-section-header';
import { BitcoinContractRequestDetailsSectionLayout } from '../bitcoin-contract-details/components/bitcoin-contract-details-section/components/bitcoin-contract-request-details-section.layout';
import { BitcoinContractInputList } from './components/bitcoin-contract-input-list/bitcoin-contract-input-list';
import { BitcoinContractOutputList } from './components/bitcoin-contract-output-list/bitcoin-contract-output-list';

interface BitcoinContractInputsOutputsProps {
  inputs: BitcoinContractInput[];
  outputs: BitcoinContractOutput[];
}

export function BitcoinContractInputsAndOutputs(props: BitcoinContractInputsOutputsProps) {
  const { inputs, outputs } = props;
  const [showDetails, setShowDetails] = useState(false);

  if (!inputs.length || !outputs.length) return null;

  return (
    <BitcoinContractRequestDetailsSectionLayout>
      <BitcoinContractRequestDetailsSectionHeader
        hasDetails
        onSetShowDetails={(value: boolean) => setShowDetails(value)}
        showDetails={showDetails}
        title={showDetails ? 'Inputs' : 'Inputs and Outputs'}
      />
      {showDetails ? (
        <>
          <BitcoinContractInputList inputs={inputs} />
          <BitcoinContractRequestDetailsSectionHeader title="Outputs" />
          <BitcoinContractOutputList outputs={outputs} />
        </>
      ) : null}
    </BitcoinContractRequestDetailsSectionLayout>
  );
}
