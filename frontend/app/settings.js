import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function SettingsScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sport, setSport] = useState("");

  const [tone, setTone] = useState("neutral");

  const [weeklySummary, setWeeklySummary] = useState(false);
  const [monthlySummary, setMonthlySummary] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const storedProfile = await AsyncStorage.getItem("profile");
      const storedTone = await AsyncStorage.getItem("preferredTone");

      const storedWeekly = await AsyncStorage.getItem("notifWeekly");
      const storedMonthly = await AsyncStorage.getItem("notifMonthly");

      if (storedProfile) {
        const p = JSON.parse(storedProfile);
        setName(p.name || "");
        setSport(p.sport || "");
        if (p.preferred_tone) setTone(p.preferred_tone);
        if (typeof p.notif_weekly === "boolean") setWeeklySummary(p.notif_weekly);
        if (typeof p.notif_monthly === "boolean") setMonthlySummary(p.notif_monthly);
      }

      if (storedTone) setTone(storedTone);

      setWeeklySummary(storedWeekly === "true");
      setMonthlySummary(storedMonthly === "true");
    }

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);

      await AsyncStorage.setItem("preferredTone", tone);
      await AsyncStorage.setItem("notifWeekly", weeklySummary.toString());
      await AsyncStorage.setItem("notifMonthly", monthlySummary.toString());

      const existing = await AsyncStorage.getItem("profile");
      let parsed = existing ? JSON.parse(existing) : {};

      const updatedProfile = {
        ...parsed,
        name,
        sport,
        preferred_tone: tone,
        notif_weekly: weeklySummary,
        notif_monthly: monthlySummary,
      };

      await AsyncStorage.setItem("profile", JSON.stringify(updatedProfile));

      const token = await AsyncStorage.getItem("accessToken");

      await fetch("http://127.0.0.1:8000/api/profile/update/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          sport,
          preferred_tone: tone,
          notif_weekly: weeklySummary,
          notif_monthly: monthlySummary,
        }),
      });

      Toast.show({
        type: "success",
        text1: "Settings saved",
      });

      router.back();
    } catch (err) {
      console.log(err);
      Toast.show({
        type: "error",
        text1: "Error saving settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    router.replace("/");
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        Settings
      </Text>

      {/* Profile Section */}
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
        Profile
      </Text>

      <Text>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 8,
          marginBottom: 15,
        }}
      />

      <Text>Sport</Text>
      <TextInput
        value={sport}
        onChangeText={setSport}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 8,
          marginBottom: 25,
        }}
      />

      {/* Tone Section */}
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
        Tone Preference
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 25,
        }}
      >
        {["neutral", "coach", "calm", "direct", "supportive"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTone(t)}
            style={{
              paddingVertical: 8,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16 }}>{t}</Text>
            <Text>{tone === t ? "●" : "○"}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications */}
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
        Notifications
      </Text>

      <View style={{ marginBottom: 25 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <Text>Weekly Summary</Text>
          <Switch value={weeklySummary} onValueChange={setWeeklySummary} />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>Monthly Summary</Text>
          <Switch value={monthlySummary} onValueChange={setMonthlySummary} />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={loading}
        style={{
          backgroundColor: "#007AFF",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>
          {loading ? "Saving..." : "Save Settings"}
        </Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "#EF4444",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
