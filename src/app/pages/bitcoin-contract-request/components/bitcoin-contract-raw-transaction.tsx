import { useState } from 'react';

import { RawBitcoinContractTransaction } from '@app/common/hooks/use-bitcoin-contracts';
import { Json } from '@app/components/json';

import { BitcoinContractRequestDetailsSectionHeader } from './bitcoin-contract-request-details-section-header';
import { BitcoinContractRequestDetailsSectionLayout } from './bitcoin-contract-request-details-section-layout';

export function BitcoinContractRequestRawTransaction({
  bitcoinContractTransaction,
}: {
  bitcoinContractTransaction: RawBitcoinContractTransaction;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <BitcoinContractRequestDetailsSectionLayout>
      <BitcoinContractRequestDetailsSectionHeader
        hasDetails
        onSetShowDetails={(value: boolean) => setShowDetails(value)}
        showDetails={showDetails}
        title="Raw transaction"
      />
      {showDetails ? <Json value={bitcoinContractTransaction} /> : null}
    </BitcoinContractRequestDetailsSectionLayout>
  );
}
