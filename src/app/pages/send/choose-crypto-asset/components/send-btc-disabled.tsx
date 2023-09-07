import { FiExternalLink } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Box, Stack, styled } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { GenericError } from '@app/components/generic-error/generic-error';

const body = 'Sending bitcoin is temporarily disabled';
const helpTextList = [
  <styled.li mt="space.04" key={1}>
    <Stack alignItems="center" isInline>
      <styled.span>Learm more on Twitter at @LeatherBTC</styled.span>
      <Box as="button" onClick={() => openInNewTab('https://twitter.com/leatherbtc')}>
        <FiExternalLink />
      </Box>
    </Stack>
  </styled.li>,
];
const title = 'Temporarily disabled';

export function SendBtcDisabled() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" px={['unset', 'loose']} py="space.04" width="100%">
      <GenericError
        body={body}
        helpTextList={helpTextList}
        onClose={() => navigate(RouteUrls.SendCryptoAsset)}
        title={title}
      />
    </Box>
  );
}
