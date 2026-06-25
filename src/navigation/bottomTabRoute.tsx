import { Bookings, Dashboard, Revenue, Schedule, Settings } from '@/screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const BottomTab = createBottomTabNavigator();

export function BottomTabRoute() {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen name="Dashboard" component={Dashboard} />
      <BottomTab.Screen name="Bookings" component={Bookings} />
      <BottomTab.Screen name="Schedule" component={Schedule} />
      <BottomTab.Screen name="Revenue" component={Revenue} />
      <BottomTab.Screen name="Settings" component={Settings} />
    </BottomTab.Navigator>
  );
}
