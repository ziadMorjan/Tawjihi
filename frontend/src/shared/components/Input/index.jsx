// src/shared/components/Input/index.jsx
import {
  InputWrapper,
  Label,
  InputContainer,
  StyledInput,
  IconWrapper,
  ErrorMessage,
  HelperText,
} from './Input.styles';

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  id,
  ...props
}) {
  return (
    <InputWrapper>
      {label && <Label htmlFor={id}>{label}</Label>}

      <InputContainer>
        {leftIcon && (
          <IconWrapper $position="left">{leftIcon}</IconWrapper>
        )}

        <StyledInput
          id={id}
          $hasError={!!error}
          $hasLeftIcon={!!leftIcon}
          $hasRightIcon={!!rightIcon}
          {...props}
        />

        {rightIcon && (
          <IconWrapper $position="right">{rightIcon}</IconWrapper>
        )}
      </InputContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputWrapper>
  );
}