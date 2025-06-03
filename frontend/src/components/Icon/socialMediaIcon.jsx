//style
import { SocialWrapper } from "./style";


export const SocialMediaIcon = ({icon}) => {
  return (
   
      <SocialWrapper>
        <img src={`/assets/img/${icon}.png`} alt={icon} />
      </SocialWrapper>
 
  );
};
