import { useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";

export default function HomeScreen() {
  // 광고 단위 ID
  // 개발 단계일 경우 테스트 단위 ID
  // 배포 단계일 경우 실제 광고 단위 ID
  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";
  const bannerRef = useRef<BannerAd>(null);

  // iOS의 경우 앱이 백그라운드에서 포그라운드로 돌아왔을 때 광고 배너가 비어있는 것을 방지
  useForeground(() => {
    Platform.OS === "ios" && bannerRef.current?.load();
  });
  return (
    <View style={styles.container}>
      <View style={styles.content}></View>
      <BannerAd
        ref={bannerRef}
        // 광고 단위 ID
        // unitId="ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy"
        unitId={adUnitId}
        // 베너 광고 크기
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
});
