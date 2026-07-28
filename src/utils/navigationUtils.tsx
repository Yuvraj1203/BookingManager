import { RootStackParamList } from '@/navigation/types';
import { DrawerStackParamList } from '@/navigation/types/drawerStackParamList';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from 'react';

export const useAppNavigation: () => NativeStackNavigationProp<RootStackParamList> =
  useNavigation;

// Add all param lists for useRoute to work Properly
export type AllStackParamList = RootStackParamList & DrawerStackParamList;
// BottomTabStackParamList &
// ChatBotStackParamList;

// global hook to access param of any screen
export const useAppRoute = <T extends keyof AllStackParamList & string>(
  screenName: T,
) => {
  return useRoute<AllStackParamList, T>(screenName);
};

type CallbackType = (data?: any) => void;

type CallbackContextType = {
  receiveDataBack: <T extends keyof AllStackParamList>(
    key: T,
    callback: CallbackType,
  ) => void;
  sendDataBack: <T extends keyof AllStackParamList>(key: T, data?: any) => void;
};

const CallbackContext = createContext<CallbackContextType | undefined>(
  undefined,
);

export const useReturnDataContext = (): CallbackContextType => {
  const context = useContext(CallbackContext);
  if (!context) {
    throw new Error(
      'useCallbackContext must be used within a CallbackProvider',
    );
  }
  return context;
};

type CallbackProviderProps = {
  children: ReactNode;
};

export const ReturnScreenDataProvider: React.FC<CallbackProviderProps> = ({
  children,
}) => {
  const callbackMapRef = useRef<Map<string, CallbackType>>(new Map());

  const receiveDataBack = useCallback(
    <T extends keyof AllStackParamList>(key: T, callback: CallbackType) => {
      callbackMapRef.current.set(key as string, callback);
    },
    [],
  );

  const sendDataBack = useCallback(
    <T extends keyof AllStackParamList>(key: T, data?: any) => {
      const callback = callbackMapRef.current.get(key as string);
      if (callback) {
        callback(data);
      }
    },
    [],
  );

  return (
    <CallbackContext.Provider value={{ receiveDataBack, sendDataBack }}>
      {children}
    </CallbackContext.Provider>
  );
};
