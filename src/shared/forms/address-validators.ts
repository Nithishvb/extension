import { Network, validate } from 'bitcoin-address-validation';
import * as yup from 'yup';

import type { BitcoinNetworkModes } from '@leather.io/models';
import { isEmptyString, isUndefined } from '@leather.io/utils';

import { FormErrorMessages } from '@shared/error-messages';

export function btcAddressValidator() {
  return yup.string().test({
    message: FormErrorMessages.InvalidAddress,
    test(value) {
      if (isUndefined(value) || isEmptyString(value)) return true;
      return validate(value);
    },
  });
}

function btcAddressNetworkValidatorFactory(network: BitcoinNetworkModes) {
  function getAddressNetworkType(network: BitcoinNetworkModes): Network {
    // Signet uses testnet address format, this parsing is to please the
    // validation library
    if (network === 'signet') return Network.testnet;
    return network as Network;
  }

  return (value?: string) => {
    if (isUndefined(value) || isEmptyString(value)) return true;
    return validate(value, getAddressNetworkType(network));
  };
}

export function btcAddressNetworkValidator(network: BitcoinNetworkModes) {
  return yup.string().test({
    test: btcAddressNetworkValidatorFactory(network),
    message: FormErrorMessages.IncorrectNetworkAddress,
  });
}