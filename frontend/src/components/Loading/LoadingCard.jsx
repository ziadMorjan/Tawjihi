// style
import {
  SkeletonAvatar,
  SkeletonLineShort,
  SkeletonPrice,
  SkeletonStars,
  SkeletonStarsPrice,
  SkeletonTeacherImg,
  SkeletonTeacherName,
  SkeletonWrapper,
  TeacherInfoWrapper,
} from "./style";

export const CardSkeleton = () => {
  return (
    <SkeletonWrapper>
      {/* Image skeleton */}
      <SkeletonAvatar />

      {/* Course name */}
      <SkeletonLineShort />

      {/* Subject */}
      <SkeletonLineShort />

      {/* Teacher info */}
      <TeacherInfoWrapper>
        <SkeletonTeacherImg />
        <SkeletonTeacherName />
      </TeacherInfoWrapper>

      {/* Stars and Price */}
      <SkeletonStarsPrice>
        <SkeletonStars />
        <SkeletonPrice />
      </SkeletonStarsPrice>
    </SkeletonWrapper>
  );
};
