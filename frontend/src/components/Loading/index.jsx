//style
import { LoadingWrapper, Spinner, LoadingText, BounceDot } from "./style";

const Loading = () => {
  return (
    <LoadingWrapper>
      <Spinner />
      <LoadingText>
        جارٍ التحميل
        <BounceDot delay="0s">.</BounceDot>
        <BounceDot delay="0.1s">.</BounceDot>
        <BounceDot delay="0.2s">.</BounceDot>
      </LoadingText>
    </LoadingWrapper>
  );
};

export default Loading;
