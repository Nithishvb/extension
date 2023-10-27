import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

import { BitcoinContractSigner } from './bitcoin-contract-signer';

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
      return;
    }

    if (!bitcoinContractOfferJSON || !counterpartyWalletDetailsJSON) return;

    const handleBitcoinContractOffer = async () => {
      const currentBitcoinContractOfferDetails = await handleOffer(
        bitcoinContractOfferJSON,
        counterpartyWalletDetailsJSON
      );
      if (!currentBitcoinContractOfferDetails) return;

      const collateralAmount =
        currentBitcoinContractOfferDetails.simplifiedBitcoinContract
          .bitcoinContractCollateralAmount;
      const fee =
        currentBitcoinContractOfferDetails.simplifiedBitcoinContract.bitcoinTransactionDetails.fee;
      const totalAmount = collateralAmount + fee;

      setCanAccept(btcAvailableAssetBalance.balance.amount.isGreaterThan(totalAmount));
      setBitcoinContractOfferDetails(currentBitcoinContractOfferDetails);
    };
    handleBitcoinContractOffer();
  });

  if (!bitcoinContractOfferDetails) return <LoadingSpinner height="600px" />;

  const handleSignClick = async () => {
    setProcessing(true);
    await handleSigning();
    setProcessing(false);
  };

  const handleRejectClick = () => {
    if (!bitcoinContractOfferDetails) return;
    handleReject();
  };

  return (
    <BitcoinContractSigner
      bitcoinAddress={bitcoinAddress}
      bitcoinContractOfferDetails={bitcoinContractOfferDetails}
      isProcessing={isProcessing}
      canAccept={canAccept}
      handleRejectClick={handleRejectClick}
      handleSignClick={handleSignClick}
    />
  );
}
