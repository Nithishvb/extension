import { Stack } from 'leather-styles/jsx';

import { PageTop } from './page-top';

interface ProfileUpdateRequestLayoutProps {
  children: React.ReactNode;
}
export function ProfileUpdateRequestLayout({ children }: ProfileUpdateRequestLayoutProps) {
  return (
    <Stack px={['loose', 'unset']} gap="space.05" width="100%">
      <PageTop />
      {children}
    </Stack>
  );
}
