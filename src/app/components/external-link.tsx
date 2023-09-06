import React from 'react';

import { BoxProps } from 'leather-styles/jsx';

interface ExternalLinkProps extends BoxProps {
  href: string;
  children: React.ReactNode;
}
export function ExternalLink(props: ExternalLinkProps) {
  return (
    <styled.span as="a" color={color('accent')} target="_blank" {...props}>
      {props.children}
    </styled.span>
  );
}
