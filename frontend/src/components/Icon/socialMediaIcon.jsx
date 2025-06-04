//style
import axios from "axios";
import { SocialWrapper } from "./style";
import { API_URL } from "../../config";

export const SocialMediaIcon = ({ icon }) => {
  const handleGoogle = async ({ icon }) => {
    try {
      const res = await axios.get(`${API_URL}/auth/${icon}`);
      console.log(res);
    } catch (error) {
      console.error("Axios request error:", error);
    }
  };

  return (
    <SocialWrapper>
      <img
        src={`/assets/img/${icon}.png`}
        alt={icon}
        onClick={() => handleGoogle(icon)}
      />
    </SocialWrapper>
  );
};
