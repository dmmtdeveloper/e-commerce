// utils/tokenHelpers.ts
export const setToken = (token: string) => {
  sessionStorage.setItem("authToken", token);
};

export const getToken = () => {
  return sessionStorage.getItem("authToken");
};

export const clearToken = () => {
  sessionStorage.removeItem("authToken");
};
