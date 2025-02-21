// Depth1Screen.tsx

import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const Depth1Screen = ({navigation}: Props) => {
  return (
    <View style={styles.container}>
      <Button title="Depth 2" onPress={() => navigation.navigate('Depth2')} />
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

export default Depth1Screen;
