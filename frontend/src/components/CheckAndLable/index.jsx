import {
  CheckAndLabelContainer,
  CheckAndLabelWrapper,
  CheckBox,
  Label,
} from "./style";

export const CheckAndLabel = ({ id, text, checked, onChange }) => {
  return (
    <CheckAndLabelContainer className={checked ? "active" : ""}>
      <CheckAndLabelWrapper>
        <CheckBox
          type="checkbox"
          id={id}
          checked={checked}
          onChange={() => onChange(id)}
        />
        <Label htmlFor={id}>{text}</Label>
      </CheckAndLabelWrapper>
    </CheckAndLabelContainer>
  );
};
