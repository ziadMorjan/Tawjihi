// lottie library
import Lottie from "lottie-react";
//Animation component json
import discoverAnimation from "../../assets/animations/discoverAnimation.json";

export const DiscoverCoruses = () => {
  return (
    <Lottie
      style={{ width: "500px", height: "500px" }}
      animationData={discoverAnimation}
      loop={true}
    />
  );
};
