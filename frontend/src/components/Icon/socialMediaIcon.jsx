// src/features/components/SocialMediaIcon.jsx
import { SocialWrapper } from "./style";
import { API_URL } from "../../config";

export const SocialMediaIcon = ({ icon }) => {
  const handleOAuth = () => {
    window.location.href = `${API_URL}/auth/${icon}`; 
  };

  return (
    <SocialWrapper>
      <img
        src={`/assets/img/${icon}.png`}
        alt={icon}
        onClick={handleOAuth}
      />
    </SocialWrapper>
  );
};
