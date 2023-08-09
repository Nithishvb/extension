import { useState } from 'react';

import {
  BitcoinContractListItem,
  useBitcoinContracts,
} from '@app/common/hooks/use-bitcoin-contracts';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';

import { BitcoinContractListItemLayout } from './components/bitcoin-contract-list-item-layout';
import { BitcoinContractListLayout } from './components/bitcoin-contract-list-layout';

export function BitcoinContractList() {
  const { getAllSignedBitcoinContracts, formatBitcoinContracts } = useBitcoinContracts();
  const [bitcoinContracts, setBitcoinContracts] = useState<BitcoinContractListItem[]>([]);
  const [isLoading, setLoading] = useState(true);

  useOnMount(() => {
    const fetchAndFormatBitcoinContracts = async () => {
      const fetchedBitcoinContracts = await getAllSignedBitcoinContracts();
      const formattedBitcoinContracts = formatBitcoinContracts(fetchedBitcoinContracts);
      setBitcoinContracts(formattedBitcoinContracts);
      setLoading(false);
    };
    fetchAndFormatBitcoinContracts();
  });

  if (isLoading) return <FullPageLoadingSpinner />;

  return (
    <BitcoinContractListLayout>
      {bitcoinContracts.map(bitcoinContract => {
        return (
          <BitcoinContractListItemLayout
            id={bitcoinContract.id}
            collateralAmount={bitcoinContract.collateralAmount}
            txId={bitcoinContract.txId}
            state={bitcoinContract.state}
          />
        );
      })}
    </BitcoinContractListLayout>
  );
}
