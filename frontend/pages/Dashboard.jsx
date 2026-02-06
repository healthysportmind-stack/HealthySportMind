import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function Dashboard({ user, profile, logout }) {
  return (
    <ScrollView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>HealthySportMind</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.welcome}>
          Welcome, {profile?.email || user?.email}
        </Text>

        <Text style={styles.subtitle}>
          You're logged in and ready to go.
        </Text>

        {/* Info Grid */}
        <View style={styles.grid}>
          {/* Card 1 */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Your Sport</Text>
            <Text style={styles.infoValue}>
              {profile?.sport || "No sport set"}
            </Text>
          </View>

          {/* Card 2 */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Daily Check‑In</Text>
            <Text style={styles.infoText}>
              Coming soon — track your mood and readiness.
            </Text>
          </View>

          {/* Card 3 */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Streaks</Text>
            <Text style={styles.infoText}>
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
    fontSize: 14,
  },
  card: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
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
    gap: 20,
  },
  infoCard: {
    backgroundColor: "#f9fafb",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 18,
  },
  infoText: {
    color: "#6b7280",
  },
});