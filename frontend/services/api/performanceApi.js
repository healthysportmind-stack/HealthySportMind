import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://127.0.0.1:8000/api"; 

export const getPerformanceLogs = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await axios.get(`${API_URL}/performance/logs/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching performance logs:", error);
    throw error;
  }
};

export const submitPerformanceLog = async (data) => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await axios.post(`${API_URL}/performance/logs/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting performance log:", error);
    throw error;
  }
};
