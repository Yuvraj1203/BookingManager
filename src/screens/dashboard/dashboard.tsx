import { ButtonIconsProps, CustomButton, SafeScreen, Tap } from '@/components';
import { useAppLanguageStore } from '@/store';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { useAppNavigation } from '@/utils/navigationUtils';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { DashboardCard } from './dashboardCard';

export const Dashboard = () => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  /** for tranlations */
  const { t } = useTranslation();

  /** for navigation */
  const navigation = useAppNavigation();

  const setLang = useAppLanguageStore(state => state.changeAppLanguage);

  const buttonPlus = ({ size, color }: ButtonIconsProps) => {
    return <Images.Plus size={size} color={color} />;
  };

  return (
    <SafeScreen style={styles.main}>
      <View>
        <View style={styles.cardsContainer}>
          <Tap
            shadow={true}
            onPress={() => setLang('hi')}
            containerStyle={styles.cards}
            style={[styles.card, styles.primaryBg]}
          >
            <DashboardCard
              image={Images.calendar}
              title={t('ThisMonth')}
              value={'4'}
              valueUnit={'Bookings'}
              color={theme.colors.onPrimary}
            />
          </Tap>
          <Tap
            shadow={true}
            onPress={() => console.log('hi')}
            containerStyle={styles.cards}
            style={[styles.card, styles.secondaryBg]}
          >
            <DashboardCard
              image={Images.mousePointer}
              title={'THis Month'}
              value={'4'}
              valueUnit={'Bookings'}
              color={theme.colors.onSecondary}
            />
          </Tap>
        </View>

        <View style={styles.cardsContainer}>
          <Tap
            shadow={true}
            onPress={() => console.log('hi')}
            containerStyle={styles.cards}
            style={[styles.card, styles.outlined]}
          >
            <DashboardCard
              image={Images.calendar}
              title={'THis Month'}
              value={'4'}
              valueUnit={'Bookings'}
            />
          </Tap>
          <Tap
            shadow={true}
            onPress={() => console.log('hi')}
            containerStyle={styles.cards}
            style={[styles.card, styles.outlined]}
          >
            <DashboardCard
              image={Images.calendar}
              title={'THis Month'}
              value={'4'}
              valueUnit={t('Bookings')}
            />
          </Tap>
        </View>
      </View>

      <CustomButton
        onPress={() => navigation.navigate('AddBooking')}
        iconElement={buttonPlus}
      >
        {t('QuickAddBooking')}
      </CustomButton>
    </SafeScreen>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      flex: 1,
      paddingHorizontal: 10,
      gap: 15,
    },
    flex: {
      flex: 1,
    },
    cardsContainer: {
      flexDirection: 'row',
      gap: 10,
      marginVertical: 10,
      alignItems: 'center',
    },
    cards: {
      flex: 1,
    },
    card: {
      // flex: 1,
      padding: 20,
    },
    primaryBg: {
      backgroundColor: theme.colors.primary,
    },
    secondaryBg: {
      backgroundColor: theme.colors.secondary,
    },
    outlined: {
      borderWidth: 1,
      borderColor: theme.colors.surfaceVariant,
      backgroundColor: theme.colors.background,
    },
  });
