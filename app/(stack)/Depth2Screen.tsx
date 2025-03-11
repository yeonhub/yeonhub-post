import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Depth2Screen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Depth 2 Screen</Text>
      <Button
        title="Go to Depth 3"
        onPress={() => router.push("/Depth3Screen")}
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
