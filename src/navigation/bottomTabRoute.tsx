import { Bookings, Dashboard, Revenue, Schedule, Settings } from '@/screens';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { isLiquidGlassSupported } from '@callstack/liquid-glass';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, View } from 'react-native';
import CustomBottomBar from './bottomBar/customBottomBar';

const BottomTab = createBottomTabNavigator();

export const bottomTabsData = [
  {
    name: 'Dashboard',
    component: Dashboard,
    iosIcon: 'square.grid.2x2',
    androidIcon: 'dashboard',
    icon: Images.Dashboard,
  },
  {
    name: 'Bookings',
    component: Bookings,
    iosIcon: 'book.pages',
    androidIcon: 'library_books',
    icon: Images.Bookings,
  },
  {
    name: 'Schedule',
    component: Schedule,
    iosIcon: 'paperplane',
    androidIcon: 'rocket_launch',
    icon: Images.Calendar,
  },
  {
    name: 'Revenue',
    component: Revenue,
    iosIcon: 'square.3.layers.3d.bottom.filled',
    androidIcon: 'account_balance_wallet',
    icon: Images.Stack,
  },
  {
    name: 'Settings',
    component: Settings,
    iosIcon: 'gearshape',
    androidIcon: 'settings',
    icon: Images.Gear,
  },
] as const;

export function BottomTabRoute() {
  /** to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  return (
    <BottomTab.Navigator
      initialRouteName="Dashboard"
      tabBar={
        isLiquidGlassSupported
          ? undefined
          : props => (
              <View style={styles.customBarContainer}>
                <CustomBottomBar {...props} />
              </View>
            )
      }
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
      }}
      backBehavior={'none'}
    >
      {bottomTabsData.map((item, index) => {
        return (
          <BottomTab.Screen
            key={index}
            options={{
              tabBarIcon: Platform.select({
                ios: {
                  type: 'sfSymbol' as const,
                  name: item.iosIcon,
                },
                android: {
                  type: 'materialSymbol' as const,
                  name: item.androidIcon,
                },
              }),
            }}
            name={item.name}
            component={item.component}
          />
        );
      })}
    </BottomTab.Navigator>
  );
}

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    customBarContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.transparent,
    },
    tabBarStyle: {
      backgroundColor: theme.colors.transparent,
      borderTopWidth: 0,
      elevation: 0,
    },
  });
