import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../routes/";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { setIsAuth } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`${API_URL}/users/me`, { withCredentials: true })
      .then((response) => {
        console.log("OAuth /auth/me response:", response);

        // Optional: if token is returned in response
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token); // Or use cookies if not HTTP-only
        }

        setIsAuth(true);
        navigate(PATH.Main);
      })
      .catch((error) => {
        console.error("OAuth /auth/me error:", error);
        setIsAuth(false);
        navigate(`/${PATH.Auth}/login`);
      })
      .finally(() => setLoading(false));
  }, [navigate, setIsAuth]);

  if (loading) return <div>Logging in...</div>;
  return null;
};

export default OAuthSuccess;
