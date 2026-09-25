import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps,
  TextInputSubmitEditingEvent,
} from 'react-native';
import type { InputReturnKeyType } from './formTextInput';

export type NextInputOptions = {
  /** input to focus when the return key is pressed - defaults returnKeyType to "next" and keeps the keyboard open */
  nextRef?: React.RefObject<RNTextInput | null>;
  /** overrides what the return key does; multiline inputs insert a new line unless this is set to "submit" */
  submitBehavior?: TextInputProps['submitBehavior'];
  returnKeyType?: InputReturnKeyType;
  onSubmitEditing?: (e: TextInputSubmitEditingEvent) => void;
};

/** shared "go to next input" wiring - returns props to spread on the TextInput */
export const useNextInput = ({
  nextRef,
  submitBehavior,
  returnKeyType,
  onSubmitEditing,
  multiLine,
}: NextInputOptions & { multiLine: boolean }) => {
  /** return key moves focus to nextRef (if any), then runs the caller's handler */
  const handleSubmitEditing = (e: TextInputSubmitEditingEvent) => {
    nextRef?.current?.focus();
    onSubmitEditing?.(e);
  };

  const hasNext = !!nextRef && !multiLine;

  return {
    returnKeyType: returnKeyType ?? (hasNext ? 'next' : 'default'),
    // multiline keeps RN's default (return = new line) unless the caller overrides it
    submitBehavior: submitBehavior ?? (hasNext ? 'submit' : undefined),
    onSubmitEditing: handleSubmitEditing,
  } satisfies Partial<TextInputProps>;
};
