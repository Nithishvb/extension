import { FiArrowUpRight, FiCopy } from 'react-icons/fi';

// #4164 FIXME migrate useClipboard
import { useClipboard } from '@stacks/ui';
import { Box, Stack } from 'leather-styles/jsx';

import { BtcIcon } from '@app/components/icons/btc-icon';
import { Flag } from '@app/components/layout/flag';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';

interface BitcoinContractLockAmountProps {
  hoverLabel?: string;
  image?: JSX.Element;
  subtitle?: string;
  subValue?: string;
  subValueAction?(): void;
  title?: string;
  value: string;
}
export function BitcoinContractLockAmount({
  hoverLabel,
  image,
  subtitle,
  subValue,
  subValueAction,
  title,
  value,
}: BitcoinContractLockAmountProps) {
  const { onCopy, hasCopied } = useClipboard(hoverLabel ?? '');

  return (
    <Flag img={image || <BtcIcon />} align="middle" width="100%">
      <SpaceBetween>
        <styled.span fontSize={2} fontWeight="500">
          {title ? title : 'BTC'}
        </styled.span>
        <styled.span fontSize={2} fontWeight="500">
          {value}
        </styled.span>
      </SpaceBetween>
      <SpaceBetween mt="tight">
        {subtitle ? (
          <Tooltip
            disabled={!hoverLabel}
            hideOnClick={false}
            label={hasCopied ? 'Copied!' : hoverLabel}
            labelProps={{ wordWrap: 'break-word' }}
            maxWidth="230px"
            placement="bottom"
          >
            <Box
              _hover={{ cursor: 'pointer' }}
              as="button"
              color={token('colors.accent.text-subdued')}
              display="flex"
              onClick={onCopy}
              type="button"
            >
              <styled.span
                color={token('colors.accent.text-subdued')}
                fontSize={1}
                mr="extra-tight"
              >
                {subtitle}
              </styled.span>
              {hoverLabel ? <FiCopy size="14px" /> : null}
            </Box>
          </Tooltip>
        ) : null}
        {subValue ? (
          <Stack as="button" isInline onClick={subValueAction} spacing="extra-tight" type="button">
            <styled.span
              color={subValueAction ? color('accent') : token('colors.accent.text-subdued')}
              fontSize={1}
            >
              {subValue}
            </styled.span>
            {subValueAction ? <FiArrowUpRight color={color('accent')} /> : null}
          </Stack>
        ) : null}
      </SpaceBetween>
    </Flag>
  );
}
