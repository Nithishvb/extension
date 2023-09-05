import { UpdateProfileRequestSelectors } from '@tests/selectors/requests.selectors';
import { Stack } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';

interface UpdateActionProfileProps {
  onUpdateProfile: () => Promise<void>;
  onCancel: () => void;
  // isLoading: boolean;
}

export function UpdateActionLayout({
  onUpdateProfile,
  onCancel,
}: // isLoading,
UpdateActionProfileProps) {
  return (
    // FIXME refactor isInline properly
    <Stack /*isInline*/>
      {/* FIXME - figure out tertiary variant of LeatherButton */}
      <LeatherButton onClick={onCancel} flexGrow={1} borderRadius="10px" variant="ghost">
        Cancel
      </LeatherButton>
      <LeatherButton
        data-testid={UpdateProfileRequestSelectors.BtnUpdateProfile}
        type="submit"
        flexGrow={1}
        borderRadius="10px"
        onClick={onUpdateProfile}
        // FIXME - add isLoading variant to button if needed
        // isLoading={isLoading}
      >
        Update
      </LeatherButton>
    </Stack>
  );
}
