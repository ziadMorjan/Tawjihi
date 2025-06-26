//style
import {
  AvatarCircle,
  ReviewCard,
  ReviewContent,
  ReviewerName,
  ReviewHeader,
  ReviewList,
  ReviewText,
} from "./style";

//component
import { StarRating } from "../Star/starRating";

const ReviewListSection = () => (
  <ReviewList>
    <ReviewCard>
      <AvatarCircle>أ</AvatarCircle>
      <ReviewContent>
        <ReviewHeader>
          <ReviewerName>أحمد خالد</ReviewerName>
        </ReviewHeader>
        <ReviewText>
          دورة ممتازة جدًا، استفدت منها كثيرًا والمحتوى كان واضح ومنظم.
        </ReviewText>
      </ReviewContent>
    </ReviewCard>

    <ReviewCard>
      <AvatarCircle>ل</AvatarCircle>
      <ReviewContent>
        <ReviewHeader>
          <ReviewerName>ليلى محمد</ReviewerName>
        </ReviewHeader>
        <ReviewText>شرح رائع وأسلوب سهل، أنصح بها للمبتدئين.</ReviewText>
      </ReviewContent>
    </ReviewCard>
  </ReviewList>
);

export default ReviewListSection;
