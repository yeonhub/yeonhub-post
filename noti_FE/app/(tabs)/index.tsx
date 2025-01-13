import React, { useState, useEffect, useRef } from "react";
import { Platform, StyleSheet, Switch, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export default function HomeScreen() {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [expoToken, setExpoToken] = useState<string>("");
  const [fcmToken, setFcmToken] = useState<string>("");
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);

  // 알림 리스너
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );

  // 알림 응답 리스너
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // 알림 처리 설정
  useEffect(() => {
    // 알림 채널 설정
    setupNotificationChannel();
    // 푸시 알림 권한 설정
    registerForPushNotifications();

    // 포그라운드 알림 처리
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification); // 알림 정보 업데이트
      });

    // 알림 클릭 시 동작
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log(`customData1 : ${data.customData1}`);
        console.log(`customData2 : ${data.customData2}`);
        console.log(`customData3 : ${data.customData3}`);
      });

    return () => {
      // 컴포넌트가 언마운트 될 때 알림 리스너 제거
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      // 컴포넌트가 언마운트 될 때 알림 응답 리스너 제거
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // 알림 채널 설정 함수
  const setupNotificationChannel = async () => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("announce", {
        name: "공지사항",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        enableVibrate: true,
      });
      console.log("Notification channel set up");
    }
  };

  // 푸시 알림 권한 요청
  const registerForPushNotifications = async (): Promise<void> => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("알림 권한이 거부되었습니다!");
        setIsEnabled(false);
        return;
      }

      // Expo 푸시 토큰 가져오기

      // ************ Error getting push token 에러 발생 시 ************
      // *                                                            *
      // * 1. app.json > expo > extra > eas > projectId               *
      // * 2. projectId 변수에 직접 할당                               *
      // * 3. const projectId = "xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  *
      // *                                                            *
      // **************************************************************

      // const projectId =
      // Constants?.expoConfig?.extra?.eas?.projectId ??
      // Constants?.easConfig?.projectId;
      const projectId = "9fe217ab-9592-40b2-8fcd-516a6e775572";

      const expoTokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      setExpoToken(expoTokenData.data);
      console.log(`expo : ${expoTokenData.data}`);

      // FCM 토큰 가져오기
      const fcmTokenData = await Notifications.getDevicePushTokenAsync();
      setFcmToken(fcmTokenData.data);
      console.log(`fcm : ${fcmTokenData.data}`);

      setIsEnabled(true);
    } catch (error) {
      console.log("Error getting push token:", error);
      alert("푸시 토큰을 가져오는데 실패했습니다");
      setIsEnabled(false);
    }
  };

  const toggleSwitch = async (value: boolean): Promise<void> => {
    if (value) {
      await registerForPushNotifications();
    } else {
      setExpoToken("");
      setFcmToken("");
      setIsEnabled(false);
    }
  };

  // 포그라운드에서 알림 동작 설정
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true, // 알림 표시
      shouldPlaySound: false, // 소리 재생 여부
      shouldSetBadge: false, // 배지 갯수 변경 여부
    }),
  });

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: "#AAAAAA", true: "#050259" }}
        thumbColor={"#FFFFFF"}
        ios_backgroundColor="#AAAAAA"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <Text style={styles.label}>Expo push token:</Text>
      <Text style={styles.token}>{expoToken || "N/A"}</Text>
      <Text style={styles.label}>FCM push token:</Text>
      <Text style={styles.token}>{fcmToken || "N/A"}</Text>

      {notification && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>
            알림 수신: {notification.request.content.body}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  token: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginHorizontal: 20,
    marginTop: 5,
  },
  notificationContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
  notificationText: {
    fontSize: 14,
    color: "#333",
  },
});
