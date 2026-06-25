import { useTheme } from '@/theme/themeProvider/paperTheme';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import RootNavigator from './route';

const ApplicationNavigator = () => {
  const appTheme = useTheme();
  return (
    <PaperProvider theme={appTheme}>
      <NavigationContainer theme={appTheme}>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default ApplicationNavigator;
