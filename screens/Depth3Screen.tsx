// Depth3Screen.tsx

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Depth3Screen = () => {
  return (
    <View style={styles.container}>
      <Text>Depth 3</Text>
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

export default Depth3Screen;
