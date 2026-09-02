import { CustomText, Tap, TextVariants } from '@/components';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { useAppNavigation } from '@/utils/navigationUtils';
import { LucideIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

type BottomTabButtonProps = {
  title: string;
  focused: boolean;
  onPress: () => void;
  Icon: LucideIcon;
};

export const BottomTabButton = ({ Icon, ...props }: BottomTabButtonProps) => {
  /** to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  /** for translations */
  const { t } = useTranslation();

  /** for navigation */
  const navigation = useAppNavigation();

  return (
    <Tap
      onPress={props.onPress}
      style={styles.tapContent}
      containerStyle={styles.tap}
    >
      <Icon
        size={24}
        color={props.focused ? theme.colors.primary : theme.colors.outline}
      />
      <CustomText
        maxLines={1}
        variant={TextVariants.labelSmall}
        color={props.focused ? theme.colors.primary : theme.colors.outline}
      >
        {props.title}
      </CustomText>
    </Tap>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    tap: {
      flex: 1,
      marginHorizontal: 10,
    },
    tapContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
