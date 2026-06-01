// src/shared/components/Button/index.jsx
import { StyledButton } from './Button.styles';
import { Spinner } from '../Spinner';



export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  ...props
}) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $loading={isLoading}
      $fullWidth={fullWidth}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <>
          {leftIcon && leftIcon}
          {children}
          {rightIcon && rightIcon}
        </>
      )}
    </StyledButton>
  );
}