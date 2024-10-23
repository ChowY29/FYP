import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(accessToken);
      setRole(decodedToken.role);
      setUserId(decodedToken.id);
    } catch (error) {
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { role, userId, loading };
};

export default useAuth;
