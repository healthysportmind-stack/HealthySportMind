import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Dashboard({ user, profile }) {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    navigation.replace("Login");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>HealthySportMind</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.welcome}>
          Welcome, {profile?.email || user?.email}
        </Text>

        <Text style={styles.subtitle}>
          You&#39;re logged in and ready to go.
        </Text>

        {/* Info Grid */}
        <View style={styles.grid}>
          {/* Card 1 */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Your Sport</Text>
            <Text style={styles.cardValue}>
              {profile?.sport || "No sport set"}
            </Text>
          </View>

          {/* Card 2 */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Daily Check‑In</Text>
            <Text style={styles.cardSubtitle}>
              Coming soon — track your mood and readiness.
            </Text>
          </View>

          {/* Card 3 */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Streaks</Text>
            <Text style={styles.cardSubtitle}>
              Your consistency metrics will appear here.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: 30,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  infoCard: {
    backgroundColor: "#f9fafb",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    width: "48%",
  },
  cardTitle: {
    fontWeight: "700",
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 18,
  },
  cardSubtitle: {
    color: "#6b7280",
  },
});