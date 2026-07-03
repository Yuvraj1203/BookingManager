import { Bookings, Dashboard, Revenue, Schedule, Settings } from '@/screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';

const BottomTab = createBottomTabNavigator();

export const bottomTabsData = [
  {
    name: 'Dashboard',
    component: Dashboard,
    iosIcon: 'square.grid.2x2',
    androidIcon: 'dashboard',
  },
  {
    name: 'Bookings',
    component: Bookings,
    iosIcon: 'book.pages',
    androidIcon: 'library_books',
  },
  {
    name: 'Schedule',
    component: Schedule,
    iosIcon: 'paperplane',
    androidIcon: 'rocket_launch',
  },
  {
    name: 'Revenue',
    component: Revenue,
    iosIcon: 'square.3.layers.3d.bottom.filled',
    androidIcon: 'account_balance_wallet',
  },
  {
    name: 'Settings',
    component: Settings,
    iosIcon: 'gearshape',
    androidIcon: 'settings',
  },
] as const;

export function BottomTabRoute() {
  return (
    <BottomTab.Navigator>
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
