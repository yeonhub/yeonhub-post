import { Stack } from "expo-router/stack";
import analytics from "@react-native-firebase/analytics";
import { useEffect } from "react";

export type RootStackParamList = {
  "(stack)/Depth1Screen": undefined;
  "(stack)/Depth2Screen": undefined;
  "(stack)/Depth3Screen": undefined;
};

export default function RootLayout() {
  const logScreenView = async (screenName: string) => {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenName,
      });
      console.log("스크린 로깅 성공:", screenName);
    } catch (error) {
      console.error("스크린 로깅 실패:", error);
    }
  };

  useEffect(() => {
    async function initializeApp() {
      try {
        await analytics().setAnalyticsCollectionEnabled(true);
        console.log("firebase 초기화 성공");
      } catch (error) {
        console.error("firebase 초기화 실패:", error);
      }
    }
    initializeApp();
  }, []);

  return (
    <Stack
      screenListeners={{
        state: (e) => {
          const route = e.data?.state?.routes?.slice(-1)[0];
          if (route) {
            logScreenView(route.name);
          }
        },
      }}
    >
      <Stack.Screen name="(stack)/Depth1Screen" />
      <Stack.Screen name="(stack)/Depth2Screen" />
      <Stack.Screen name="(stack)/Depth3Screen" />
    </Stack>
  );
}
