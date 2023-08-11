import { useMemo } from 'react';

import * as btc from '@scure/btc-signer';
import { bytesToHex } from '@stacks/common';

import { getBtcSignerLibNetworkConfigByMode } from '@shared/crypto/bitcoin/bitcoin.network';
import { getBitcoinInputAddress, getBitcoinInputValue } from '@shared/crypto/bitcoin/bitcoin.utils';
import { isDefined, isUndefined } from '@shared/utils';

import { useOrdinalsAwareUtxoQueries } from '@app/query/bitcoin/ordinals/ordinals-aware-utxo.query';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountTaprootIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/taproot-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

export interface PsbtInput {
  address: string;
  index?: number;
  inscription?: string;
  isMutable: boolean;
  toSign: boolean;
  txid: string;
  value: number;
}

interface UseParsedInputsArgs {
  inputs: btc.TransactionInput[];
  indexesToSign?: number[];
}
export function useParsedInputs({ inputs, indexesToSign }: UseParsedInputsArgs) {
  const network = useCurrentNetwork();
  const bitcoinNetwork = getBtcSignerLibNetworkConfigByMode(network.chain.bitcoin.network);
  const bitcoinAddressNativeSegwit = useCurrentAccountNativeSegwitIndexZeroSigner().address;
  const { address: bitcoinAddressTaproot } = useCurrentAccountTaprootIndexZeroSigner();
  const utxosWithInscriptions = useOrdinalsAwareUtxoQueries(inputs).map(query => query.data);
  const signAll = isUndefined(indexesToSign);

  const psbtInputs = useMemo(
    () =>
      inputs.map((input, i) => {
        const inputAddress = isDefined(input.index)
          ? getBitcoinInputAddress(input.index, input, bitcoinNetwork)
          : '';
        const isCurrentAddress =
          inputAddress === bitcoinAddressNativeSegwit || inputAddress === bitcoinAddressTaproot;
        // Flags when not signing ALL inputs/outputs (NONE, SINGLE, and ANYONECANPAY)
        const canChange =
          isCurrentAddress &&
          !(!input.sighashType || input.sighashType === 0 || input.sighashType === 1);
        // Should we check the sighashType here before it gets to the signing lib?
        const toSignAll = isCurrentAddress && signAll;
        const toSignIndex = isCurrentAddress && !signAll && indexesToSign.includes(i);

        return {
          address: inputAddress,
          index: input.index,
          inscription: utxosWithInscriptions[i]?.inscriptions,
          isMutable: canChange,
          toSign: toSignAll || toSignIndex,
          txid: input.txid ? bytesToHex(input.txid) : '',
          value: isDefined(input.index) ? getBitcoinInputValue(input.index, input) : 0,
        };
      }),
    [
      bitcoinAddressNativeSegwit,
      bitcoinAddressTaproot,
      bitcoinNetwork,
      indexesToSign,
      inputs,
      signAll,
      utxosWithInscriptions,
    ]
  );

  const isPsbtMutable = useMemo(() => psbtInputs.some(input => input.isMutable), [psbtInputs]);

  return { isPsbtMutable, parsedInputs: psbtInputs };
}
