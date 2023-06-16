import { DefineRpcMethod, RpcRequest, RpcResponse } from '@btckit/types';
import { AllowAdditionaProperties } from '@btckit/types/dist/types/utils';

export interface HandleBitcoinContractResponseParams extends AllowAdditionaProperties {
  bitcoinContractOffer: string;
  counterpartyWalletURL: string;
  counterpartyWalletName: string;
  counterpartyWalletIcon: string;
}

export interface HandleBitcoinContractResponseBody extends AllowAdditionaProperties {
  id: string;
  contractID: string;
  action: string;
  txID?: string;
  error?: string;
}

export type HandleBitcoinContractRequest = RpcRequest<
  'acceptOffer',
  HandleBitcoinContractResponseParams
>;
export type HandleBitcoinContractResponse = RpcResponse<HandleBitcoinContractResponseBody>;
export type HandleBitcoinContractMethod = DefineRpcMethod<
  HandleBitcoinContractRequest,
  HandleBitcoinContractResponse
>;
