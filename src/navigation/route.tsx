import { CustomDatePicker } from '@/components';
import { AddBooking, BookingDetail, SplashScreen } from '@/screens';
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

      <RootStack.Screen
        name="BookingDetail"
        component={BookingDetail}
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
          headerShown: false,
          sheetAllowedDetents: [1.0],
          sheetExpandsWhenScrolledToEdge: true,
        }}
      />

      <RootStack.Screen
        name="CustomDatePicker"
        component={CustomDatePicker}
        options={{
          presentation: 'formSheet',
          headerShown: false,
          sheetAllowedDetents: 'fitToContents',
          sheetExpandsWhenScrolledToEdge: true,
        }}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
