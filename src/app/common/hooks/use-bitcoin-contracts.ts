import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RpcErrorCode } from '@btckit/types';
import { bytesToHex, hexToBytes } from '@stacks/common';
import { JsDLCInterface } from 'dlc-tools';

import {
  BtcSignerNetwork,
  getBtcSignerLibNetworkConfigByMode,
} from '@shared/crypto/bitcoin/bitcoin.network';
import {
  deriveAddressIndexKeychainFromAccount,
  extractAddressIndexFromPath,
  getAddressFromOutScript,
} from '@shared/crypto/bitcoin/bitcoin.utils';
import { Currencies } from '@shared/models/currencies.model';
import { Money, createMoney } from '@shared/models/money.model';
import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';
import { RouteUrls } from '@shared/route-urls';
import { BitcoinContractResponseStatus } from '@shared/rpc/methods/accept-bitcoin-contract';
import { makeRpcErrorResponse, makeRpcSuccessResponse } from '@shared/rpc/rpc-methods';

import { BitcoinClient } from '@app/query/bitcoin/bitcoin-client';
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
import { useDefaultRequestParams } from './use-default-request-search-params';

export interface SimplifiedBitcoinContract {
  bitcoinContractId: string;
  bitcoinContractCollateralAmount: number;
  bitcoinContractExpirationDate: string;
  bitcoinTransactionDetails: BitcoinContractTransactionDetails;
}

export interface BitcoinContractOfferDetails {
  simplifiedBitcoinContract: SimplifiedBitcoinContract;
  counterpartyWalletDetails: CounterpartyWalletDetails;
}
interface CounterpartyWalletDetails {
  counterpartyWalletURL: string;
  counterpartyWalletName: string;
  counterpartyWalletIcon: string;
}

export interface BitcoinContractListItem {
  id: string;
  state: string;
  acceptorCollateral: string;
  txId: string;
}

export interface RawBitcoinContractTransaction {
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
}

export interface BitcoinContractInput {
  txId: string;
  address: string;
  value: number;
}

export interface BitcoinContractOutput {
  address: string;
  value: number;
}

interface BitcoinContractTransactionDetails {
  inputs: BitcoinContractInput[];
  outputs: BitcoinContractOutput[];
  fee: number;
  rawTx: RawBitcoinContractTransaction;
}

interface BitcoinContractTransactionSummaryDetails {
  txId: string;
  txMoney: Money;
  txFiatValue: Money;
  txFiatValueSymbol: Currencies;
  symbol: string;
  txLink: {
    blockchain: string;
    txId: string;
  };
}

async function getTxInputDetails(bitcoinClient: BitcoinClient, txId: string, outputIndex: number) {
  const bitcoinTransaction: BitcoinTx =
    await bitcoinClient.transactionsApi.getBitcoinTransaction(txId);
  const bitcoinTransactionVout = bitcoinTransaction.vout[outputIndex];
  const { scriptpubkey_address: bitcoinAddress, value: inputAmount } = bitcoinTransactionVout;
  return { bitcoinAddress, inputAmount };
}

async function getBitcoinTransactionDetails(
  fundingTx: RawBitcoinContractTransaction,
  bitcoinNetworkConfig: BtcSignerNetwork,
  bitcoinClient: BitcoinClient
): Promise<BitcoinContractTransactionDetails> {
  const { input: inputs, output: outputs } = fundingTx;

  const inputPromises = inputs.map(async input => {
    const [txId, outputIndex] = input.previous_output.split(':');
    const { bitcoinAddress, inputAmount } = await getTxInputDetails(
      bitcoinClient,
      txId,
      parseInt(outputIndex)
    );
    return { txId, address: bitcoinAddress, value: inputAmount };
  });

  const outputPromises = outputs.map(async output => {
    const { value: outputAmount, script_pubkey: outputScriptPubkey } = output;
    const outputAddress = getAddressFromOutScript(
      hexToBytes(outputScriptPubkey),
      bitcoinNetworkConfig
    );
    return { address: outputAddress, value: outputAmount };
  });

  const [inputsDetails, outputsDetails] = await Promise.all([
    Promise.all(inputPromises),
    Promise.all(outputPromises),
  ]);

  const inputValueSum = inputsDetails.reduce((sum, input) => sum + input.value, 0);
  const outputValueSum = outputsDetails.reduce((sum, output) => sum + output.value, 0);

  const fee = inputValueSum - outputValueSum;

  return {
    inputs: inputsDetails,
    outputs: outputsDetails,
    fee: fee,
    rawTx: fundingTx,
  };
}

