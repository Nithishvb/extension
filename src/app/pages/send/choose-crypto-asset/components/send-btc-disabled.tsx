import { FiExternalLink } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Box, HStack, styled } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { GenericError } from '@app/components/generic-error/generic-error';

const body = 'Sending bitcoin is temporarily disabled';
const helpTextList = [
  <styled.li mt="space.04" key={1}>
    <HStack alignItems="center">
      <styled.span>Learm more on Twitter at @LeatherBTC</styled.span>
      <styled.button onClick={() => openInNewTab('https://twitter.com/leatherbtc')}>
        <FiExternalLink />
      </styled.button>
    </HStack>
  </styled.li>,
];
const title = 'Temporarily disabled';

export function SendBtcDisabled() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" px={['unset', 'space.05']} py="space.04" width="100%">
      <GenericError
        body={body}
        helpTextList={helpTextList}
        onClose={() => navigate(RouteUrls.SendCryptoAsset)}
        title={title}
      />
    </Box>
  );
}
