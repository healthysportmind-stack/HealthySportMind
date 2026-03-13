import React, { useState } from "react";
import { submitCheckIn } from "../services/api/checkinApi";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function CheckInScreen() {
  const router = useRouter();

  const [mood, setMood] = useState(5);
  const [stress, setStress] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [sleepHours, setSleepHours] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  try {
    setLoading(true);

    const data = await submitCheckIn({
      mood,
      stress,
      energy,
      sleep_hours: sleepHours,
      notes,
    });

    if (data.error) {
      Toast.show({
        type: "error",
        text1: "Check‑In Failed",
        text2: data.error,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Check‑in submitted!",
    });

    router.replace("/dashboard");

  } catch (err) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Something went wrong.",
    });
    console.log(err);
  } finally {
    setLoading(false);
  }
};

return (
  <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        Daily Check‑In
      </Text>

      {/* Mood */}
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Mood</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={mood}
        onValueChange={setMood}
      />
      <Text style={{ marginBottom: 20 }}>Value: {mood}</Text>

      {/* Stress */}
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Stress</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={stress}
        onValueChange={setStress}
      />
      <Text style={{ marginBottom: 20 }}>Value: {stress}</Text>

      {/* Energy */}
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Energy</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={energy}
        onValueChange={setEnergy}
      />
      <Text style={{ marginBottom: 20 }}>Value: {energy}</Text>

      {/* Sleep Hours */}
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Sleep Hours</Text>
      <TextInput
        placeholder="e.g. 7.5"
        keyboardType="numeric"
        value={sleepHours}
        onChangeText={setSleepHours}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
        }}
      />

      {/* Notes */}
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Notes</Text>
      <TextInput
        placeholder="How are you feeling today?"
        value={notes}
        onChangeText={setNotes}
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 8,
          height: 120,
          textAlignVertical: "top",
          marginBottom: 30,
        }}
      />

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: "#007AFF",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>
          {loading ? "Submitting..." : "Submit Check‑In"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}