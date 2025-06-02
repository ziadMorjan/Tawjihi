// style
import { CardDiv, IconStarDiv, StarWrapper, TeacherInfo } from "./style";

export const Card = ({
  imgSrc,
  teacherName,
  teacherImg,
  name,
  desc,
  starIcon,
  price,
  priceAfterDiscount,
}) => {
  return (
    <CardDiv>
      {imgSrc && <img src={imgSrc} alt={`صورة تخص ${name || "card"}`} />}

      {teacherImg && name && (
        <TeacherInfo>
          <img src={teacherImg} alt={teacherImg} />
          <span>{teacherName}</span>
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
                <span
                  key={index}
                  style={{ color: "#e5e222", fontSize: "24px" }}
                >
                  ★
                </span>
              ))}
            </StarWrapper>
          )}

          {starIcon === 0 && (
            <StarWrapper>
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} style={{ color: "#ccc", fontSize: "24px" }}>
                  ★
                </span>
              ))}
            </StarWrapper>
          )}

          {price !== undefined && (
            <span>
              {price === 0 ? (
                <strong>مجاني</strong>
              ) : (
                <>
                  السعر: <strong>{price} ₪</strong>{" "}
                  {priceAfterDiscount && <del>{priceAfterDiscount} ₪</del>}
                </>
              )}
            </span>
          )}
        </IconStarDiv>
      )}
    </CardDiv>
  );
};