export function useBitcoinContracts() {
  const navigate = useNavigate();
  const defaultParams = useDefaultRequestParams();

  const bitcoinClient = useBitcoinClient();

  const bitcoinMarketData = useCryptoCurrencyMarketData('BTC');
  const calculateBitcoinFiatValue = useCalculateBitcoinFiatValue();

  const bitcoinAccountDetails = useCurrentAccountNativeSegwitIndexZeroSigner();
  const bitcoinAccountCurrentIndex = useCurrentAccountIndex();
  const bitcoinAccountPrivateKeychain = useNativeSegwitAccountBuilder()?.(
    bitcoinAccountCurrentIndex
  );

  const currentBitcoinNetwork = useCurrentNetwork();
  const currentBitcoinNetworkConfig = getBtcSignerLibNetworkConfigByMode(
    currentBitcoinNetwork.chain.bitcoin.network
  );

  const [counterpartyWalletDetails, setCounterpartyWalletDetails] =
    useState<CounterpartyWalletDetails>();

  const [bitcoinContractCollateralAmount, setBitcoinContractCollateralAmount] = useState(0);
  const [acceptedBitcoinContract, setAcceptedBitcoinContract] = useState<any>();

  async function getBitcoinContractInterface(): Promise<JsDLCInterface> {
    if (!bitcoinAccountPrivateKeychain || !bitcoinAccountDetails) {
      throw new Error('Unable to get Bitcoin Contract Interface');
    }

    const currentAddress = bitcoinAccountDetails.address;
    const currentAccountIndex = extractAddressIndexFromPath(bitcoinAccountDetails.derivationPath);

    const currentAddressPrivateKey = deriveAddressIndexKeychainFromAccount(
      bitcoinAccountPrivateKeychain.keychain
    )(currentAccountIndex).privateKey;

    if (!currentAddressPrivateKey) {
      throw new Error('Unable to get Bitcoin Contract Interface');
    }

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
  ): Promise<BitcoinContractOfferDetails | void> {
    const bitcoinContractOffer = JSON.parse(bitcoinContractOfferJSON);
    const counterpartyWalletDetails = JSON.parse(counterpartyWalletDetailsJSON);

    const bitcoinContractId = bitcoinContractOffer.temporaryContractId;
    const bitcoinContractCollateralAmount =
      bitcoinContractOffer.contractInfo.singleContractInfo.totalCollateral;
    const bitcoinContractExpirationDate = new Date(
      bitcoinContractOffer.cetLocktime * 1000
    ).toLocaleDateString();

    try {
      const bitcoinContractInterface = await getBitcoinContractInterface();

      await bitcoinContractInterface.get_wallet_balance();

      const acceptedBitcoinContractJSON =
        await bitcoinContractInterface.accept_offer(bitcoinContractOfferJSON);
      console.log('acceptedBitcoinContractJSON', acceptedBitcoinContractJSON);
      const acceptedBitcoinContract = JSON.parse(acceptedBitcoinContractJSON);

      const bitcoinTransactionDetails = await getBitcoinTransactionDetails(
        acceptedBitcoinContract.fundingTX,
        currentBitcoinNetworkConfig,
        bitcoinClient
      );

      setBitcoinContractCollateralAmount(bitcoinContractCollateralAmount);
      setCounterpartyWalletDetails(counterpartyWalletDetails);
      setAcceptedBitcoinContract(acceptedBitcoinContract);

      const simplifiedBitcoinContractOffer: SimplifiedBitcoinContract = {
        bitcoinContractId,
        bitcoinContractCollateralAmount,
        bitcoinContractExpirationDate,
        bitcoinTransactionDetails,
      };

      const bitcoinContractOfferDetails: BitcoinContractOfferDetails = {
        simplifiedBitcoinContract: simplifiedBitcoinContractOffer,
        counterpartyWalletDetails,
      };

      return bitcoinContractOfferDetails;
    } catch (error) {
      navigate(RouteUrls.BitcoinContractLockError, {
        state: {
          error,
          title: 'There was an error with your Bitcoin Contract',
          body: 'Unable to lock bitcoin',
        },
      });
      sendRpcResponse(BitcoinContractResponseStatus.INTERFACE_ERROR);
    }
  }

  async function handleSigning() {
    try {
      if (!counterpartyWalletDetails) {
        throw new Error('Unable to get counterparty wallet details');
      }

      const bitcoinContractInterface = await getBitcoinContractInterface();
      const acceptMessageJSON = JSON.stringify(acceptedBitcoinContract.acceptMessage);
      const signedBitcoinContract = await sendAcceptedBitcoinContractOfferToProtocolWallet(
        acceptMessageJSON,
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
    try {
      const bitcoinContractInterface = await getBitcoinContractInterface();

      const bitcoinContracts = await bitcoinContractInterface.get_contracts();
      const signedBitcoinContracts = bitcoinContracts.filter(
        (bitcoinContract: BitcoinContractListItem) => bitcoinContract.state === 'Signed'
      );
      return signedBitcoinContracts;
    } catch (error) {
      navigate(RouteUrls.BitcoinContractLockError, {
        state: {
          error,
          title: 'There was an error with your Bitcoin Contract',
          body: 'Unable to get signed bitcoin contracts',
        },
      });
      sendRpcResponse(BitcoinContractResponseStatus.INTERFACE_ERROR);
    }
  }

  function getTransactionDetails(
    txId: string,
    bitcoinCollateral: number
  ): BitcoinContractTransactionSummaryDetails {
    const txMoney = createMoney(bitcoinCollateral, 'BTC');
    const txFiatValue = calculateBitcoinFiatValue(txMoney);
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
    const bitcoinContracts = await getAllSignedBitcoinContracts();

    const bitcoinContractsCollateralSum = bitcoinContracts.reduce(
      (sum: number, bitcoinContract: BitcoinContractListItem) =>
        sum + parseInt(bitcoinContract.acceptorCollateral),
      0
    );
    const bitcoinContractCollateralSumMoney = createMoney(bitcoinContractsCollateralSum, 'BTC');
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
