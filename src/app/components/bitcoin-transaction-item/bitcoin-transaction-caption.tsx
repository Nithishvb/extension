import { styled } from 'leather-styles/jsx';

interface BitcoinTransactionCaptionProps {
  children: string;
}
export function BitcoinTransactionCaption({ children }: BitcoinTransactionCaptionProps) {
  return (
    <styled.span color={token('colors.accent.text-subdued')} fontSize={0} whiteSpace="nowrap">
      {children}
    </styled.span>
  );
}
