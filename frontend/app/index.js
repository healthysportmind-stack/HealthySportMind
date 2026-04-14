import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../services/api/authApi";
import styles from "../styles/authStyles";
import { Image } from "react-native";
const logo = require("../assets/images/Logo.png");
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    try {
      const data = await loginUser(email, password);
      console.log("LOGIN RESPONSE:", data);

      if (data.error) {
        setError(data.error);
        return;
      }
      await AsyncStorage.setItem("accessToken", data.access);
      await AsyncStorage.setItem("refreshToken", data.refresh);
      await AsyncStorage.setItem("profile", JSON.stringify(data.profile));
      await AsyncStorage.setItem("user", JSON.stringify({ email }));


      router.replace("/dashboard");

    } catch {
      setError("Network error. Try again.");
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >

      <View style={styles.card}>.
        <Image
        source={logo}
        style={{
          width: 360,
          height: 360,
          alignSelf: "center",
          marginBottom: 20,
        }}
        resizeMode="contain"
      />
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error !== "" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace("/register")}
        >
          <Text style={styles.secondaryButtonText}>
            Need an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}