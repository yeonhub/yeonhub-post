// MainScreen.tsx

import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const MainScreen = ({navigation}: Props) => {
  return (
    <View style={styles.container}>
      <Button title="Depth 1" onPress={() => navigation.navigate('Depth1')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen;
