import axios from "axios";

const API_URL = "https://healthysportmind-git-358530944608.us-south1.run.app/";

export const registerUser = async (data) => {
  return axios.post(`${API_URL}/auth/register/`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/auth/login/`, { email, password }, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};