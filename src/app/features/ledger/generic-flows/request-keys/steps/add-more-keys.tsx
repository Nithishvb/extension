import { useNavigate } from 'react-router-dom';

import { Button, ButtonGroup } from 'leather-styles/jsx';

import { Caption } from '@app/components/typography';
import { LedgerTitle } from '@app/features/ledger/components/ledger-title';
import { LedgerWrapper } from '@app/features/ledger/components/ledger-wrapper';

export function AddMoreKeysLayout() {
  const navigate = useNavigate();
  return (
    <LedgerWrapper mb="space.05">
      <LedgerTitle mx="50px">Add Bitcoin keys</LedgerTitle>
      <ButtonGroup mt="space.05">
        <Button onClick={() => navigate('/get-started/bitcoin/connect-your-ledger')}>
          Continue to add Bitcoin keys
        </Button>
        <Button onClick={() => navigate('/')}>Go to homepage</Button>
      </ButtonGroup>
      <Caption mt="space.04">You'll need to have the Bitcoin app installed</Caption>
    </LedgerWrapper>
  );
}
