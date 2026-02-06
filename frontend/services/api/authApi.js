import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const registerUser = async (data) => {
  return axios.post(`${API_URL}/auth/register/`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const loginUser = async (email, password) => {
  return axios.post(`${API_URL}/auth/login/`, { email, password }, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};