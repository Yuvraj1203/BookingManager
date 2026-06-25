import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './home';
import Profile from './profile';

const BottomTabStack = createBottomTabNavigator();

export function BottomTabs() {
  return (
    <BottomTabStack.Navigator>
      <BottomTabStack.Screen name="Home" component={Home} />
      <BottomTabStack.Screen name="Profile" component={Profile} />
    </BottomTabStack.Navigator>
  );
}
