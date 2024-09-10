// utils/tokenHelpers.ts
export const setToken = (token: string) => {
  sessionStorage.setItem("authToken", token); // Guarda el token en sessionStorage
};

export const getToken = () => {
  return sessionStorage.getItem("authToken"); // Obtén el token de sessionStorage
};

export const clearToken = () => {
  sessionStorage.removeItem("authToken"); // Borra el token de sessionStorage
};

