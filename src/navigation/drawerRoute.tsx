import { CustomImage, Tap } from '@/components';
import { DrawerOne } from '@/screens';
import { Images } from '@/theme/assets/images';
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
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

export const DrawerRoute = () => {
  /** theme integration in styles */
  const styles = makeStyle();
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <Tap
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            style={styles.logoContainer}
          >
            <CustomImage source={Images.drawer} style={styles.hamburger} />
          </Tap>
        ),
      })}
      drawerContent={props => <AppDrawer {...props} />}
      initialRouteName="Dashboard"
    >
      <Drawer.Screen
        name="Dashboard"
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
