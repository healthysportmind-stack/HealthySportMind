import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://127.0.0.1:8000";

async function getToken() {
  return await AsyncStorage.getItem("accessToken");
}

export async function getTodayCheckIn() {
  const token = await getToken();

  try {
    const res = await axios.get(`${API_URL}/api/checkins/today/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Unknown error" };
  }
}

export async function getLastCheckIn() {
  const token = await getToken();

  try {
    const res = await axios.get(`${API_URL}/api/checkins/last/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Unknown error" };
  }
}

export async function submitCheckIn(payload) {
  const token = await getToken();

  try {
    const res = await axios.post(
      `${API_URL}/api/checkins/submit/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Unknown error" };
  }
}
