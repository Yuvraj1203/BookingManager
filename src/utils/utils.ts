import { Keyboard } from 'react-native';

//calling when. we want to hide the keyboard
export const hideKeyboard = () => {
  if (Keyboard.isVisible()) {
    Keyboard.dismiss();
  }
};
