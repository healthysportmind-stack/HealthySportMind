import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://healthysportmind-git-358530944608.us-south1.run.app/";

async function getToken() {
  return await AsyncStorage.getItem("accessToken");
}

export async function getProfile() {
  const token = await getToken();

  try {
    const res = await axios.get(`${API_URL}/api/profile/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Unknown error" };
  }
}
