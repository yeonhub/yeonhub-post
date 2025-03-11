import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Depth1Screen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Depth 1 Screen</Text>
      <Button
        title="Go to Depth 2"
        onPress={() => router.push("/Depth2Screen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
