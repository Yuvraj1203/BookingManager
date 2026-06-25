import { createMMKV } from 'react-native-mmkv';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StateStorage } from 'zustand/middleware';
import ApplicationNavigator from './navigation/applicationNavigator';

export const storage = createMMKV();
/* State Management library Zustand(https://github.com/pmndrs/zustand) START */
export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    return storage.remove(name);
  },
};
/* State Management library Zustand(https://github.com/pmndrs/zustand) END */

function App() {
  return (
    <SafeAreaProvider>
      <ApplicationNavigator />
    </SafeAreaProvider>
  );
}

export default App;
