import { Suspense, memo } from 'react';

import { TransactionRequestSelectors } from '@tests/selectors/requests.selectors';
import { Stack, StackProps } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';

import { ErrorIcon } from '@app/components/icons/error-icon';
import { TransactionErrorReason } from '@app/pages/transaction-request/components/transaction-error/transaction-error';
import { useTransactionError } from '@app/pages/transaction-request/hooks/use-transaction-error';

function MinimalErrorMessageSuspense(props: StackProps) {
  const error = useTransactionError();

  if (!error) return null;

  const getTitle = () => {
    if (error) {
      switch (error) {
        case TransactionErrorReason.Unauthorized:
          return 'Unauthorized request';
        case TransactionErrorReason.NoContract:
          return 'Contract not found';
        case TransactionErrorReason.InvalidContractAddress:
          return 'Invalid contract address';
        case TransactionErrorReason.StxTransferInsufficientFunds:
        case TransactionErrorReason.FeeInsufficientFunds:
          return 'Insufficient balance';
        case TransactionErrorReason.Generic:
          return 'Something went wrong';
      }
    }
    return null;
  };

  return (
    <Stack
      alignItems="center"
      bg="#FCEEED"
      borderRadius="12px"
      color={token('colors.error')}
      data-testid={TransactionRequestSelectors.TransactionErrorMessage}
      // TODO refctor stack isInline
      // isInline
      p="base"
      width="100%"
      {...props}
    >
      <ErrorIcon />
      <styled.span data-testid={TransactionRequestSelectors.ErrorMessage} textStyle="caption.01">
        {getTitle()}
      </styled.span>
    </Stack>
  );
}

function MinimalErrorMessageBase(props: StackProps) {
  return (
    <Suspense fallback={<></>}>
      <MinimalErrorMessageSuspense {...props} />
    </Suspense>
  );
}

export const MinimalErrorMessage = memo(MinimalErrorMessageBase);
