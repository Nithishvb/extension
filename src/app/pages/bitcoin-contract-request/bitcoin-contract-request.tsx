import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Stack } from '@stacks/ui';
import { token } from 'leather-styles/tokens';

import { RouteUrls } from '@shared/route-urls';
import { BitcoinContractResponseStatus } from '@shared/rpc/methods/accept-bitcoin-contract';

import { useBitcoinContracts } from '@app/common/hooks/use-bitcoin-contracts';
import { BitcoinContractOfferDetails } from '@app/common/hooks/use-bitcoin-contracts';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { initialSearchParams } from '@app/common/initial-search-params';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import { InfoCard, InfoCardRow, InfoCardSeparator } from '@app/components/info-card/info-card';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { BitcoinContractOfferInput } from './components/bitcoin-contract-offer/bitcoin-contract-offer-input';
import { BitcoinContractRequestActions } from './components/bitcoin-contract-request-actions';
import { BitcoinContractRequestHeader } from './components/bitcoin-contract-request-header';
import { BitcoinContractRequestLayout } from './components/bitcoin-contract-request-layout';
import { BitcoinContractRequestWarningLabel } from './components/bitcoin-contract-request-warning-label';

export function BitcoinContractRequest() {
  const bitcoinAccountDetails = useCurrentAccountNativeSegwitSigner()?.(0);
  const currentBitcoinAddress = bitcoinAccountDetails?.address;
  const currentBitcoinNetwork = bitcoinAccountDetails?.network;
  const [requiredAmount, setRequiredAmount] = useState(0);

  const navigate = useNavigate();

  const { handleOffer, handleSigning, handleReject, sendRpcResponse } = useBitcoinContracts();

  const [bitcoinContractOfferDetails, setBitcoinContractOfferDetails] =
    useState<BitcoinContractOfferDetails>();

  const [isProcessing, setProcessing] = useState(false);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

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

    if (!bitcoinAccountDetails) return;

    if (currentBitcoinNetwork !== 'testnet') {
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

  return (
    <>
      {!bitcoinContractOfferDetails ||
      !currentBitcoinAddress ||
      !bitcoinContractOfferDetails.counterpartyWalletDetails.counterpartyWalletAddress ? (
        <FullPageLoadingSpinner />
      ) : (
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
            isLoading={isProcessing}
            bitcoinAddress={currentBitcoinAddress}
            requiredAmount={requiredAmount}
            onRejectBitcoinContractOffer={handleRejectClick}
            onAcceptBitcoinContractOffer={handleSignClick}
          />
          <BitcoinContractOfferInput
            addressNativeSegwit={currentBitcoinAddress}
            bitcoinContractOffer={bitcoinContractOfferDetails.simplifiedBitcoinContract}
          />
          <Stack alignItems="flex-end" width="100%">
            <Button
              variant="link"
              onClick={() => setShowTransactionDetails(!showTransactionDetails)}
            >
              {showTransactionDetails ? 'Hide Transaction Details' : 'Show Transaction Details'}
            </Button>
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
      )}
    </>
  );
}
