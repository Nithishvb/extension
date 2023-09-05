import React from 'react';

import { BoxProps, Text } from 'leather-styles/jsx';

interface ExternalLinkProps extends BoxProps {
  href: string;
  children: React.ReactNode;
}
export function ExternalLink(props: ExternalLinkProps) {
  return (
    <Text as="a" color={color('accent')} target="_blank" {...props}>
      {props.children}
    </Text>
  );
}
