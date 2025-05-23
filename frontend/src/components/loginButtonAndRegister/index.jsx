// style
import { ButtonLogin } from "./style";

export const LoginAndRegisterButton = ({
  fontSize,
  color,
  children,
  onClick,
}) => {
  return (
    <div>
      <ButtonLogin onClick={onClick} style={{ color, fontSize }}>
        {children}
      </ButtonLogin>
    </div>
  );
};
