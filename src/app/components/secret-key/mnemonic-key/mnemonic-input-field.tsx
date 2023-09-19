import { useState } from 'react';

import { TextField } from '@radix-ui/themes';
import { useField } from 'formik';
import { css } from 'leather-styles/css';
import { FlexProps, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { useShowFieldError } from '@app/common/form-utils';

interface InputFieldProps extends FlexProps {
  dataTestId?: string;
  name: string;
  value: string;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onUpdateWord: (word: string) => void;
  hasError?: boolean;
  wordlist: string[];
}
export function InputField({
  dataTestId,
  name,
  onPaste,
  onChange,
  // onUpdateWord,
  value,
}: // wordlist,
InputFieldProps) {
  // const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const [field] = useField(name);
  const [ttype, setType] = useState<'text' | 'password'>('password');
  const [isFocused, setIsFocused] = useState(false);

  // const buttonRef = useRef<HTMLButtonElement>(null);

  // const [autoSuggestOpen, setAutoSuggestOpen] = useState(false);

  // const [open, setOpen] = useState<boolean>();
  // const regex = new RegExp('^' + field.value, 'i');

  const showError = useShowFieldError(name);

  // useEffect(() => {
  //   // console.log(field.value);
  //   if (field.value.length > 3) {
  //     // triggerButtonRef.current.click();
  //     buttonRef.current?.click();
  //     document.getElementById('button')?.click();
  //     // setOpen(true);
  //   }
  //   // setOpen(false);
  // }, [field.value]);

  return (
    <div>
      <TextField.Root
        /**
         * Focus styling:
         * radix inserts a <div inside the root with .rt-TextFieldChrome
         * onFocus - this adds an unwanted box-shadow
         * setting color="brown" makes this transparent
         * then focus border can be controlled more easily
         */
        color="brown"
        className={css({
          display: 'flex',
          alignSelf: 'stretch',
          height: '48px',
          width: '176px',
          gap: 'space.01',
          px: 'space.03',
          border: isFocused
            ? `2px solid ${token('colors.accent.text-primary')}`
            : showError
            ? `2px solid ${token('colors.error')}`
            : 'none',
          borderRadius: '4px',
        })}
      >
        <TextField.Slot>
          {/* TODO check this color */}
          <styled.span textStyle="label.01" color="GrayText">{`${name}.`}</styled.span>
        </TextField.Slot>
        <TextField.Input
          autoCapitalize="off"
          autoComplete="off"
          data-testid={dataTestId}
          // _focus={{ border: `2px solid ${token('colors.accent.text-primary')}` }}
          className={css({
            height: '24px', // TODO - using tokens here not working
            lineHeight: '24px',
            marginTop: 'space.03', // adding this to center text
            marginBottom: 'space.03', // adding this to center text
            fontSize: '17px',
          })}
          id={name}
          spellCheck="false"
          type={ttype}
          onFocus={() => {
            setIsFocused(!isFocused);
            setType('text');
          }}
          {...field}
          onChange={onChange}
          value={value || field.value || ''}
          // using onBlurCapture keep Formik onBlur validation
          onBlurCapture={() => {
            setIsFocused(!isFocused);
            setType('password');
          }}
          onPaste={onPaste}
        />
      </TextField.Root>

      {/* <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger>
          <styled.button id="button" ref={buttonRef} display="none">
            pete
          </styled.button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          data-state="open"
          className={css({
            width: 'var(--radix-dropdown-menu-trigger-width)',
          })}
          sideOffset={5}
        >
          {wordlist &&
            wordlist.length > 0 &&
            wordlist
              .filter(word => regex.test(word))
              .map(word => (
                <DropdownMenu.Item
                  key={word}
                  className={css({
                    '&[data-highlighted]': {
                      bg: 'accent.component-background-hover',
                      color: 'accent.text-primary',
                    },
                  })}
                  onSelect={() => {
                    onUpdateWord(word);
                  }}
                >
                  {word}
                </DropdownMenu.Item>
              ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root> */}
    </div>
  );
}
