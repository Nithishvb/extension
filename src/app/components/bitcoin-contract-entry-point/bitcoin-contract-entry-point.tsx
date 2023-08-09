import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

import { Money, createMoneyFromDecimal } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useBitcoinContracts } from '@app/common/hooks/use-bitcoin-contracts';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';

import { BitcoinContractIcon } from '../icons/bitcoin-contract-icon';
import { BitcoinContractEntryPointLayout } from './bitcoin-contract-entry-point-layout';

export const BitcoinContractEntryPoint = forwardRefWithAs(() => {
  const navigate = useNavigate();
  const { sumBitcoinContractCollateralAmounts } = useBitcoinContracts();
  const [isLoading, setIsLoading] = useState(true);
  const calculateFiatValue = useCalculateBitcoinFiatValue();
  const [bitcoinContractSum, setBitcoinContractSum] = useState<Money>(
    createMoneyFromDecimal(0, 'BTC')
  );

  useOnMount(async () => {
    const currentBitcoinContractSum = await sumBitcoinContractCollateralAmounts();
    setBitcoinContractSum(currentBitcoinContractSum);
    setIsLoading(false);
  });

  function onClick() {
    navigate(RouteUrls.BitcoinContractList);
  }

  return (
    <BitcoinContractEntryPointLayout
      isLoading={isLoading}
      cursor={'pointer'}
      balance={bitcoinContractSum}
      caption={bitcoinContractSum.symbol}
      icon={<Box as={BitcoinContractIcon} />}
      usdBalance={i18nFormatCurrency(calculateFiatValue(bitcoinContractSum))}
      onClick={onClick}
    />
  );
});
