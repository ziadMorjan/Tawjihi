// src/shared/components/Input/index.jsx
import { forwardRef } from 'react';
import {
  InputWrapper, Label, InputContainer,
  StyledInput, IconWrapper, ErrorMessage, HelperText,
} from './Input.styles';

export const Input = forwardRef(function Input({
  label, error, helperText,
  leftIcon, rightIcon, id, ...props
}, ref) {
  return (
    <InputWrapper>
      {label && <Label htmlFor={id}>{label}</Label>}

      <InputContainer>
        {leftIcon && <IconWrapper $position="left">{leftIcon}</IconWrapper>}

        <StyledInput
          id={id}
          ref={ref}          // ← هذا هو الإصلاح
          $hasError={!!error}
          $hasLeftIcon={!!leftIcon}
          $hasRightIcon={!!rightIcon}
          {...props}
        />

        {rightIcon && <IconWrapper $position="right">{rightIcon}</IconWrapper>}
      </InputContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputWrapper>
  );
});