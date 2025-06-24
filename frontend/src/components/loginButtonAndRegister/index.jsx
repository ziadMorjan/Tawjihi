// style
import { ButtonLogin } from "./style";

export const LoginAndRegisterButton = ({
  fontSize,
  color,
  children,
  onClick,
  isDisabled
}) => {
  return (
    <div>
      <ButtonLogin onClick={onClick} style={{ color, fontSize }} disabled={isDisabled}>
        {children}
      </ButtonLogin>
    </div>
  );
};
