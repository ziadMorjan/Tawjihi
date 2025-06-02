// style
import { CardDiv, IconStarDiv, StarWrapper, TeacherInfo } from "./style";

export const Card = ({ imgSrc, teacherImg, name, desc, starIcon, price }) => {
  return (
    <CardDiv>
      {imgSrc && <img src={imgSrc} alt={`صورة تخص ${name || "card"}`} />}

      {teacherImg && name && (
        <TeacherInfo>
          <img src={teacherImg} alt={name} />
          <span>{name}</span>
        </TeacherInfo>
      )}

      {desc && (
        <span>
          <strong>{desc}</strong>
        </span>
      )}

      {(starIcon || price !== undefined) && (
        <IconStarDiv>
          {starIcon > 0 && (
            <StarWrapper>
              {Array.from({ length: starIcon }, (_, index) => (
                <span key={index}>⭐</span>
              ))}
            </StarWrapper>
          )}

          {price !== undefined && (
            <span>
              {price === 0 ? (
                <strong>مجاني</strong>
              ) : (
                <>
                  السعر: <strong>{price} ₪</strong> <del>50.00 ₪</del>
                </>
              )}
            </span>
          )}
        </IconStarDiv>
      )}
    </CardDiv>
  );
};
