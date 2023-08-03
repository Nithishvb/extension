import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';
import { AllowAdditionaProperties } from '@btckit/types/dist/types/utils';

interface BitcoinContractResponseParams extends AllowAdditionaProperties {
  bitcoinContractOffer: string;
  attestorURLs: string;
  counterpartyWalletDetails: string;
}

interface BitcoinContractResponseBody extends AllowAdditionaProperties {
  contractId: string;
  action: string;
  txId?: string;
  error?: string;
}

export type BitcoinContractRequest = RpcRequest<
  'acceptBitcoinContractOffer',
  BitcoinContractResponseParams
>;
type BitcoinContractResponse = RpcResponse<BitcoinContractResponseBody>;
export type AcceptBitcoinContract = DefineRpcMethod<
  BitcoinContractRequest,
  BitcoinContractResponse
>;
