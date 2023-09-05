import { Stack } from 'leather-styles/jsx';

interface BitcoinContractRequestLayoutProps {
  children: React.ReactNode;
}
export function BitcoinContractRequestLayout({ children }: BitcoinContractRequestLayoutProps) {
  return (
    <Stack
      alignItems="center"
      maxHeight="calc(100vh - 72px)"
      overflowY="scroll"
      pb="120px"
      px="loose"
      gap="tight"
      width="100%"
    >
      {children}
    </Stack>
  );
}
