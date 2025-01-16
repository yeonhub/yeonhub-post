import {
  StyleSheet,
  Platform,
  View,
  Linking,
  Pressable,
  Text,
} from "react-native";

export default function HomeScreen() {
  // 길찾기 앱 열기
  const openNmap = async () => {
    // 현재 위치 예시
    const location = {
      coords: {
        latitude: 37.55316386899907,
        longitude: 126.97272605295855,
      },
      name: "서울역",
    };

    // 목적지 위치 예시
    const destination = {
      coords: {
        latitude: 37.51380325278886,
        longitude: 127.10204823010712,
      },
      name: "잠실역",
    };

    // 네이버 지도 길찾기 url
    const naverMapUrl = `nmap://route/public?slat=${location.coords.latitude}&slng=${location.coords.longitude}&sname=${location.name}&dlat=${destination.coords.latitude}&dlng=${destination.coords.longitude}&dname=${destination.name}`;

    // 네이버 지도 앱이 설치되어 있는지 확인
    Linking.canOpenURL(naverMapUrl).then((supported) => {
      console.log(supported);
      if (supported) {
        // 설치되어 있다면 네이버 지도 앱 열기
        Linking.openURL(naverMapUrl);
      } else {
        // 설치되어 있지 않다면 앱스토어로 이동
        if (Platform.OS === "android") {
          Linking.openURL("market://details?id=com.nhn.android.nmap");
        } else if (Platform.OS === "ios") {
          Linking.openURL("https://apps.apple.com/kr/app/id311867728");
        }
      }
    });
  };

  const openYoutube = async () => {
    // 유튜브 검색어
    const input = "react native expo";
    // 유튜브 검색어를 URL 인코딩
    const encodedInput = encodeURIComponent(input);
    // 유튜브 앱 검색 URL
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodedInput}`;

    await Linking.openURL(youtubeSearchUrl);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={openNmap} style={styles.btn}>
        <Text>Open Naver Map</Text>
      </Pressable>
      <Pressable onPress={openYoutube} style={styles.btn}>
        <Text>Open Youtube</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    padding: 10,
    backgroundColor: "lightgray",
    borderRadius: 10,
  },
});
