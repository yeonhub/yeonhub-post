import { useEffect, useRef, useState } from "react";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
  MapMarker,
} from "react-native-maps";
import {
  Linking,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import { FontAwesome6 } from "@expo/vector-icons";

interface Marker {
  no: number;
  name: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

export default function HomeScreen() {
  // 초기 위치
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  // 위치 권한 상태
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // 다시 묻지 않기
  const [naverAsk, setNaverAsk] = useState(false);
  // 선택한 마커의 정보를 담는 state
  const [selectedStore, setSelectedStore] = useState<Marker | null>(null);
  // 선택한 마커 참조 ref
  const selectedMarkerRef = useRef<MapMarker>(null);

  const mapRef = useRef<MapView>(null);

  // 마커 배열
  const markers = [
    {
      no: 1,
      name: "marker-1",
      description: "marker-1 description",
      coordinate: {
        latitude: 37.39579392845674,
        longitude: 126.64145534858108,
      },
    },
    {
      no: 2,
      name: "marker-2",
      description: "marker-2 description",
      coordinate: {
        latitude: 37.39707112910085,
        longitude: 126.6373391635716,
      },
    },
    {
      no: 3,
      name: "marker-3",
      description: "marker-3 description",
      coordinate: {
        latitude: 37.399315966244664,
        longitude: 126.64468405768275,
      },
    },
  ];

  useEffect(() => {
    (async () => {
      // 위치 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();
      // 권한 허락 시 위치 권한 상태를 true로 변경, 초기 위치 state를 현재 위경도값으로 변경
      if (status === "granted") {
        setHasPermission(true);
        const location = await Location.getCurrentPositionAsync({});
        const initialRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          // 위경도 차이를 이용한 초기 지도 범위 크기
          // 값이 작을 수록 초기 지도가 확대되어 표시됩니다.
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
        setInitialRegion(initialRegion);
      } else {
        // 위치 권한 거절 시
        setHasPermission(false);
        // 거절 시 초기 위치를 수동으로 설정할 수 있습니다.
        const initialRegion = {
          latitude: 37.576022,
          longitude: 126.9769,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
        setInitialRegion(initialRegion);
      }
    })();
  }, []);

  // 권한 재요청 함수
  const askPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === "never_ask_again") {
        naverAsk ? Linking.openSettings() : setNaverAsk(true);
        setNaverAsk(true);
      } else if (granted === "granted") {
        setHasPermission(true);
        const location = await Location.getCurrentPositionAsync({});
        const initialRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
        setInitialRegion(initialRegion);
      }
    }
  };

  // 아래 코드를 추가하면 권한 거절 시 지도가 나오지 않고 재요청 버튼만 렌더링 됩니다.
  // 위치 권한이 없어도 지도를 사용할 수 있지만 거절 시 지도를 쓰지 못하게 하려면
  // 아래와 같이 추가하면 됩니다.
  if (hasPermission === false) {
    return (
      <Pressable onPress={askPermission}>
        <Text>권한 재요청</Text>
      </Pressable>
    );
  }
  // 4. 커스텀 버튼 눌렀을 때 호출되는 함수
  const moveToCurrentLocation = async () => {
    // 현재 위치 가져오기
    const location = await Location.getCurrentPositionAsync({});
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    // MapView를 현재 위치의 중심으로 이동
    // 1000밀리초 = 1초 동안 애니메이션 효과와 함께 이동
    mapRef.current?.animateToRegion(region, 1000);
  };

  // 이동 상태 관리
  const [isMoved, setIsMoved] = useState<boolean>(false);

  // 이동 완료 후 호출되는 함수
  const onRegionChangeComplete = () => {
    setIsMoved(true);
  };

  // 아이템을 선택할 때 마다 지도 이동
  useEffect(() => {
    if (selectedStore && mapRef.current) {
      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.showCallout();
      }
      mapRef.current.animateToRegion(
        {
          latitude: selectedStore.coordinate.latitude,
          longitude: selectedStore.coordinate.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );
    }
  }, [selectedStore]);

  return (
    initialRegion && (
      <>
        {isMoved && (
          <Pressable
            style={styles.myLocationBtn}
            onPress={moveToCurrentLocation}
          >
            <FontAwesome6 name="location-crosshairs" size={30} color="black" />
          </Pressable>
        )}
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          ref={mapRef}
          mapPadding={{ top: 0, right: 0, bottom: 100, left: 0 }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          onRegionChangeComplete={onRegionChangeComplete}
          maxZoomLevel={16}
          minZoomLevel={13}
        >
          {selectedStore && (
            <Marker
              ref={selectedMarkerRef}
              key={selectedStore.no}
              coordinate={{
                latitude: selectedStore.coordinate.latitude,
                longitude: selectedStore.coordinate.longitude,
              }}
              image={require("@/assets/icons/marker/marker.png")}
            >
              <Callout tooltip={true}>
                <View style={styles.calloutContainer}>
                  <Text>{selectedStore.name}</Text>
                  <Text>{selectedStore.description}</Text>
                </View>
              </Callout>
            </Marker>
          )}
        </MapView>
        <View style={styles.bottomSheet}>
          {markers.map((marker) => (
            <Pressable onPress={() => setSelectedStore(marker)}>
              <Text style={styles.bottomSheetText}>{marker.name}</Text>
            </Pressable>
          ))}
        </View>
      </>
    )
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  loading: {
    position: "absolute",
    zIndex: 100,
    alignSelf: "center",
    top: "50%",
  },
  myLocationBtn: {
    position: "absolute",
    zIndex: 100,
    top: 30,
    right: 30,
  },
  calloutContainer: {
    width: 200,
    height: 100,
    backgroundColor: "tan",
    borderRadius: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetText: {
    fontSize: 16,
  },
});
