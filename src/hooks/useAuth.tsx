import { useState, useEffect } from 'react';
import { getUser, logoutUser } from '../utils/authHelpers';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const fetchedUser = await getUser();
      setUser(fetchedUser);
    };
    loadUser();
  }, []);

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return { user, logout };
};
