import api from "./api";

const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    return response;
  } catch (error) {
    throw error;
  }
};

const register = (email, password) => {
  return api.post("/auth/register", { email, password });
};

const authServiceSample = { login, register };

export default authServiceSample;
