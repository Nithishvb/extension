import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RpcErrorCode } from '@btckit/types';
import { bytesToHex } from '@stacks/common';
import { JsDLCInterface } from 'dlc-tools';

import {
  deriveAddressIndexKeychainFromAccount,
  extractAddressIndexFromPath,
} from '@shared/crypto/bitcoin/bitcoin.utils';
import { Money, createMoneyFromDecimal } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { BitcoinContractResponseStatus } from '@shared/rpc/methods/accept-bitcoin-contract';
import { makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';
import { makeRpcErrorResponse } from '@shared/rpc/rpc-methods';

import { fetchBitcoinContractCounterpartyAddress } from '@app/query/bitcoin/contract/fetch-bitcoin-contract-counterparty-address';
import { sendAcceptedBitcoinContractOfferToProtocolWallet } from '@app/query/bitcoin/contract/send-accepted-bitcoin-contract-offer';
import {
  useCalculateBitcoinFiatValue,
  useCryptoCurrencyMarketData,
} from '@app/query/common/market-data/market-data.hooks';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import {
  useCurrentAccountNativeSegwitIndexZeroSigner,
  useNativeSegwitAccountBuilder,
} from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useBitcoinClient } from '@app/store/common/api-clients.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { initialSearchParams } from '../initial-search-params';
import { i18nFormatCurrency } from '../money/format-money';
import { satToBtc } from '../money/unit-conversion';
import { useDefaultRequestParams } from './use-default-request-search-params';

export interface SimplifiedBitcoinContract {
  bitcoinContractId: string;
  bitcoinContractCollateralAmount: number;
  bitcoinContractGasFee: number;
  bitcoinContractExpirationDate: string;
}

interface CounterpartyWalletDetails {
  counterpartyWalletURL: string;
  counterpartyWalletName: string;
  counterpartyWalletIcon: string;
  counterpartyWalletAddress?: string;
}

export interface BitcoinContractListItem {
  id: string;
  state: string;
  acceptorCollateral: string;
  txId: string;
}

export interface BitcoinContractOfferDetails {
  simplifiedBitcoinContract: SimplifiedBitcoinContract;
  counterpartyWalletDetails: CounterpartyWalletDetails;
}

type BitcoinTransaction = {
  input: {
    previous_output: string;
    script_sig: string;
    sequence: number;
    witness: any[];
  }[];
  lock_time: number;
  output: {
    script_pubkey: string;
    value: number;
  }[];
  version: number;
};

