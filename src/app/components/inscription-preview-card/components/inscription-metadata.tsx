import { Flex } from 'leather-styles/jsx';

import { Text } from '@app/components/typography';

interface InscriptionMetadataProps {
  action?(): void;
  actionLabel?: string;
  icon?: React.JSX.Element;
  subtitle: string;
  title: string;
}
export function InscriptionMetadata({
  action,
  actionLabel,
  icon,
  subtitle,
  title,
}: InscriptionMetadataProps) {
  return (
    <Flex alignItems="flex-start" flexDirection="column" justifyContent="center">
      {icon && icon}
      <styled.span fontSize={2} fontWeight="500">
        {title}
      </styled.span>
      <styled.span color={token('colors.accent.text-subdued')} fontSize={1}>
        {subtitle}
      </styled.span>
      {action ? (
        <styled.span
          _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
          as="button"
          color={color('accent')}
          fontSize={1}
          onClick={() => action()}
          type="button"
        >
          {actionLabel}
        </styled.span>
      ) : null}
    </Flex>
  );
}
