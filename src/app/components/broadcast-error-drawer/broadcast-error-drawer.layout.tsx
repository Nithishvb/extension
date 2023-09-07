import GenericError from '@assets/images/generic-error.png';
import { Box, Button, Flex } from 'leather-styles/jsx';

import { BaseDrawer } from '@app/components/drawer/base-drawer';

import { Body, Title } from '../typography';

interface BroadcastErrorDrawerLayoutProps {
  message: string;
  onClose(): void;
}
export function BroadcastErrorDrawerLayout({ message, onClose }: BroadcastErrorDrawerLayoutProps) {
  return (
    <BaseDrawer icon={<></>} isShowing onClose={onClose} textAlign="center">
      <Flex
        flexDirection="column"
        justifyContent="center"
        mx="space.06"
        mb="space.02"
        position="relative"
        top="-24px"
      >
        <img src={GenericError} width="106px" height="72px" m="0 auto" />
        <Title mt="base-loose">Unable to broadcast transaction</Title>
        <Body mt="base-tight" px="space.04">
          Your transaction failed to broadcast{' '}
          {message && <>because of the error: {message.toLowerCase()}</>}
        </Body>
        <Button alignSelf="center" mt="space.05" mode="tertiary" onClick={onClose}>
          Close
        </Button>
      </Flex>
    </BaseDrawer>
  );
}
