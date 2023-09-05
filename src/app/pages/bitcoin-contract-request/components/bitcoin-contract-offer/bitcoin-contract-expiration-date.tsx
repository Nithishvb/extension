import { Flex } from 'leather-styles/jsx';

import { Text } from '@app/components/typography';

interface BitcoinContractExpirationDateProps {
  expirationDate: string;
}
export function BitcoinContractExpirationDate({
  expirationDate,
}: BitcoinContractExpirationDateProps) {
  return (
    <Flex p="loose" gap="loose" width="100%" justifyContent="space-between">
      <Text fontSize={2} fontWeight="bold">
        Expiration Date
      </Text>
      <Text fontSize={2}>{expirationDate}</Text>
    </Flex>
  );
}
