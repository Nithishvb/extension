import { Stack } from 'leather-styles/jsx';

interface BitcoinContractRequestLayoutProps {
  children: React.ReactNode;
}
export function BitcoinContractRequestLayout({ children }: BitcoinContractRequestLayoutProps) {
  return (
    <Stack
      alignItems="center"
      maxHeight="calc(100vh - 72px)"
      overflowY="auto"
      pb="120px"
      px="loose"
      gap="base-loose"
      width="100%"
    >
      {children}
    </Stack>
  );
}
