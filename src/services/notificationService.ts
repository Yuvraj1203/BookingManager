import { BookingType } from '@/store';
import i18n from '@/translations';
import notifee, {
  AlarmType,
  AndroidImportance,
  AndroidNotificationSetting,
  AuthorizationStatus,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { Linking, Platform } from 'react-native';

const CHANNEL_ID = 'booking-reminders';

/** mirrors StatusEnum in addBooking - kept local to avoid a screen <-> service import cycle */
const INACTIVE_STATUSES = ['Cancelled', 'Completed'];

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export type ReminderPreferences = {
  notifyOneDayBefore: boolean;
  notifyTwoHoursBefore: boolean;
};

/** stable ids so re-scheduling a booking replaces its old reminders */
const oneDayReminderId = (bookingId: string) => `${bookingId}-1d`;
const twoHoursReminderId = (bookingId: string) => `${bookingId}-2h`;

export const requestNotificationPermission = async () => {
  const settings = await notifee.requestPermission();

  return (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
};

/**
 * Only creates the Android notification channel. Does NOT request permission -
 * the OS only shows the permission dialog once per install, so the actual
 * request must happen from enableNotifications() on explicit user action.
 */
export const setupNotifications = async () => {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Booking Reminders',
    importance: AndroidImportance.HIGH,
  });

  return true;
};

export const isNotificationsEnabled = async () => {
  const settings = await notifee.getNotificationSettings();

  return (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
};

export const enableNotifications = async () => {
  const settings = await notifee.getNotificationSettings();

  console.log('BEFORE:', settings);

  const allowed =
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;

  if (allowed) {
    return true;
  }

  const requested = await notifee.requestPermission();

  console.log('AFTER REQUEST:', requested);

  const nowAllowed =
    requested.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    requested.authorizationStatus === AuthorizationStatus.PROVISIONAL;

  if (!nowAllowed) {
    console.log('Opening notification settings...');
    if (Platform.OS === 'ios') {
      // notifee.openNotificationSettings() is a no-op on iOS.
      await Linking.openSettings();
    } else {
      await notifee.openNotificationSettings();
    }
    return false;
  }

  return true;
};

/** Android 12+ "Alarms & reminders" access - without it reminders can fire up to ~1h late */
export const canScheduleExactAlarms = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }
  const settings = await notifee.getNotificationSettings();
  return settings.android.alarm !== AndroidNotificationSetting.DISABLED;
};

export const openExactAlarmSettings = async () => {
  await notifee.openAlarmPermissionSettings();
};

export const showNotification = async (title: string, body: string) => {
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: CHANNEL_ID,
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      sound: 'default',
    },
  });
};

/** booking stores date and time as two separate Date strings - merge them into the event's start */
const getBookingStart = (booking: BookingType) => {
  const date = new Date(booking.date);
  const time = new Date(booking.time);

  if (isNaN(date.getTime()) || isNaN(time.getTime())) {
    return undefined;
  }

  date.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return date;
};

/** schedules a single self-triggering notification, skipping times already in the past */
const scheduleReminder = async (
  id: string,
  timestamp: number,
  title: string,
  body: string,
  alarmType: AlarmType,
) => {
  if (timestamp <= Date.now()) {
    return;
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp,
    alarmManager: {
      type: alarmType,
    },
  };

  await notifee.createTriggerNotification(
    {
      id,
      title,
      body,
      android: {
        channelId: CHANNEL_ID,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        sound: 'default',
      },
    },
    trigger,
  );
};

export const cancelBookingReminders = async (bookingId: string) => {
  await notifee.cancelTriggerNotifications([
    oneDayReminderId(bookingId),
    twoHoursReminderId(bookingId),
  ]);
};

/**
 * Clears any existing reminders for the booking, then schedules the 1 day / 2 hour
 * reminders enabled in settings. Safe to call on both add and edit.
 */
export const scheduleBookingReminders = async (
  booking: BookingType,
  preferences: ReminderPreferences,
) => {
  try {
    await cancelBookingReminders(booking.id);

    if (booking.status && INACTIVE_STATUSES.includes(booking.status)) {
      return;
    }

    if (!preferences.notifyOneDayBefore && !preferences.notifyTwoHoursBefore) {
      return;
    }

    const settings = await notifee.getNotificationSettings();
    if (
      settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED &&
      settings.authorizationStatus !== AuthorizationStatus.PROVISIONAL
    ) {
      return;
    }

    const start = getBookingStart(booking);
    if (!start) {
      return;
    }

    await setupNotifications();

    // Android 14+ denies "Alarms & reminders" by default, and notifee silently drops
    // exact triggers without it - fall back to an inexact alarm (may fire a few minutes late)
    const alarmType =
      Platform.OS === 'android' &&
      settings.android.alarm === AndroidNotificationSetting.DISABLED
        ? AlarmType.SET_AND_ALLOW_WHILE_IDLE
        : AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE;

    const title = i18n.t('BookingReminderTitle');
    const bodyParams = {
      name: booking.clientName,
      venue: booking.venue,
      time: start.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    if (preferences.notifyOneDayBefore) {
      await scheduleReminder(
        oneDayReminderId(booking.id),
        start.getTime() - ONE_DAY_MS,
        title,
        i18n.t('BookingReminderOneDayBody', bodyParams),
        alarmType,
      );
    }

    if (preferences.notifyTwoHoursBefore) {
      await scheduleReminder(
        twoHoursReminderId(booking.id),
        start.getTime() - TWO_HOURS_MS,
        title,
        i18n.t('BookingReminderTwoHoursBody', bodyParams),
        alarmType,
      );
    }
  } catch (error) {
    console.log('Failed to schedule booking reminders:', error);
  }
};

/** re-applies reminder preferences to every booking, e.g. after the settings toggles change */
export const rescheduleAllBookingReminders = async (
  bookings: BookingType[],
  preferences: ReminderPreferences,
) => {
  await Promise.all(
    bookings.map(booking => scheduleBookingReminders(booking, preferences)),
  );
};
