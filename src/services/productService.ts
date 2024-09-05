import axiosInstance from '@/utils/axiosInstance';

export const getProducts = async () => {
  const response = await axiosInstance.get('/products');
  return response.data;
};
