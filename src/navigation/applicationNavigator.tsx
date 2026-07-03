import { useTheme } from '@/theme/themeProvider/paperTheme';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import RootNavigator from './route';

const ApplicationNavigator = () => {
  const appTheme = useTheme();
  const styles = makeStyle();
  return (
    <GestureHandlerRootView style={styles.main}>
      <PaperProvider theme={appTheme}>
        <NavigationContainer theme={appTheme}>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

const makeStyle = () =>
  StyleSheet.create({
    main: {
      flex: 1,
    },
  });

export default ApplicationNavigator;
