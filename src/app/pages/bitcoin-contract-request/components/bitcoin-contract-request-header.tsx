import { Flex, styled } from 'leather-styles/jsx';

import { Favicon } from '@app/components/favicon';
import { Flag } from '@app/components/layout/flag';

interface BitcoinContractRequestHeaderBaseProps {
  counterpartyWalletIcon: string;
  counterpartyWalletName: string;
}

export function BitcoinContractRequestHeader({
  counterpartyWalletName,
  counterpartyWalletIcon,
}: BitcoinContractRequestHeaderBaseProps) {
  const caption = `Requested by ${counterpartyWalletName}`;

  return (
    <Flex flexDirection="column" my="space.05" width="100%">
      <styled.h1 mb="space.04" textStyle="heading.03">
        Lock
        <br />
        Bitcoin
      </styled.h1>
      <styled.p mb="space.04" textStyle="label.01">
        By signing the contract YOU AGREE TO LOCK YOUR BITCOIN with {counterpartyWalletName} into a
        contract where it will remain until a triggering event will release it.
      </styled.p>
      {caption && (
        <Flag
          align="middle"
          img={<img src={counterpartyWalletIcon} height="32px" width="32px" />}
          pl="tight"
        >
          <styled.span textStyle="label.02" wordBreak="break-word">
            {caption}
          </styled.span>
        </Flag>
      )}
    </Flex>
  );
}
