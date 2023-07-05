import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useBitcoinContracts } from '@app/common/hooks/use-bitcoin-contracts';
import { BitcoinContractOfferDetails } from '@app/common/hooks/use-bitcoin-contracts';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { initialSearchParams } from '@app/common/initial-search-params';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { BitcoinContractOfferDetailsSimple } from './components/bitcoin-contract-offer/bitcoin-contract-offer-details';
import { BitcoinContractRequestActions } from './components/bitcoin-contract-request-actions';
import { BitcoinContractRequestHeader } from './components/bitcoin-contract-request-header';
import { BitcoinContractRequestLayout } from './components/bitcoin-contract-request-layout';
import { BitcoinContractRequestWarningLabel } from './components/bitcoin-contract-request-warning-label';

export function BitcoinContractRequest() {
  const getNativeSegwitSigner = useCurrentAccountNativeSegwitSigner();
  const navigate = useNavigate();

  const { handleOffer, handleAccept, handleReject, sendRpcResponse } = useBitcoinContracts();

  const [bitcoinContractJSON, setBitcoinContractJSON] = useState<string>();
  const [bitcoinContractOfferDetails, setBitcoinContractOfferDetails] =
    useState<BitcoinContractOfferDetails>();
  const [bitcoinAddress, setBitcoinAddress] = useState<string>();

  const [isLoading, setLoading] = useState(true);

  const handleAcceptClick = async () => {
    if (!bitcoinContractJSON || !bitcoinContractOfferDetails) return;

    await handleAccept(bitcoinContractJSON, bitcoinContractOfferDetails.counterpartyWalletDetails);
  };

  const handleRejectClick = async () => {
    if (!bitcoinContractOfferDetails) return;

    await handleReject(bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinContractId);
  };

  useOnMount(() => {
    const bitcoinContractOfferJSON = initialSearchParams.get('bitcoinContractOffer');
    const counterpartyWalletURL = initialSearchParams.get('counterpartyWalletURL');
    const counterpartyWalletName = initialSearchParams.get('counterpartyWalletName');
    const counterpartyWalletIcon = initialSearchParams.get('counterpartyWalletIcon');

    const bitcoinAccountDetails = getNativeSegwitSigner?.(0);

    if (!bitcoinAccountDetails) return;

    const currentBitcoinNetwork = bitcoinAccountDetails.network;

    if (currentBitcoinNetwork !== 'testnet') {
      navigate(RouteUrls.BitcoinContractLockError, {
        state: {
          error: new Error('invalid network'),
          title: 'The account you are using is not on the Bitcoin Testnet',
          body: 'Unable to interact with Bitcoin Contract',
        },
      });
      sendRpcResponse('none', '', 'failed');
    }

    if (
      !getNativeSegwitSigner ||
      !bitcoinContractOfferJSON ||
      !counterpartyWalletURL ||
      !counterpartyWalletName ||
      !counterpartyWalletIcon
    )
      return;

    const currentBitcoinContractOfferDetails = handleOffer(
      bitcoinContractOfferJSON,
      counterpartyWalletURL,
      counterpartyWalletName,
      counterpartyWalletIcon
    );

    const currentAddress = getNativeSegwitSigner(0).address;

    setBitcoinContractJSON(bitcoinContractOfferJSON);
    setBitcoinContractOfferDetails(currentBitcoinContractOfferDetails);
    setBitcoinAddress(currentAddress);
    setLoading(false);
  });

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
          <BitcoinContractRequestWarningLabel
            appName={bitcoinContractOfferDetails.counterpartyWalletDetails.counterpartyWalletName}
          />
          <BitcoinContractRequestActions
            isLoading={isLoading}
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
