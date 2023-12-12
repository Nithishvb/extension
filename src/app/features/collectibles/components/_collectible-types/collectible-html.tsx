import { ReactNode, useState } from 'react';

import { IFrame } from '@app/ui/components/i-frame';

import { CollectibleItemLayout, CollectibleItemLayoutProps } from '../collectible-item.layout';
import { ImageUnavailable } from '../image-unavailable';

interface CollectibleIFrameProps extends Omit<CollectibleItemLayoutProps, 'children'> {
  icon: ReactNode;
  src: string;
}
export function CollectibleIFrame({ icon, src, ...props }: CollectibleIFrameProps) {
  const [isError, setIsError] = useState(false);

  if (isError)
    return (
      <CollectibleItemLayout collectibleTypeIcon={icon} {...props}>
        <ImageUnavailable />
      </CollectibleItemLayout>
    );

  return (
    <CollectibleItemLayout collectibleTypeIcon={icon} {...props}>
      <IFrame
        onError={() => setIsError(true)}
        src={src}
        style={{
          aspectRatio: '1 / 1',
          height: '100%',
          objectFit: 'cover',
          overflow: 'hidden',
          // pointerEvents: 'none',
          // userSelect: 'none',
          width: '200px',
          zIndex: 99,
        }}
      />
    </CollectibleItemLayout>
  );
}
