import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, Text, TouchableOpacity, View , Image, Linking } from "react-native";
import { useState,useEffect } from "react";
import styles from "../styles/dashboardStyles";
import { fetchRSS } from "../hooks/fetchRSS";

export default function Dashboard({ user, profile }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
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

  {/* News Feed Card */}
  <View style={styles.newsCard}>
  <Text style={styles.sectionTitle}>Helpful Articles</Text>

  {loading && <Text>Loading articles...</Text>}

  {!loading && items?.slice(0, 3).map((item) => (
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