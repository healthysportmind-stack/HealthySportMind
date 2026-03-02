import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ScrollView, Text, TouchableOpacity, View, Image, Linking } from "react-native";
import { useState, useEffect } from "react";
import styles from "../styles/dashboardStyles";
import { fetchRSS } from "../hooks/fetchRSS";
import { useRouter } from "expo-router";


export default function Dashboard({ user, profile }) {
  const router = useRouter();
  const [todayCheckIn, setTodayCheckIn] = useState(null);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  async function loadLastCheckIn() {
        try {
          const token = await AsyncStorage.getItem("accessToken");
          const res = await fetch("http://127.0.0.1:8000/api/checkins/last/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          console.log("LAST CHECK-IN RAW RESPONSE:", data);
          setLastCheckIn(data);
        } catch (err) {
          console.error("Last check-in fetch error:", err);
        }
      }
  
    async function loadCheckIn() {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const res = await fetch("http://127.0.0.1:8000/api/checkins/today/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("TODAY CHECK-IN RAW:", data);
        setTodayCheckIn(data);
      } catch (err) {
        console.error("Check-in fetch error:", err);
      }
    }    
  useEffect(() => {
    async function load() {
      try {
        const itemsFromFeed = await fetchRSS("https://www.cbssports.com/rss/headlines/");
        setItems(itemsFromFeed || []);
      } catch (err) {
        console.error("RSS fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
    loadCheckIn();
    loadLastCheckIn();
  }, []);

  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    navigation.replace("index");
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
          You&apos;re logged in and ready to go.
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

          {/* Daily Check-In */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Daily Check‑In</Text>
          {todayCheckIn?.exists ? (
            <View>
              <Text style={styles.cardSubtitle}>You checked in today!</Text>

              {todayCheckIn.checkin?.post_message && (
                <Text style={styles.cardSubtitle}>
                  {todayCheckIn.checkin.post_message}
                </Text>
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.checkInButton}
              onPress={() => router.push("/checkin")}
            >
              <Text style={styles.checkInButtonText}>
                Complete today’s check‑in
              </Text>
            </TouchableOpacity>
          )}
                    </View>

          {/* Last Check-In */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Last Check‑In</Text>

            {lastCheckIn?.exists ? (
              <>
                <Text style={styles.cardSubtitle}>
                  Mood: {lastCheckIn.checkin.mood}
                </Text>
                <Text style={styles.cardSubtitle}>
                  Stress: {lastCheckIn.checkin.stress}
                </Text>
                <Text style={styles.cardSubtitle}>
                  Energy: {lastCheckIn.checkin.energy}
                </Text>
                <Text style={styles.cardSubtitle}>
                  Sleep: {lastCheckIn.checkin.sleep_hours} hrs
                </Text>
                <Text style={styles.cardSubtitle}>
                  {new Date(lastCheckIn.checkin.created_at).toLocaleString()}
                </Text>
              </>
            ) : (
              <Text style={styles.cardSubtitle}>No check‑ins yet</Text>
            )}
          </View>

          {/* Streaks */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Streaks</Text>
            <Text style={styles.cardSubtitle}>
              Your consistency metrics will appear here.
            </Text>
          </View>
        </View>
      </View>

      {/* News Feed */}
      <View style={styles.newsCard}>
        <Text style={styles.sectionTitle}>Helpful Articles</Text>

        {loading && <Text>Loading articles...</Text>}

        {!loading &&
          items?.slice(0, 3).map((item) => (
            <View key={item.link} style={styles.articleCard}>
              {item.image && (
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.articleImage}
                    resizeMode="contain"
                  />
                </View>
              )}

              <Text style={styles.articleTitle}>{item.title}</Text>

              <Text style={styles.articleDescription} numberOfLines={3}>
                {item.summary}
              </Text>

              <TouchableOpacity
                style={styles.readMoreButton}
                onPress={() => Linking.openURL(item.link)}
              >
                <Text style={styles.readMoreText}>Read More</Text>
              </TouchableOpacity>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}