const admin = require("firebase-admin");

// 서비스 계정 키 파일
// 수정 1: 서비스 계정 키 파일 경로를 수정합니다.
const serviceAccount = require("./yeonhub-7cbc9-firebase-adminsdk-qbr9d-f0329aef64.json");

// Firebase Admin 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (token) => {
  const message = {
    notification: {
      title: "알림 제목 - firebase-admin",
      body: "알림 내용 - firebase-admin",
    },
    token: token,
    data: {
      customData1: "value1-firebase-admin",
      customData2: "value2-firebase-admin",
      customData3: "value3-firebase-admin",
    },
    android: {
      notification: {
        channel_id: "announce",
        sound: "default",
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// 알림을 받는 디바이스의 FCM 토큰
// 수정 2: 알림을 받는 디바이스의 FCM 토큰을 수정합니다.
const fcmToken =
  "eLW_6RnXQNqKG6P5uhBeYk:APA91bFhoHqYV7nXri4MMAOwW0c9eRJxkKfrayds93TRUlKRo5I38JadwsV5cECbr5qIuhWihiN464V_RkbRk8oNpFDzWgaqVXME3p3IkmUJzIds9fTOvl8";

sendNotification(fcmToken);
