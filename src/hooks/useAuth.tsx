// import { useState, useEffect } from 'react';
// import { getUser, logoutUser } from '@/utils/authHelpers';

// export const useAuth = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const fetchedUser = await getUser();
//         setUser(fetchedUser);
//       } catch (error) {
//         console.error("Error al obtener el usuario:", error);
//         setUser(null);
//       }
//     };
//     loadUser();
//   }, []);

//   const logout = async () => {
//     try {
//       await logoutUser();
//       setUser(null);
//     } catch (error) {
//       console.error("Error al cerrar sesión:", error);
//     }
//   };

//   return { user, logout };
// };
