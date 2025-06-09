import {
  CheckAndLabelContainer,
  CheckAndLabelWrapper,
  CheckBox,
  Label,
} from "./style";

export const CheckAndLabel = ({ text, id, onChange }) => {
  return (
    <CheckAndLabelContainer>
      <CheckAndLabelWrapper>
        <CheckBox type="checkbox" id={id} onChange={onChange} />
        <Label htmlFor={id}>{text}</Label>
      </CheckAndLabelWrapper>
    </CheckAndLabelContainer>
  );
};
