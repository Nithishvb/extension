import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { BitcoinContractResponseStatus } from '@shared/rpc/methods/accept-bitcoin-contract';
import { closeWindow } from '@shared/utils';

import { useBtcAssetBalance } from '@app/common/hooks/balance/btc/use-btc-balance';
import {
  BitcoinContractOfferDetails,
  useBitcoinContracts,
} from '@app/common/hooks/use-bitcoin-contracts';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { initialSearchParams } from '@app/common/initial-search-params';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { BitcoinContractCollateralAmount } from './components/bitcoin-contract-collateral-amount';
import { BitcoinContractExpirationDate } from './components/bitcoin-contract-expiration-date';
import { BitcoinContractFee } from './components/bitcoin-contract-fee';
import { BitcoinContractInputsAndOutputs } from './components/bitcoin-contract-inputs-outputs';
import { BitcoinContractRequestRawTransaction } from './components/bitcoin-contract-raw-transaction';
import { BitcoinContractRequestActions } from './components/bitcoin-contract-request-actions';
import { BitcoinContractRequestDetails } from './components/bitcoin-contract-request-details';
import { BitcoinContractRequestDetailsHeader } from './components/bitcoin-contract-request-details-header';
import { BitcoinContractRequestHeader } from './components/bitcoin-contract-request-header';
import { BitcoinContractRequestLayout } from './components/bitcoin-contract-request-layout';

export function BitcoinContractRequest() {
  const navigate = useNavigate();
  const network = useCurrentNetwork();
  const { address: bitcoinAddress } = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { handleOffer, handleSigning, handleReject, sendRpcResponse } = useBitcoinContracts();
  const { btcAvailableAssetBalance } = useBtcAssetBalance(bitcoinAddress);

  const [bitcoinContractOfferDetails, setBitcoinContractOfferDetails] =
    useState<BitcoinContractOfferDetails>();
  const [isProcessing, setProcessing] = useState(false);
  const [canAccept, setCanAccept] = useState(false);

  useRouteHeader(<PopupHeader displayAddresssBalanceOf="all" />);
  useOnOriginTabClose(() => closeWindow());

  const handleSignClick = async () => {
    setProcessing(true);
    await handleSigning();
    setProcessing(false);
  };

  const handleRejectClick = async () => {
    if (!bitcoinContractOfferDetails) return;
    handleReject();
  };

  useOnMount(() => {
    const bitcoinContractOfferJSON = initialSearchParams.get('bitcoinContractOffer');
    const counterpartyWalletDetailsJSON = initialSearchParams.get('counterpartyWalletDetails');

    if (network.chain.bitcoin.network !== 'testnet') {
      navigate(RouteUrls.BitcoinContractLockError, {
        state: {
          error: new Error('Invalid Network'),
          title: "Network doesn't support Bitcoin Contracts",
          body: "The wallet's current selected network doesn't support Bitcoin Contracts",
        },
      });
      sendRpcResponse(BitcoinContractResponseStatus.NETWORK_ERROR);
    }

    if (!bitcoinContractOfferJSON || !counterpartyWalletDetailsJSON) return;

    const handleBitcoinContractOffer = async () => {
      const currentBitcoinContractOfferDetails = await handleOffer(
        bitcoinContractOfferJSON,
        counterpartyWalletDetailsJSON
      );
      if (!currentBitcoinContractOfferDetails) return;

      setCanAccept(
        btcAvailableAssetBalance.balance.amount.isGreaterThan(
          currentBitcoinContractOfferDetails.simplifiedBitcoinContract
            .bitcoinContractCollateralAmount +
            currentBitcoinContractOfferDetails?.simplifiedBitcoinContract.bitcoinTxDetails.fee
        )
      );
      setBitcoinContractOfferDetails(currentBitcoinContractOfferDetails);
    };
    handleBitcoinContractOffer();
  });

  if (
    !bitcoinContractOfferDetails ||
    !bitcoinContractOfferDetails.counterpartyWalletDetails.counterpartyWalletAddress
  )
    return <LoadingSpinner height="600px" />;

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
            collateralAmount={createMoney(
              bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinContractCollateralAmount,
              'BTC'
            )}
          />
          <BitcoinContractInputsAndOutputs
            inputs={bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinTxDetails.inputs}
            outputs={bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinTxDetails.outputs}
          />
          <BitcoinContractRequestRawTransaction
            bitcoinContractTransaction={
              bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinTxDetails.rawTx
            }
          />
          <BitcoinContractFee
            fee={createMoney(
              bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinTxDetails.fee,
              'BTC'
            )}
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
