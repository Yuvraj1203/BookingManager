import { DrawerOne } from '@/screens';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AppDrawer } from './appDrawer';
import { BottomTabRoute } from './bottomTabRoute';
import { DrawerStackParamList } from './types/drawerStackParamList';

const Drawer = createDrawerNavigator<DrawerStackParamList>();

export const DrawerRoute = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: true }}
      drawerContent={props => <AppDrawer {...props} />}
      initialRouteName="Dashboard"
    >
      <Drawer.Screen name="Dashboard" component={BottomTabRoute} />
      <Drawer.Screen name="DrawerOne" component={DrawerOne} />
    </Drawer.Navigator>
  );
};
