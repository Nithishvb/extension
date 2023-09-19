import { useState } from 'react';

import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Form, Formik } from 'formik';
import { css } from 'leather-styles/css';
import { Flex, styled } from 'leather-styles/jsx';

import { isEmpty } from '@shared/utils';

import { createNullArrayOfLength } from '@app/common/utils';
import { LeatherButton } from '@app/components/button/button';
import { ErrorLabel } from '@app/components/error-label';
import { SecretKeyGrid } from '@app/components/secret-key/secret-key-grid';
import { useSignIn } from '@app/pages/onboarding/sign-in/hooks/use-sign-in';

import { MnemonicWordInput } from '../../../components/secret-key/mnemonic-key/mnemonic-word-input';
import {
  getMnemonicErrorFields,
  getMnemonicErrorMessage,
  hasMnemonicFormValues,
} from '../../../components/secret-key/mnemonic-key/utils/error-handling';
import { validationSchema } from '../../../components/secret-key/mnemonic-key/utils/validation';

export function MnemonicForm({
  mnemonic,
  setMnemonic,
  twentyFourWordMode,
}: {
  mnemonic: (string | null)[];
  setMnemonic: (mnemonic: (string | null)[]) => void;
  twentyFourWordMode: boolean;
}): React.JSX.Element {
  const { submitMnemonicForm, error, isLoading } = useSignIn();
  const [mnemonicErrorMessage, setMnemonicErrorMessage] = useState('');
  const [showMnemonicErrors, setShowMnemonicErrors] = useState(false);

  function mnemonicWordUpdate(index: number, word: string) {
    // console.log('mnemonicWordUpdate', index, word);
    const newMnemonic = [...mnemonic];
    newMnemonic[index] = word;
    setMnemonic(newMnemonic);
  }

  function updateEntireKey(key: string, setFieldValue: (name: string, value: number) => void) {
    const newKey = key.split(' ');
    newKey.map((index, value) => setFieldValue(`${index + 1}`, value));
    setMnemonic(newKey);
    void submitMnemonicForm(key);
  }

  const mnemonicFieldArray = mnemonic
    ? mnemonic
    : createNullArrayOfLength(twentyFourWordMode ? 24 : 12);

  // set initialValues to avoid throwing uncontrolled inputs error
  const initialValues = mnemonicFieldArray.reduce(
    (accumulator, _, index) => ((accumulator[`${index + 1}`] = ''), accumulator),
    {}
  );
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => void submitMnemonicForm(mnemonic.join(' '))}
      validationSchema={validationSchema}
      validateOnBlur
      validateOnChange
    >
      {({ errors, touched, setFieldValue, values /*, validateForm*/ }) => {
        // console.log(mnemonicErrorMessage);
        return (
          <Form>
            <styled.h2 textStyle="heading.03" mt="space.02" mb="space.04" textAlign="center">
              Your Secret Key
            </styled.h2>
            <SecretKeyGrid>
              {mnemonicFieldArray.map((_, i) => (
                <MnemonicWordInput
                  index={i}
                  fieldNumber={i + 1}
                  key={i}
                  value={mnemonic[i] || ''}
                  onPasteEntireKey={key => {
                    (document.activeElement as HTMLInputElement).blur();
                    updateEntireKey(key, setFieldValue);
                  }}
                  onUpdateWord={w => mnemonicWordUpdate(i, w)}
                />
              ))}
            </SecretKeyGrid>
            <Flex flexDirection="column" justifyContent="center" alignItems="center" gap="space.05">
              {(showMnemonicErrors || error) && (
                // #4274 TODO migrate ErrorLabel
                <ErrorLabel
                  width="100%"
                  className={css({
                    '& svg': {
                      mt: '3px',
                    },
                  })}
                >
                  <styled.p data-testid="sign-in-seed-error" textStyle="caption">
                    {showMnemonicErrors ? mnemonicErrorMessage : error}
                  </styled.p>
                </ErrorLabel>
              )}

              <LeatherButton
                data-testid={OnboardingSelectors.SignInBtn}
                aria-disabled={isLoading}
                aria-busy={isLoading}
                width="100%"
                type="submit"
                onClick={async e => {
                  e.preventDefault();
                  // debugger;
                  if (!isEmpty(touched)) {
                    // const isValid = await validateForm();
                    // setMessage(getMnemonicErrorFields(errors, touched, values));
                    const hasFormValues = hasMnemonicFormValues(values);
                    const mnemonicErrorFields = getMnemonicErrorFields(errors, touched, values);
                    setShowMnemonicErrors(!isEmpty(mnemonicErrorFields) && hasFormValues);
                    setMnemonicErrorMessage(getMnemonicErrorMessage(mnemonicErrorFields));
                    // console.log('validateForm', isValid, mnemonicErrorFields);

                    // PETE this has to work soon. for some reason mnemonicErrorFields is being set to []

                    // SOOOO close! See what Fab says about when to show validation once this is working

                    // maybe read into FormikContext and
                    // https://javascript.plainenglish.io/how-to-listen-to-formik-onchange-event-in-react-df00c4d09be

                    // if (!isEmpty(isValidForm)) {
                    //   return;
                    // } else {
                    //   return submitMnemonicForm(mnemonic.join(' '));
                    // }
                  }
                  return submitMnemonicForm(mnemonic.join(' '));
                  // console.log('onclick submit', mnemonic);
                }}
              >
                Continue
              </LeatherButton>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
}
