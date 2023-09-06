import { Text } from 'leather-styles/jsx';

interface BitcoinTransactionCaptionProps {
  children: string;
}
export function BitcoinTransactionCaption({ children }: BitcoinTransactionCaptionProps) {
  return (
    <Text color={token('colors.accent.text-subdued')} fontSize={0} whiteSpace="nowrap">
      {children}
    </Text>
  );
}
