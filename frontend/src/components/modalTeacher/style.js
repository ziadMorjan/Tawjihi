import styled from "styled-components";

export const ModalDiv = styled.div`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%);
z-index: 10000;
  width: 60%;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  transition: all 0.5s;
&.show{
top: 0%;
left: 50%;
}

&.hide{
top: 0%;
left: -150%;
}
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

export const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
`;

export const Button = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100px;
  font-size: 18px;
`;

export const CancelButton = styled(Button)`
  background-color: #ccc;
  color: black;
`;

export const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;


