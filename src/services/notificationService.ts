import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';

export const requestNotificationPermission = async () => {
  const settings = await notifee.requestPermission();

  return (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
};

export const setupNotifications = async () => {
  const allowed = await requestNotificationPermission();

  if (!allowed) {
    return false;
  }

  await notifee.createChannel({
    id: 'booking-reminders',
    name: 'Booking Reminders',
    importance: AndroidImportance.HIGH,
  });

  return true;
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
    // await Linking.openSettings();
    await notifee.openNotificationSettings();
    return false;
  }

  return true;
};

export const showNotification = async (title: string, body: string) => {
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: 'booking-reminders',
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      sound: 'default',
    },
  });
};
