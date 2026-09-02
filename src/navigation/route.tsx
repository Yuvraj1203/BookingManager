import { CustomDatePicker, Tap } from '@/components';
import { AddBooking, BookingDetail, PdfPreview, SplashScreen } from '@/screens';
import { Images } from '@/theme/assets/images';
import { useTheme } from '@/theme/themeProvider/paperTheme';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { DrawerRoute } from './drawerRoute';
import { RootStackParamList } from './types';

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

const RootNavigator = () => {
  const RootStack = createNativeStackNavigator<RootStackParamList>();

  const theme = useTheme();

  const headerBackButton = (navigation: RootNavigation) => {
    return (
      <Tap onPress={() => navigation.goBack()}>
        <Images.Back color={theme.colors.onSurface} />
      </Tap>
    );
  };

  return (
    <RootStack.Navigator
      screenOptions={({ navigation }: { navigation: RootNavigation }) => ({
        headerShown: false,
        headerLeft: () => headerBackButton(navigation),
      })}
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
          // headerLargeTitleEnabled: true,
          headerShown: true,
          title: 'Booking Details',
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
        name="PdfPreview"
        component={PdfPreview}
        options={{
          headerShown: true,
          title: 'Preview PDF',
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
