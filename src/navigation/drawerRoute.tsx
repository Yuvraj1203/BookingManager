import { CustomImage, Tap } from '@/components';
import { DrawerOne } from '@/screens';
import { Images } from '@/theme/assets/images';
import { useTheme } from '@/theme/themeProvider/paperTheme';
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import {
  DrawerActions,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { AppDrawer } from './appDrawer';
import { BottomTabRoute } from './bottomTabRoute';
import { DrawerStackParamList } from './types/drawerStackParamList';

const Drawer = createDrawerNavigator<DrawerStackParamList>();

const commonOptions: DrawerNavigationOptions = {
  // headerShown: false,
};

type Navigation = DrawerNavigationProp<DrawerStackParamList>;

export const DrawerRoute = () => {
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle();

  // const navigation = useAppNavigation();

  const headerHamburger = (navigation: Navigation) => {
    return (
      <Tap
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        style={styles.logoContainer}
      >
        <CustomImage
          color={theme.colors.onSurface}
          source={Images.drawer}
          style={styles.hamburger}
        />
      </Tap>
    );
  };

  const appDrawerContent = (props: any) => {
    return <AppDrawer {...props} />;
  };

  return (
    <Drawer.Navigator
      screenOptions={({ navigation }: { navigation: Navigation }) => ({
        headerLeft: () => headerHamburger(navigation),
      })}
      drawerContent={appDrawerContent}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={BottomTabRoute}
        options={({ route }) => ({
          ...commonOptions,
          title: getFocusedRouteNameFromRoute(route) ?? 'Dashboard',
        })}
      />
      <Drawer.Screen
        name="DrawerOne"
        component={DrawerOne}
        options={commonOptions}
      />
    </Drawer.Navigator>
  );
};

const makeStyle = () =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    logoContainer: {
      paddingHorizontal: 16,
    },
    hamburger: {
      width: 22,
      height: 22,
    },
  });
