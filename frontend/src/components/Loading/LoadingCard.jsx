//style
import {
  SkeletonWrapper,
  SkeletonAvatar,
  SkeletonLine,
  SkeletonLineShort,
} from "./style";

export const CardSkeleton = () => {
  return (
    <SkeletonWrapper>
      <SkeletonAvatar />
      <SkeletonLineShort />
      <SkeletonLine />
      <SkeletonLine />
    </SkeletonWrapper>
  );
};
