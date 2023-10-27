import { BitcoinContractOfferDetails } from '@app/common/hooks/use-bitcoin-contracts';

import { BitcoinContractRequestDetails } from './components/bitcoin-contract-details/bitcoin-contract-request-details';
import { BitcoinContractCollateralAmount } from './components/bitcoin-contract-details/components/bitcoin-contract-collateral-amount';
import { BitcoinContractExpirationDate } from './components/bitcoin-contract-details/components/bitcoin-contract-expiration-date';
import { BitcoinContractFee } from './components/bitcoin-contract-details/components/bitcoin-contract-fee';
import { BitcoinContractRequestRawTransaction } from './components/bitcoin-contract-details/components/bitcoin-contract-raw-transaction';
import { BitcoinContractRequestDetailsHeader } from './components/bitcoin-contract-details/components/bitcoin-contract-request-details-header';
import { BitcoinContractInputsAndOutputs } from './components/bitcoin-contract-inputs-outputs/bitcoin-contract-inputs-outputs';
import { BitcoinContractRequestActions } from './components/bitcoin-contract-request-actions';
import { BitcoinContractRequestHeader } from './components/bitcoin-contract-request-header';
import { BitcoinContractRequestLayout } from './components/bitcoin-contract-request.layout';

export interface BitcoinContractSignerProps {
  bitcoinAddress: string;
  bitcoinContractOfferDetails: BitcoinContractOfferDetails;
  isProcessing: boolean;
  canAccept: boolean;
  handleRejectClick(): void;
  handleSignClick(): Promise<void>;
}
export function BitcoinContractSigner(props: BitcoinContractSignerProps) {
  const {
    bitcoinAddress,
    bitcoinContractOfferDetails,
    isProcessing,
    canAccept,
    handleRejectClick,
    handleSignClick,
  } = props;

  return (
    <>
      <BitcoinContractRequestLayout>
        <BitcoinContractRequestHeader
          counterpartyWalletName={
            bitcoinContractOfferDetails.counterpartyWalletDetails.counterpartyWalletName
          }
          counterpartyWalletIcon={
            bitcoinContractOfferDetails.counterpartyWalletDetails.counterpartyWalletIcon
          }
        />
        <BitcoinContractRequestDetails>
          <BitcoinContractRequestDetailsHeader />
          <BitcoinContractCollateralAmount
            bitcoinAddress={bitcoinAddress}
            collateralAmount={
              bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinContractCollateralAmount
            }
          />
          <BitcoinContractInputsAndOutputs
            inputs={
              bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinTransactionDetails.inputs
            }
            outputs={
              bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinTransactionDetails
                .outputs
            }
          />
          <BitcoinContractRequestRawTransaction
            bitcoinContractTransaction={
              bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinTransactionDetails.rawTx
            }
          />
          <BitcoinContractFee
            fee={
              bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinTransactionDetails.fee
            }
          />
          <BitcoinContractExpirationDate
            expirationDate={
              bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinContractExpirationDate
            }
          />
        </BitcoinContractRequestDetails>
        <BitcoinContractRequestActions
          isLoading={isProcessing}
          canAccept={canAccept}
          onRejectBitcoinContractOffer={handleRejectClick}
          onAcceptBitcoinContractOffer={handleSignClick}
        />
      </BitcoinContractRequestLayout>
    </>
  );
}
