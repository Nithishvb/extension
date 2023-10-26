import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { BitcoinContractResponseStatus } from '@shared/rpc/methods/accept-bitcoin-contract';

import { useBitcoinContracts } from '@app/common/hooks/use-bitcoin-contracts';
import { BitcoinContractOfferDetails } from '@app/common/hooks/use-bitcoin-contracts';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { initialSearchParams } from '@app/common/initial-search-params';

import { BitcoinContractOfferDetailsSimple } from './components/bitcoin-contract-offer/bitcoin-contract-offer-details';
import { BitcoinContractRequestActions } from './components/bitcoin-contract-request-actions';
import { BitcoinContractRequestLayout } from './components/bitcoin-contract-request-layout';
import { BitcoinContractRequestHeader } from './components/bitcoin-contract-request-header';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { closeWindow } from '@shared/utils';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

export function BitcoinContractRequest() {
  const { address: bitcoinAddress } = useCurrentAccountNativeSegwitIndexZeroSigner();
  const network = useCurrentNetwork();
  const navigate = useNavigate();

  const { handleOffer, handleAccept, handleReject, sendRpcResponse } = useBitcoinContracts();

  const [bitcoinContractJSON, setBitcoinContractJSON] = useState<string>();
  const [bitcoinContractOfferDetails, setBitcoinContractOfferDetails] =
    useState<BitcoinContractOfferDetails>();

  const [isLoading, setLoading] = useState(true);
  const [isProcessing, setProcessing] = useState(false);
  
  useRouteHeader(<PopupHeader displayAddresssBalanceOf="all" />);
  useOnOriginTabClose(() => closeWindow());

  const handleAcceptClick = async () => {
    if (!bitcoinContractJSON || !bitcoinContractOfferDetails) return;
    setProcessing(true);
    await handleAccept(
      bitcoinContractJSON,
      bitcoinContractOfferDetails.counterpartyWalletDetails,
      ['']
    );
    setProcessing(false);
  };

  const handleRejectClick = async () => {
    if (!bitcoinContractOfferDetails) return;
    handleReject();
  };

  useOnMount(() => {
    const bitcoinContractOfferJSON = initialSearchParams.get('bitcoinContractOffer');
    const counterpartyWalletDetailsJSON = initialSearchParams.get('counterpartyWalletDetails');
    const attestorURLs = initialSearchParams.get('attestorURLs');

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

    if (
      !bitcoinContractOfferJSON ||
      !counterpartyWalletDetailsJSON ||
      !attestorURLs
    )
      return;

    const currentBitcoinContractOfferDetails = handleOffer(
      bitcoinContractOfferJSON,
      counterpartyWalletDetailsJSON
    );

    setBitcoinContractJSON(bitcoinContractOfferJSON);
    setBitcoinContractOfferDetails(currentBitcoinContractOfferDetails);
    setLoading(false);
  });

  if (isLoading) return <LoadingSpinner height="600px" />;

  return (
    <>
      {!isLoading && bitcoinAddress && bitcoinContractOfferDetails && (
        <BitcoinContractRequestLayout>
          <BitcoinContractRequestHeader
            counterpartyWalletName={
              bitcoinContractOfferDetails.counterpartyWalletDetails.counterpartyWalletName
            }
            counterpartyWalletIcon={
              bitcoinContractOfferDetails.counterpartyWalletDetails.counterpartyWalletIcon
            }
          />
          <BitcoinContractRequestActions
            isLoading={isProcessing}
            bitcoinAddress={bitcoinAddress}
            requiredAmount={
              bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinContractCollateralAmount
            }
            onRejectBitcoinContractOffer={handleRejectClick}
            onAcceptBitcoinContractOffer={handleAcceptClick}
          />
          <BitcoinContractOfferDetailsSimple
            bitcoinAddress={bitcoinAddress}
            bitcoinContractOffer={bitcoinContractOfferDetails.simplifiedBitcoinContract}
          />
        </BitcoinContractRequestLayout>
      )}
    </>
  );
}
