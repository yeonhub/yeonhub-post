import React, {useEffect, useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {getApp} from '@react-native-firebase/app';

import MainScreen from './screens/MainScreen';
import Depth1Screen from './screens/Depth1Screen';
import Depth2Screen from './screens/Depth2Screen';
import Depth3Screen from './screens/Depth3Screen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  // firebase analytics 인스턴스 생성
  const analytics = useMemo(() => getAnalytics(getApp()), []);

  // 앱 실행 시 app_open 이벤트 로깅
  useEffect(() => {
    logEvent(analytics, 'app_open');
  }, [analytics]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerLeft: () => null,
          headerBackVisible: true,
        }}
        // 화면 전환 시 screen_name 이벤트 로깅
        screenListeners={{
          focus: async e => {
            const screenName = e?.target?.split('-')[0];
            console.log(screenName);
            await logEvent(analytics, 'screen_name', {
              screen_name: screenName,
              screen_class: screenName,
            });
          },
        }}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Depth1" component={Depth1Screen} />
        <Stack.Screen name="Depth2" component={Depth2Screen} />
        <Stack.Screen name="Depth3" component={Depth3Screen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
