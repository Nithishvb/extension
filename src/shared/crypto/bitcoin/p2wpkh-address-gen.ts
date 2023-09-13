import { HDKey } from '@scure/bip32';
import * as btc from '@scure/btc-signer';

import { BitcoinNetworkModes, NetworkModes } from '@shared/constants';

import { DerivationPathDepth } from '../derivation-path.utils';
import { getBtcSignerLibNetworkConfigByMode } from './bitcoin.network';
import {
  BitcoinAccount,
  deriveAddressIndexZeroFromAccount,
  getBitcoinCoinTypeIndexByNetwork,
} from './bitcoin.utils';

export function getNativeSegwitAccountDerivationPath(
  network: BitcoinNetworkModes,
  accountIndex: number
) {
  return `m/84'/${getBitcoinCoinTypeIndexByNetwork(network)}'/${accountIndex}'`;
}

export function getNativeSegwitAddressIndexDerivationPath(
  network: BitcoinNetworkModes,
  accountIndex: number,
  addressIndex: number
) {
  return getNativeSegwitAccountDerivationPath(network, accountIndex) + `/0/${addressIndex}`;
}

export function deriveNativeSegwitAccountFromRootKeychain(keychain: HDKey, network: BitcoinNetworkModes) {
  console.log('deriveNativeSegwitAccountFromRootKeychain')
  console.log('keychain', keychain)
  console.log('network', network)

  if (keychain.depth !== DerivationPathDepth.Root) throw new Error('Keychain passed is not a root');
  return (accountIndex: number): BitcoinAccount => {
    console.log('accountIndex:', accountIndex);
    const derivationPath = getNativeSegwitAccountDerivationPath(network, accountIndex);
    console.log('derivationPath:', derivationPath);
    const derivedKeychain = keychain.derive(derivationPath);
    console.log('derivedKeychain:', derivedKeychain);
    return {
      type: 'p2wpkh',
      network,
      accountIndex,
      derivationPath,
      keychain: derivedKeychain,
    };
  };
}

export function getNativeSegWitPaymentFromAddressIndex(
  keychain: HDKey,
  network: BitcoinNetworkModes
) {
  if (keychain.depth !== DerivationPathDepth.AddressIndex)
    throw new Error('Keychain passed is not an address index');

  if (!keychain.publicKey) throw new Error('Keychain does not have a public key');

  return btc.p2wpkh(keychain.publicKey, getBtcSignerLibNetworkConfigByMode(network));
}

interface DeriveNativeSegWitReceiveAddressIndexArgs {
  xpub: string;
  network: BitcoinNetworkModes;
}
export function deriveNativeSegWitReceiveAddressIndex({
  xpub,
  network,
}: DeriveNativeSegWitReceiveAddressIndexArgs) {
  if (!xpub) return;
  const keychain = HDKey.fromExtendedKey(xpub);
  if (!keychain) return;
  const zeroAddressIndex = deriveAddressIndexZeroFromAccount(keychain);
  return getNativeSegWitPaymentFromAddressIndex(zeroAddressIndex, network);
}
