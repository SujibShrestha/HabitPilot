import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

export const googleUser = async (token:string) => {
 const res = await api.post(
        "/auth",
        { token }
      );
     
  return res.data;
};