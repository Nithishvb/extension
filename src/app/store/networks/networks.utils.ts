import { Dictionary } from '@reduxjs/toolkit';
import { ChainID } from '@stacks/transactions';

import {
  BITCOIN_API_BASE_URL_MAINNET,
  BITCOIN_API_BASE_URL_TESTNET,
  HIRO_API_BASE_URL_TESTNET,
  NetworkConfiguration,
} from '@shared/constants';

import { whenStacksChainId } from '@app/common/utils';

import { PersistedNetworkConfiguration } from './networks.slice';

interface FindMatchingNetworkKeyArgs {
  coreApiUrl: string | null;
  networkChainId: string | null;
  networks: Dictionary<NetworkConfiguration>;
}
export function findMatchingNetworkKey({
  coreApiUrl,
  networkChainId,
  networks,
}: FindMatchingNetworkKeyArgs) {
  if (!networks || (!coreApiUrl && !networkChainId)) return;

  const keys = Object.keys(networks);

  const exactUrlMatch = keys.find((key: string) => {
    const network = networks[key] as NetworkConfiguration;
    return network.chain.stacks.url === coreApiUrl;
  });
  if (exactUrlMatch) return exactUrlMatch;

  const chainIdMatch = keys.find((key: string) => {
    const network = networks[key] as NetworkConfiguration;
    return (
      network.chain.stacks.url === coreApiUrl ||
      network.chain.stacks.chainId === (Number(networkChainId) as ChainID)
    );
  });
  if (chainIdMatch) return chainIdMatch;

  return null;
}

export function transformNetworkStateToMultichainStucture(
  state: Dictionary<PersistedNetworkConfiguration>
) {
  return Object.fromEntries(
    Object.entries(state)
      .map(([key, network]) => {
        if (!network) return ['', null];
        const { id, name, chainId, subnetChainId, url } = network;

        const { stacksChainId, stacksUrl, bitcoinNetwork, bitcoinUrl } = getChainData(
          id,
          chainId,
          url
        );

        return [
          key,
          {
            id,
            name,
            chain: {
              stacks: {
                blockchain: 'stacks',
                url: stacksUrl,
                chainId: stacksChainId,
                subnetChainId,
              },
              bitcoin: {
                blockchain: 'bitcoin',
                network: bitcoinNetwork,
                url: bitcoinUrl,
              },
            },
          },
        ];
      })
      .filter(([_, value]) => value !== null)
  ) as Record<string, NetworkConfiguration>;
}
function getChainData(
  id: string,
  chainId: ChainID,
  url: string
): { stacksChainId: any; stacksUrl: any; bitcoinNetwork: any; bitcoinUrl: any } {
  console.log('getChainData', id, chainId, url);
  return id === 'bitcoin-regtest'
    ? {
        stacksChainId: ChainID.Testnet,
        stacksUrl: HIRO_API_BASE_URL_TESTNET,
        bitcoinNetwork: 'regtest',
        bitcoinUrl: url,
      }
    : {
        stacksChainId: chainId,
        stacksUrl: url,
        bitcoinNetwork: ChainID[chainId]?.toLowerCase() || 'testnet',
        bitcoinUrl:
          whenStacksChainId(chainId)({
            [ChainID.Mainnet]: BITCOIN_API_BASE_URL_MAINNET,
            [ChainID.Testnet]: BITCOIN_API_BASE_URL_TESTNET,
          }) || BITCOIN_API_BASE_URL_TESTNET,
      };
}
