// components/Loading/SkeletonTeacherCard.jsx
import {
  SkeletonTeacherWrapper,
  SkeletonTeacherImage,
  SkeletonTeacherBadge,
  SkeletonTeacherName,
  SkeletonTeacherUnderline,
  SkeletonTeacherDesc,
  SkeletonTeacherStars,
  SkeletonTeacherStar,
} from "./SkeletonTeacherStyle";

export const SkeletonTeacherCard = () => {
  return (
    <SkeletonTeacherWrapper>
      <SkeletonTeacherBadge />
      <SkeletonTeacherImage />
      <SkeletonTeacherName />
      <SkeletonTeacherUnderline />
      <SkeletonTeacherDesc />
      <SkeletonTeacherStars>
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonTeacherStar key={index} />
        ))}
      </SkeletonTeacherStars>
    </SkeletonTeacherWrapper>
  );
};
