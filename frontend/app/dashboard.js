import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ScrollView, Text, TouchableOpacity, View, Image, Linking } from "react-native";
import { useState, useEffect, use } from "react";
import styles from "../styles/dashboardStyles";
import { fetchRSS } from "../hooks/fetchRSS";
import { useRouter } from "expo-router";
import { getTodayCheckIn, getLastCheckIn } from "../services/api/checkinApi";
import { getProfile } from "../services/api/profileApi";
import { getPerformanceLogs } from "../services/api/performanceApi";
import { BarChart } from "react-native-gifted-charts";
const logo = require("../assets/images/Logo.png");

export default function Dashboard({ user, profile }) {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [todayCheckIn, setTodayCheckIn] = useState(null);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localProfile, setLocalProfile] = useState(null);
  const [localUser, setLocalUser] = useState(null);
  const [tokenready, setTokenReady] = useState(false);
  const [performanceLogs, setPerformanceLogs] = useState([]);

  async function loadLastCheckIn() {
    try {
      const data = await getLastCheckIn();
      console.log("LAST CHECK-IN RAW RESPONSE:", data);
      setLastCheckIn(data);
    } catch (err) {
      console.error("Last check-in fetch error:", err);
    }
  }

  async function reloadProfile() {
    try {
      const data = await getProfile();
      setLocalProfile(data);
      await AsyncStorage.setItem("profile", JSON.stringify(data));
    } catch (err) {
      console.error("Profile reload error:", err);
    }
  }


  async function loadCheckIn() {
    try {
      const data = await getTodayCheckIn();
      console.log("TODAY CHECK-IN RAW:", data);
      setTodayCheckIn(data);
    } catch (err) {
      console.error("Check-in fetch error:", err);
    }
  }

  async function loadPerformanceLogs() {
    try {
      const data = await getPerformanceLogs();
      setPerformanceLogs(data || []);
    } catch (err) {
      console.error("Performance logs fetch error:", err);
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
    async function loadStoredData() {
      const storedProfile = await AsyncStorage.getItem("profile");
      const storedUser = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("accessToken");

      if (storedProfile) setLocalProfile(JSON.parse(storedProfile));
      if (storedUser) setLocalUser(JSON.parse(storedUser));
      if (token) setTokenReady(true);
    }

    loadStoredData();
    load();
    loadCheckIn();
    loadLastCheckIn();
  }, []);
  useEffect(() => {
    if (isFocused) {
      loadCheckIn();
      loadLastCheckIn();
      reloadProfile();
      loadPerformanceLogs();
    }
  }, [isFocused]);


  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    router.replace("/");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image
            source={logo}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
          <Text style={styles.title}>HealthySportMind</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push("/settings")}
          >
            <Text style={styles.settingsText}>Settings</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.welcome}>
          Welcome, {localProfile?.name || localUser?.email}
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
              {localProfile?.sport || "No sport set"}
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
                <Text style={styles.cardSubtitle}>
                  {lastCheckIn.checkin.post_message}
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

          {/* Performance Tracker Button */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Performance Tracker</Text>
            <Text style={styles.cardSubtitle}>
              Log how your mood impacts your game.
            </Text>
            <TouchableOpacity
              style={[styles.checkInButton, { marginTop: 10 }]}
              onPress={() => router.push("/performance-tracker")}
            >
              <Text style={styles.checkInButtonText}>
                Log Performance
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* --- PERFORMANCE CHART SECTION --- */}
      <View style={styles.newsCard}>
        <Text style={styles.sectionTitle}>Mood & Performance Trend</Text>
        {performanceLogs && performanceLogs.length > 0 ? (
          (() => {
            const moodColors = {
              Happy: "#FFD700",
              Sad: "#4682B4",
              Mad: "#DC143C",
              Stressed: "#FF8C00",
              Calm: "#87CEFA",
              Relaxed: "#98FB98",
              Anxious: "#DDA0DD",
              Depressed: "#708090",
              Focused: "#32CD32",
              Excited: "#FF4500",
              Unspecified: "#CCC"
            };

            const stackData = performanceLogs.map((log) => {
              const totalRating = log.performance_rating || 0;
              const moods = Array.isArray(log.moods) && log.moods.length > 0 ? log.moods : ["Unspecified"];
              const stackHeight = totalRating / moods.length;

              return {
                stacks: moods.map((m) => ({
                  value: stackHeight,
                  color: moodColors[m] || "#CCC"
                })),
                label: new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              };
            });

            // Get unique reported moods dynamically
            const reportedMoods = Array.from(new Set(
              performanceLogs.reduce((acc, log) => {
                const moods = Array.isArray(log.moods) && log.moods.length > 0 ? log.moods : ["Unspecified"];
                return acc.concat(moods);
              }, [])
            ));

            const chartLegendData = reportedMoods.map(mood => ({
              name: mood,
              color: moodColors[mood] || "#CCC"
            }));

            return (
              <View style={{ marginTop: 20, marginBottom: 20 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ paddingRight: 20 }}>
                    <BarChart
                      stackData={stackData}
                      barWidth={35}
                      spacing={20}
                      initialSpacing={25}
                      endSpacing={45}
                      noOfSections={5}
                      maxValue={100}
                      yAxisThickness={0}
                      xAxisThickness={1}
                    />
                  </View>
                </ScrollView>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: 20 }}>
                  {chartLegendData.map((legendItem, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 10 }}>
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: legendItem.color, marginRight: 5 }} />
                      <Text style={{ fontSize: 12, color: '#333' }}>{legendItem.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })()
        ) : (
          <Text style={styles.cardSubtitle}>Log your performance to see the chart.</Text>
        )}
      </View>
      {/* Long-Term Insights */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Long‑Term Insights</Text>
        <Text style={styles.cardSubtitle}>
          View your weekly and monthly mental performance trends.
        </Text>

        <TouchableOpacity
          style={[styles.checkInButton, { marginTop: 10 }]}
          onPress={() => router.push("/LongTermInsights")}
        >
          <Text style={styles.checkInButtonText}>Open Insights</Text>
        </TouchableOpacity>
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