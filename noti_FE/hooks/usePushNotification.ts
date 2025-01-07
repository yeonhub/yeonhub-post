import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

export const usePushNotifications = (isEnabled): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async (noti) => {
      const data = JSON.parse(noti.request.content.dataString);
      const type = data.type;

      if (type === "win") {
        return {
          shouldPlaySound: true,
          shouldShowAlert: isEnabled,
          shouldSetBadge: true,
        };
      } else {
        return {
          shouldPlaySound: false,
          shouldShowAlert: isEnabled,
          shouldSetBadge: false,
        };
      }
    },
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      token = await Notifications.getDevicePushTokenAsync();
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("당첨알림", {
        name: "당첨알림",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );

      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};
