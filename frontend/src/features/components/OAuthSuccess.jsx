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
        console.log("user:", response.data.data.doc);
        if (response.data.data.doc) {
          localStorage.setItem("user", JSON.stringify(response.data.data.doc));
          // setIsAuth(true);
        }
        navigate(PATH.Main);
      })
      .catch((error) => {
        console.error("error:", error);
        setIsAuth(false);
        navigate(`/${PATH.Auth}/login`);
      })
      .finally(() => setLoading(false));
  }, [navigate, setIsAuth]);

  if (loading) return <div>Logging in...</div>;
};

export default OAuthSuccess;
