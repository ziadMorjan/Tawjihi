// CheckAndLabel.js
import {
  CheckAndLabelContainer,
  CheckAndLabelWrapper,
  HiddenCheckBox,
  StyledLabel,
} from "./style";

export const CheckAndLabel = ({ text, id, onChange }) => {
  return (
    <CheckAndLabelContainer>
      <CheckAndLabelWrapper>
        <HiddenCheckBox type="checkbox" id={id} onChange={onChange} />
        <StyledLabel htmlFor={id}>{text}</StyledLabel>
      </CheckAndLabelWrapper>
    </CheckAndLabelContainer>
  );
};
