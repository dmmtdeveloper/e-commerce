import axiosInstance from './axiosInstance';

export const login = async (email: string, password: string) => {
  const { data } = await axiosInstance.post('/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  return data.user;
};

export const register = async (email: string, password: string) => {
  const { data } = await axiosInstance.post('/auth/register', { email, password });
  localStorage.setItem('token', data.token);
  return data.user;
};

export const getUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const { data } = await axiosInstance.get('/auth/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};
