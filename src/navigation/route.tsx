import { AddBooking, SplashScreen } from '@/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerRoute } from './drawerRoute';
import { RootStackParamList } from './types';

const RootNavigator = () => {
  const RootStack = createNativeStackNavigator<RootStackParamList>();

  return (
    <RootStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SplashScreen"
    >
      <RootStack.Screen name="SplashScreen" component={SplashScreen} />
      <RootStack.Screen
        name="DrawerRoute"
        component={DrawerRoute}
        options={{
          headerLargeTitleEnabled: true,
        }}
      />
      {/* <RootStack.Screen name="Profile" component={Profile} /> */}
      <RootStack.Screen
        name="AddBooking"
        component={AddBooking}
        options={{
          presentation: 'formSheet',
          headerShown: true,
          sheetAllowedDetents: 'fitToContents',
        }}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
