//style
import { CardDiv, IconStarDiv, StarWrapper } from "./style";

export const Card = ({ imgSrc, name, desc, starIcon, price }) => {
  return (
    <CardDiv>
      {imgSrc && <img src={imgSrc} alt={`صورة تخص ${name || "card"}`} />}

      {name && (
        <span>
          تم الإنشاء بواسطة : <strong>{name}</strong>
        </span>
      )}

      {desc && (
        <span>
          تفاصيل: <strong>{desc}</strong>
        </span>
      )}

      {(starIcon || price !== undefined) && (
        <IconStarDiv>
          {starIcon && (
            <StarWrapper>
              {Array.from({ length: starIcon }, (_, index) => (
                <span key={index}>⭐</span>
              ))}
            </StarWrapper>
          )}

          {price !== undefined && (
            <span>
              {price === String(0) ? (
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
