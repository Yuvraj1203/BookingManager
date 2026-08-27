import {
  CustomChip,
  CustomMenu,
  CustomText,
  CustomTextInput,
  ImageType,
  TextVariants,
} from '@/components';
import { StatusEnum } from '@/screens/addBooking/addBooking';
import { CustomerCard } from '@/screens/dashboard/customerCard';
import { useBookingStore } from '@/store';
import { Images } from '@/theme/assets/images';
import { CustomTheme, useTheme } from '@/theme/themeProvider/paperTheme';
import { useAppNavigation } from '@/utils/navigationUtils';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

enum FilterKeyEnum {
  All = 'All',
  Today = 'Today',
  Upcoming = 'Upcoming',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  PendingPay = 'PendingPay',
}

enum SortKeyEnum {
  Date = 'Date',
  Amount = 'Amount',
  Name = 'Name',
}

const FILTERS: { key: FilterKeyEnum; labelKey: string }[] = [
  { key: FilterKeyEnum.All, labelKey: 'All' },
  { key: FilterKeyEnum.Today, labelKey: 'Today' },
  { key: FilterKeyEnum.Upcoming, labelKey: 'Upcoming' },
  { key: FilterKeyEnum.Completed, labelKey: 'Completed' },
  { key: FilterKeyEnum.Cancelled, labelKey: 'Cancelled' },
  { key: FilterKeyEnum.PendingPay, labelKey: 'PendingPay' },
];

const SORTS: { id: SortKeyEnum; title: string }[] = [
  { id: SortKeyEnum.Date, title: SortKeyEnum.Date },
  { id: SortKeyEnum.Amount, title: SortKeyEnum.Amount },
  { id: SortKeyEnum.Name, title: SortKeyEnum.Name },
];

export const BookingScreen = () => {
  /** to get the default theme of app */
  const theme = useTheme();

  /** theme integration in styles */
  const styles = makeStyle(theme);

  /** for edges */
  const safeAreaInsets = useSafeAreaInsets();

  /** for translations */
  const { t } = useTranslation();

  /** for navigation */
  const navigation = useAppNavigation();

  /** all bookings from the store */
  const bookings = useBookingStore(state => state.bookings);

  /** search text */
  const [search, setSearch] = useState('');

  /** selected filter chip */
  const [selectedFilter, setSelectedFilter] = useState<FilterKeyEnum>(
    FilterKeyEnum.All,
  );

  /** selected sort chip */
  const [selectedSort, setSelectedSort] = useState<SortKeyEnum>(
    SortKeyEnum.Date,
  );

  /** filtered + searched + sorted bookings */
  const visibleBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    const searched = query
      ? bookings.filter(
          booking =>
            booking.clientName.toLowerCase().includes(query) ||
            booking.mobile.toLowerCase().includes(query) ||
            booking.venue.toLowerCase().includes(query),
        )
      : bookings;

    const filtered = searched.filter(booking => {
      switch (selectedFilter) {
        case FilterKeyEnum.Today:
          return dayjs(booking.date).isSame(dayjs(), 'day');
        case FilterKeyEnum.Upcoming:
          return dayjs(booking.date).isAfter(dayjs(), 'day');
        case FilterKeyEnum.Completed:
          return booking.status === StatusEnum.Completed;
        case FilterKeyEnum.Cancelled:
          return booking.status === StatusEnum.Cancelled;
        case FilterKeyEnum.PendingPay:
          return (
            Number(booking.totalAmount) - Number(booking.advancePaid || 0) > 0
          );
        default:
          return true;
      }
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (selectedSort) {
        case SortKeyEnum.Amount:
          return Number(b.totalAmount) - Number(a.totalAmount);
        case SortKeyEnum.Name:
          return a.clientName.localeCompare(b.clientName);
        default:
          return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
      }
    });

    return sorted;
  }, [bookings, search, selectedFilter, selectedSort]);

  /** height of the bottom tab bar, so scroll content and the FAB clear it */
  const tabBarHeight = useBottomTabBarHeight();

  /** plus icon rendered inside the FAB */
  const fabIcon = ({ size }: { size: number }) => (
    <Images.Plus size={size} color={theme.colors.onPrimary} />
  );

  return (
    <View style={styles.main}>
      <View style={styles.mainContainer}>
        <CustomTextInput
          text={search}
          onChangeText={setSearch}
          placeholder={t('SearchBookingsPlaceholder')}
          showLabel={false}
          showError={false}
          prefixIcon={{
            luicideIcon: (
              <Images.Search size={18} color={theme.colors.onSurfaceVariant} />
            ),
            type: ImageType.luicide,
          }}
          style={styles.searchInput}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          {FILTERS.map(filter => (
            <CustomChip
              key={filter.key}
              label={t(filter.labelKey)}
              selected={selectedFilter === filter.key}
              onPress={() => setSelectedFilter(filter.key)}
            />
          ))}
        </ScrollView>

        <View style={styles.resultRow}>
          <CustomText color={theme.colors.onSurfaceVariant}>
            {`${visibleBookings.length} ${t('Results')}`}
          </CustomText>
          <CustomMenu
            actions={SORTS}
            trigger={
              <View style={styles.menuTrigger}>
                <Images.Filter color={theme.colors.onSurface} />
              </View>
            }
            onCommonPress={id => setSelectedSort(id as SortKeyEnum)}
          />
        </View>

        <ScrollView
          style={styles.mainContainer}
          contentContainerStyle={{ paddingBottom: tabBarHeight + 130 }}
        >
          <View style={styles.list}>
            {visibleBookings.length > 0 ? (
              visibleBookings.map(booking => (
                <CustomerCard key={booking.id} cardItem={booking} />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <CustomText
                  maxLines={1}
                  variant={TextVariants.bodySmall}
                  color={theme.colors.outline}
                >
                  {t('NoBookingsFound')}
                </CustomText>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <FAB
        icon={fabIcon}
        style={[styles.fab, { bottom: tabBarHeight + 70 }]}
        onPress={() => navigation.navigate('AddBooking')}
      />
    </View>
  );
};

const makeStyle = (theme: CustomTheme) =>
  StyleSheet.create({
    main: {
      flex: 1,
    },
    mainContainer: {
      flex: 1,
      paddingHorizontal: 10,
    },
    searchInput: {
      marginTop: 15,
    },
    fab: {
      position: 'absolute',
      right: 16,
      backgroundColor: theme.colors.primary,
    },
    filterScroll: {
      marginTop: 10,
      // ScrollView defaults to flexGrow: 1, which lets it stretch to fill
      // the leftover column space instead of just wrapping its chips.
      flexGrow: 0,
      flexShrink: 0,
    },
    filterScrollContent: {
      gap: 8,
      paddingRight: 10,
    },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 15,
      paddingHorizontal: 10,
    },
    menuTrigger: {
      paddingVertical: 1,
      paddingHorizontal: 15,
      borderRadius: theme.roundness,
      borderColor: theme.colors.border,
      borderWidth: StyleSheet.hairlineWidth,
    },
    sortRow: {
      flexDirection: 'row',
      gap: 6,
    },
    list: {
      gap: 12,
      marginTop: 10,
      marginBottom: 20,
    },
    emptyContainer: {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.border,
      padding: 20,
      borderRadius: theme.roundness,
      alignItems: 'center',
    },
  });
