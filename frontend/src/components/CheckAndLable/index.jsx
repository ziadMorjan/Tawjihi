//style
import {
  CheckAndLabelContainer,
  CheckAndLabelWrapper,
  CheckBox,
  Label,
} from "./style";

export const CheckAndLabel = ({ text, id }) => {
  return (
    <CheckAndLabelContainer>
      <CheckAndLabelWrapper>
        <CheckBox type="checkbox" id={id} />
        <Label htmlFor={id}>{text}</Label>
      </CheckAndLabelWrapper>
    </CheckAndLabelContainer>
  );
};
