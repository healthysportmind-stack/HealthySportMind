import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LongTermInsightsScreen() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("weekly");

  useEffect(() => {
    async function load() {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        console.log("TOKEN LOADED:", token);

        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }

        fetchInsights(token);
      } catch (err) {
        console.log("Token load error:", err);
        setLoading(false);
      }
    }

    load();
  }, []);

  const fetchInsights = async (token) => {
    try {
      const res = await axios.get(
        "https://healthysportmind-git-358530944608.us-south1.run.app/api/checkins/insights/long-term/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInsights(res.data);
    } catch (err) {
      console.log("Error fetching insights:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInsights = insights.filter(item =>
    mode === "weekly"
      ? Number(item.window_days) === 7
      : Number(item.window_days) === 30
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, mode === "weekly" && styles.activeButton]}
          onPress={() => setMode("weekly")}
        >
          <Text style={[styles.toggleText, mode === "weekly" && styles.activeText]}>Weekly</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, mode === "monthly" && styles.activeButton]}
          onPress={() => setMode("monthly")}
        >
          <Text style={[styles.toggleText, mode === "monthly" && styles.activeText]}>Monthly</Text>
        </TouchableOpacity>
      </View>

      {/* Insights List */}
      <FlatList
        data={filteredInsights}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No {mode} insights yet.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.category}>Category: {item.category}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#f0f0f0",
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  activeButton: {
    backgroundColor: "#4a90e2",
  },
  toggleText: {
    fontSize: 16,
    color: "#333",
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: "#888",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
