import { CustomText, Shadow } from '@/components';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { CurrentWeekChartType } from '@/utils/bookingUtils';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { BarChart, barDataItem } from 'react-native-gifted-charts';

type RevenueBarChartProps = {
  currentWeekBarChart: CurrentWeekChartType[];
};

export const RevenueBarChart = ({
  currentWeekBarChart,
  ...props
}: RevenueBarChartProps) => {
  /**to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  /** for tranlations */
  const { t } = useTranslation();

  /** data */
  const barData: barDataItem[] = useMemo(() => {
    const currentWeekBarData: barDataItem[] = currentWeekBarChart.map(item => {
      return {
        value: Number(item.totalAmount),
        frontColor: item.isToday
          ? theme.colors.primary
          : theme.colors.primaryContainer,
        showGradient: true,
        gradientColor: theme.colors.secondary,
        label: item.dayShort,
      };
    });
    return currentWeekBarData;
  }, [currentWeekBarChart]);

  return (
    <Shadow style={styles.main}>
      <CustomText>{t('CurrentWeek')}</CustomText>
      <BarChart
        data={barData}
        frontColor={theme.colors.primaryContainer}
        barBorderRadius={theme.lightRoundness}
        xAxisColor={theme.colors.border}
        yAxisColor={theme.colors.border}
        width={300}
        xAxisLabelTextStyle={styles.axisText}
        yAxisTextStyle={styles.axisText}
        xAxisIndicesColor={theme.colors.border}
      />
    </Shadow>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      padding: 20,
      marginVertical: 10,
      marginTop: 20,
      gap: 20,
    },
    axisText: {
      color: theme.colors.outline,
    },
  });
