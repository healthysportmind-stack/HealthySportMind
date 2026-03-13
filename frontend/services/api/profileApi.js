import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://127.0.0.1:8000/api/profile";

async function authHeaders() {
  const token = await AsyncStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getProfile() {
  const res = await fetch(`${BASE_URL}/me/`, {
    headers: await authHeaders(),
  });
  return res.json();
}
