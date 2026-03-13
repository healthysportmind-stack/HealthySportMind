import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://127.0.0.1:8000/api/checkins";

async function authHeaders() {
  const token = await AsyncStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getTodayCheckIn() {
  const res = await fetch(`${BASE_URL}/today/`, {
    headers: await authHeaders(),
  });
  return res.json();
}

export async function getLastCheckIn() {
  const res = await fetch(`${BASE_URL}/last/`, {
    headers: await authHeaders(),
  });
  return res.json();
}
export async function submitCheckIn(payload) {
  const res = await fetch(`${BASE_URL}/submit/`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
  });

  return res.json();
}