export function useBitcoinContracts() {
  const navigate = useNavigate();
  const defaultParams = useDefaultRequestParams();
  const bitcoinMarketData = useCryptoCurrencyMarketData('BTC');
  const calculateFiatValue = useCalculateBitcoinFiatValue();
  const bitcoinAccountDetails = useCurrentAccountNativeSegwitIndexZeroSigner();
  const currentIndex = useCurrentAccountIndex();
  const nativeSegwitPrivateKeychain = useNativeSegwitAccountBuilder()?.(currentIndex);
  const currentBitcoinNetwork = useCurrentNetwork();
  const bitcoinClient = useBitcoinClient();
  const [bitcoinContractCollateralAmount, setBitcoinContractCollateralAmount] = useState(0);
  const [acceptedBitcoinContract, setAcceptedBitcoinContract] = useState<any>();
  const [counterpartyWalletDetails, setCounterpartyWalletDetails] = useState<any>();

  async function calculateFee(fundingTX: BitcoinTransaction) {
    const inputs = fundingTX.input;
    const outputs = fundingTX.output;

    let outputAmount = 0;
    let inputAmount = 0;

    for (const input of inputs) {
      const [txId, outputIndex] = input.previous_output.split(':');
      const txDetails = await bitcoinClient.transactionsApi.getBitcoinTransaction(txId);
      inputAmount += parseInt(txDetails.vout[parseInt(outputIndex)].value);
    }

    for (const output of outputs) {
      outputAmount += output.value;
    }

    const fee = inputAmount - outputAmount;

    return fee;
  }

  async function getBitcoinContractInterface(): Promise<JsDLCInterface | undefined> {
    if (!nativeSegwitPrivateKeychain || !bitcoinAccountDetails) return;

    const currentAddress = bitcoinAccountDetails.address;
    const currentAccountIndex = extractAddressIndexFromPath(bitcoinAccountDetails.derivationPath);

    const currentAddressPrivateKey = deriveAddressIndexKeychainFromAccount(
      nativeSegwitPrivateKeychain.keychain
    )(currentAccountIndex).privateKey;

    if (!currentAddressPrivateKey) return;

    const bitcoinContractInterface = await JsDLCInterface.new(
      bytesToHex(currentAddressPrivateKey),
      currentAddress,
      currentBitcoinNetwork.chain.bitcoin.network,
      currentBitcoinNetwork.chain.bitcoin.url
    );

    return bitcoinContractInterface;
  }

  async function handleOffer(
    bitcoinContractOfferJSON: string,
    counterpartyWalletDetailsJSON: string
  ) {
    const bitcoinContractOffer = JSON.parse(bitcoinContractOfferJSON);
    const counterpartyWalletDetails = JSON.parse(counterpartyWalletDetailsJSON);

    const bitcoinContractId = bitcoinContractOffer.temporaryContractId;

    const bitcoinContractCounterpartyBitcoinAddress = await fetchBitcoinContractCounterpartyAddress(
      counterpartyWalletDetails.counterpartyWalletURL
    );
    counterpartyWalletDetails.counterpartyWalletAddress = bitcoinContractCounterpartyBitcoinAddress;

    const bitcoinContractCollateralAmount =
      bitcoinContractOffer.contractInfo.singleContractInfo.totalCollateral;

    let bitcoinContractGasFee = 0;

    const bitcoinContractExpirationDate = new Date(
      bitcoinContractOffer.cetLocktime * 1000
    ).toLocaleDateString();

    setBitcoinContractCollateralAmount(bitcoinContractCollateralAmount);
    setCounterpartyWalletDetails(counterpartyWalletDetails);

    let bitcoinContractInterface: JsDLCInterface | undefined;

    try {
      bitcoinContractInterface = await getBitcoinContractInterface();
    } catch (error) {
      navigate(RouteUrls.BitcoinContractLockError, {
        state: {
          error,
          title: 'There was an error with getting the Bitcoin Contract Interface',
          body: 'Unable to setup Bitcoin Contract Interface',
        },
      });
      sendRpcResponse(BitcoinContractResponseStatus.INTERFACE_ERROR);
    }

    if (!bitcoinContractInterface) return;

    try {
      await bitcoinContractInterface.get_wallet_balance();
      const acceptedBitcoinContractJSON =
        await bitcoinContractInterface.accept_offer(bitcoinContractOfferJSON);

      const acceptedBitcoinContract = JSON.parse(acceptedBitcoinContractJSON);

      bitcoinContractGasFee = await calculateFee(acceptedBitcoinContract.fundingTX);

      setAcceptedBitcoinContract(acceptedBitcoinContract);
    } catch (error) {
      navigate(RouteUrls.BitcoinContractLockError, {
        state: {
          error,
          title: 'There was an error with your Bitcoin Contract',
          body: 'Unable to lock bitcoin',
        },
      });
      sendRpcResponse(BitcoinContractResponseStatus.BROADCAST_ERROR);
    }

    const simplifiedBitcoinContractOffer: SimplifiedBitcoinContract = {
      bitcoinContractId,
      bitcoinContractCollateralAmount,
      bitcoinContractExpirationDate,
      bitcoinContractGasFee,
    };

    const bitcoinContractOfferDetails: BitcoinContractOfferDetails = {
      simplifiedBitcoinContract: simplifiedBitcoinContractOffer,
      counterpartyWalletDetails,
    };

    return bitcoinContractOfferDetails;
  }

  async function handleSigning() {
    let bitcoinContractInterface: JsDLCInterface | undefined;

    try {
      bitcoinContractInterface = await getBitcoinContractInterface();
    } catch (error) {
      navigate(RouteUrls.BitcoinContractLockError, {
        state: {
          error,
          title: 'There was an error with getting the Bitcoin Contract Interface',
          body: 'Unable to setup Bitcoin Contract Interface',
        },
      });
      sendRpcResponse(BitcoinContractResponseStatus.INTERFACE_ERROR);
    }

    if (!bitcoinContractInterface) return;

    try {
      const signedBitcoinContract = await sendAcceptedBitcoinContractOfferToProtocolWallet(
        JSON.stringify(acceptedBitcoinContract.acceptMessage),
        counterpartyWalletDetails.counterpartyWalletURL
      );

      const signedBitcoinContractJSON = JSON.stringify(signedBitcoinContract);

      const txId =
        await bitcoinContractInterface.countersign_and_broadcast(signedBitcoinContractJSON);

      const { txMoney, txFiatValue, txFiatValueSymbol, txLink, symbol } = getTransactionDetails(
        txId,
        bitcoinContractCollateralAmount
      );

      navigate(RouteUrls.BitcoinContractLockSuccess, {
        state: {
          txId,
          txMoney,
          txFiatValue,
          txFiatValueSymbol,
          symbol,
          txLink,
        },
      });

      sendRpcResponse(
        BitcoinContractResponseStatus.SUCCESS,
        signedBitcoinContract.contractId,
        txId
      );
    } catch (error) {
      navigate(RouteUrls.BitcoinContractLockError, {
        state: {
          error,
          title: 'There was an error with your Bitcoin Contract',
          body: 'Unable to lock bitcoin',
        },
      });
      sendRpcResponse(BitcoinContractResponseStatus.BROADCAST_ERROR);
    }
  }

  function handleReject() {
    sendRpcResponse(BitcoinContractResponseStatus.REJECTED);
    close();
  }

  async function getAllSignedBitcoinContracts() {
    let bitcoinContractInterface: JsDLCInterface | undefined;

    try {
      bitcoinContractInterface = await getBitcoinContractInterface();
    } catch (error) {
      navigate(RouteUrls.BitcoinContractLockError, {
        state: {
          error,
          title: 'There was an error with getting the Bitcoin Contract Interface',
          body: 'Unable to setup Bitcoin Contract Interface',
        },
      });
      sendRpcResponse(BitcoinContractResponseStatus.INTERFACE_ERROR);
    }

    if (!bitcoinContractInterface) return;

    const bitcoinContracts = await bitcoinContractInterface.get_contracts();
    const signedBitcoinContracts = bitcoinContracts.filter(
      (bitcoinContract: BitcoinContractListItem) => bitcoinContract.state === 'Signed'
    );

    return signedBitcoinContracts;
  }

  function getTransactionDetails(txId: string, bitcoinCollateral: number) {
    const bitcoinValue = satToBtc(bitcoinCollateral);
    const txMoney = createMoneyFromDecimal(bitcoinValue, 'BTC');
    const txFiatValue = i18nFormatCurrency(calculateFiatValue(txMoney)).toString();
    const txFiatValueSymbol = bitcoinMarketData.price.symbol;
    const txLink = { blockchain: 'bitcoin', txId };

    return {
      txId,
      txMoney,
      txFiatValue,
      txFiatValueSymbol,
      symbol: 'BTC',
      txLink,
    };
  }

  async function sumBitcoinContractCollateralAmounts(): Promise<Money> {
    let bitcoinContractsCollateralSum = 0;
    const bitcoinContracts = await getAllSignedBitcoinContracts();
    bitcoinContracts.forEach((bitcoinContract: BitcoinContractListItem) => {
      bitcoinContractsCollateralSum += parseInt(bitcoinContract.acceptorCollateral);
    });
    const bitcoinContractCollateralSumMoney = createMoneyFromDecimal(
      satToBtc(bitcoinContractsCollateralSum),
      'BTC'
    );
    return bitcoinContractCollateralSumMoney;
  }

  function sendRpcResponse(
    responseStatus: BitcoinContractResponseStatus,
    bitcoinContractId?: string,
    txId?: string
  ) {
    if (!defaultParams.tabId || !initialSearchParams.get('requestId')) return;

    const requestId = initialSearchParams.get('requestId') as string;
    let response;

    switch (responseStatus) {
      case BitcoinContractResponseStatus.REJECTED:
        response = makeRpcErrorResponse('acceptBitcoinContractOffer', {
          id: requestId,
          error: {
            code: RpcErrorCode.USER_REJECTION,
            message: responseStatus,
          },
        });
        break;

      case BitcoinContractResponseStatus.NETWORK_ERROR:
        response = makeRpcErrorResponse('acceptBitcoinContractOffer', {
          id: requestId,
          error: {
            code: RpcErrorCode.INVALID_REQUEST,
            message: responseStatus,
          },
        });
        break;

      case BitcoinContractResponseStatus.BROADCAST_ERROR:
      case BitcoinContractResponseStatus.INTERFACE_ERROR:
        response = makeRpcErrorResponse('acceptBitcoinContractOffer', {
          id: requestId,
          error: {
            code: RpcErrorCode.INTERNAL_ERROR,
            message: responseStatus,
          },
        });
        break;

      default:
        response = makeRpcSuccessResponse('acceptBitcoinContractOffer', {
          id: requestId,
          result: {
            contractId: bitcoinContractId,
            txId,
          },
        });
        break;
    }

    chrome.tabs.sendMessage(defaultParams.tabId, response);
  }

  return {
    handleOffer,
    handleSigning,
    handleReject,
    getAllSignedBitcoinContracts,
    sumBitcoinContractCollateralAmounts,
    sendRpcResponse,
  };
}
