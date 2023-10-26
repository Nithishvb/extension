import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { token } from 'leather-styles/tokens';

import { RouteUrls } from '@shared/route-urls';
import { BitcoinContractResponseStatus } from '@shared/rpc/methods/accept-bitcoin-contract';

import { useBitcoinContracts } from '@app/common/hooks/use-bitcoin-contracts';
import { BitcoinContractOfferDetails } from '@app/common/hooks/use-bitcoin-contracts';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { initialSearchParams } from '@app/common/initial-search-params';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import { InfoCard, InfoCardRow, InfoCardSeparator } from '@app/components/info-card/info-card';

import { BitcoinContractOfferInput } from './components/bitcoin-contract-offer/bitcoin-contract-offer-input';
import { BitcoinContractRequestActions } from './components/bitcoin-contract-request-actions';
import { BitcoinContractRequestLayout } from './components/bitcoin-contract-request-layout';
import { BitcoinContractRequestHeader } from './components/bitcoin-contract-request-header';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { PopupHeader } from '@app/features/current-account/popup-header';
import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';
import { closeWindow } from '@shared/utils';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';
import { Stack } from 'leather-styles/jsx';
import { LeatherButton } from '@app/components/button/button';

export function BitcoinContractRequest() {
  const navigate = useNavigate();
  const network = useCurrentNetwork();
  const { address: bitcoinAddress } = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { handleOffer, handleSigning, handleReject, sendRpcResponse } = useBitcoinContracts();

  const [requiredAmount, setRequiredAmount] = useState(0);
  const [bitcoinContractOfferDetails, setBitcoinContractOfferDetails] =
    useState<BitcoinContractOfferDetails>();
  const [isProcessing, setProcessing] = useState(false);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  
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
      setRequiredAmount(
        currentBitcoinContractOfferDetails?.simplifiedBitcoinContract
          .bitcoinContractCollateralAmount +
          currentBitcoinContractOfferDetails?.simplifiedBitcoinContract.bitcoinContractGasFee
      );
      setBitcoinContractOfferDetails(currentBitcoinContractOfferDetails);
    };
    handleBitcoinContractOffer();
  });

  if (!bitcoinContractOfferDetails || !bitcoinContractOfferDetails.counterpartyWalletDetails
    .counterpartyWalletAddress) return <LoadingSpinner height="600px" />;

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
          <BitcoinContractRequestActions
            isLoading={isProcessing}
            bitcoinAddress={bitcoinAddress}
            requiredAmount={requiredAmount}
            onRejectBitcoinContractOffer={handleRejectClick}
            onAcceptBitcoinContractOffer={handleSignClick}
          />
          <BitcoinContractOfferInput
            addressNativeSegwit={bitcoinAddress}
            bitcoinContractOffer={bitcoinContractOfferDetails.simplifiedBitcoinContract}
          />
          <Stack alignItems="flex-end" width="100%">
            <LeatherButton
              variant="link"
              onClick={() => setShowTransactionDetails(!showTransactionDetails)}
            >
              {showTransactionDetails ? 'Hide Transaction Details' : 'Show Transaction Details'}
            </LeatherButton>
          </Stack>
          {showTransactionDetails && (
            <InfoCard mt="loose">
              <Stack
                width="100%"
                padding="24px"
                backgroundColor={token('colors.accent.background-secondary')}
              >
                <InfoCardRow
                  title="To"
                  value={
                    <FormAddressDisplayer
                      address={
                        bitcoinContractOfferDetails.counterpartyWalletDetails
                          .counterpartyWalletAddress
                      }
                    />
                  }
                />
                <InfoCardSeparator />
                <InfoCardRow
                  title="Total spend"
                  value={`${
                    bitcoinContractOfferDetails.simplifiedBitcoinContract
                      .bitcoinContractCollateralAmount +
                    bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinContractGasFee
                  } sats`}
                />
                <InfoCardRow
                  title="Fee"
                  value={`${bitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinContractGasFee} sats`}
                />
                <InfoCardRow
                  title="Expiration Date"
                  value={
                    bitcoinContractOfferDetails.simplifiedBitcoinContract
                      .bitcoinContractExpirationDate
                  }
                />
              </Stack>
            </InfoCard>
          )}
        </BitcoinContractRequestLayout>
    </>
  );
}
