import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { submitPerformanceLog } from "../services/api/performanceApi";

const MOODS = [
  "Happy", "Sad", "Mad", "Stressed", "Calm", 
  "Relaxed", "Anxious", "Depressed", "Focused", "Excited"
];

export default function PerformanceTrackerScreen() {
  const router = useRouter();

  const [selectedMoods, setSelectedMoods] = useState([]);
  const [performanceRating, setPerformanceRating] = useState(50);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMood = (mood) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== mood));
    } else {
      if (selectedMoods.length >= 3) {
        Toast.show({
          type: "info",
          text1: "Maximum of 3 moods allowed.",
          text2: "Deselect a mood to choose another one.",
        });
        return;
      }
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const data = await submitPerformanceLog({
        moods: selectedMoods,
        performance_rating: performanceRating,
        comments,
      });

      Toast.show({
        type: "success",
        text1: "Performance log submitted!",
      });

      router.replace("/dashboard");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err?.response?.data?.error || "Something went wrong.",
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Performance Tracker</Text>

      <Text style={styles.label}>Select up to 3 moods today:</Text>
      <View style={styles.moodContainer}>
        {MOODS.map((mood) => {
          const isSelected = selectedMoods.includes(mood);
          return (
            <TouchableOpacity
              key={mood}
              onPress={() => toggleMood(mood)}
              style={[
                styles.moodPill,
                isSelected && styles.moodPillSelected,
              ]}
            >
              <Text
                style={[
                  styles.moodText,
                  isSelected && styles.moodTextSelected,
                ]}
              >
                {mood}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Rate your performance (1-100):</Text>
      <Slider
        minimumValue={1}
        maximumValue={100}
        step={1}
        value={performanceRating}
        onValueChange={setPerformanceRating}
      />
      <Text style={styles.valueText}>Rating: {performanceRating}</Text>

      <Text style={styles.label}>Comments regarding performance:</Text>
      <TextInput
        placeholder="How did your mood affect your performance?"
        value={comments}
        onChangeText={setComments}
        multiline
        style={styles.textInput}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={styles.submitButton}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Submitting..." : "Submit Log"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  moodPill: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  moodPillSelected: {
    backgroundColor: "#007AFF",
  },
  moodText: {
    color: "#007AFF",
    fontSize: 16,
  },
  moodTextSelected: {
    color: "#fff",
  },
  valueText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#555",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    height: 120,
    textAlignVertical: "top",
    marginBottom: 30,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
