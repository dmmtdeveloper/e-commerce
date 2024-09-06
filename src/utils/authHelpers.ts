import axiosInstance from './axiosInstance';

export const login = async (email: string, password: string) => {
  const { data } = await axiosInstance.post('/api/login', { email, password });
  localStorage.setItem('token', data.token);
  return data.user;
};

export const register = async (email: string, password: string, name:string) => {
  const { data } = await axiosInstance.post('/api/register', { email, password, name });
  localStorage.setItem('token', data.token);
  return data.user;
};

export const getUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const { data } = await axiosInstance.get('/api/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

// import CredentialsProvider from "next-auth/providers/credentials";
// import NextAuth from "next-auth/next";
// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",

//       credentials: {
//         email: { label: "email", type: "email", placeholder: "test@test.com" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials, req) {
//         // Add logic here to look up the user from the credentials supplied
//         const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

//         if (user) {
//           // Any object returned will be saved in `user` property of the JWT
//           return user;
//         } else {
//           // If you return null then an error will be displayed advising the user to check their details.
//           return null;

//           // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
//         }
//       },
//     }),
//   ],
// });

// export { handler as GET, handler as POST };
