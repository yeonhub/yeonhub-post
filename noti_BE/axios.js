const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");

// 서비스 계정 키 파일
const serviceAccount = require("./yeonhub-7cbc9-firebase-adminsdk-qbr9d-f0329aef64.json");

// FCM URL 주소
const FCM_URL =
  "https://fcm.googleapis.com/v1/projects/yeonhub-7cbc9/messages:send";

const sendNotification = async (token) => {
  try {
    // 인증 토큰 생성
    const auth = new GoogleAuth({
      credentials: serviceAccount,
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });

    // 인증 토큰 획득
    const client = await auth.getClient();

    // 액세스 토큰 획득
    const accessToken = await client.getAccessToken();

    // 요청 헤더
    const headers = {
      Authorization: `Bearer ${accessToken.token}`,
      "Content-Type": "application/json",
    };

    // 요청 데이터
    const requestBody = {
      message: {
        token: token,
        notification: {
          title: "알림 제목 - axios",
          body: "알림 내용 - axios",
        },
        data: {
          customData1: "value1-axios",
          customData2: "value2-axios",
          customData3: "value3-axios",
        },
        android: {
          notification: {
            channel_id: "announce",
            sound: "default",
          },
        },
      },
    };

    // FCM 요청 전송
    const response = await axios.post(FCM_URL, requestBody, { headers });
    console.log("Successfully sent message:", response.data);
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error);
  }
};

// 알림을 받는 디바이스의 FCM 토큰
const fcmToken = "";

sendNotification(fcmToken);
