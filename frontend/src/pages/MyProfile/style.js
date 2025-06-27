import styled from "styled-components";

export const TeacherProfileWrapper = styled.div`
  hr {
    width: 60%;
    margin: 30px auto;
    border-color: rgba(0, 0, 0, 0.13);
  }

  .img-sec {
    > div {
      padding: 20px 0;
      display: flex;
      gap: 3%;
      align-items: center;

      @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
      }

      img {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        box-shadow: 0 0 14px 5px rgba(0, 123, 255, 0.3);
        border: none;
        object-fit: cover;
        transition: box-shadow 0.3s ease;
        cursor: default;

        &:hover {
          box-shadow: 0 0 14px 11px rgba(0, 123, 255, 0.3);
        }
      }

      div {
        display: flex;
        flex-direction: column;
        justify-content: center;

        @media (max-width: 768px) {
          margin-top: 15px;
        }

        h2 {
          color: var(--color-link);
          font-size: 23px;
          margin-bottom: 8px;
        }

        p {
          margin: 2px 0;
          color: var(--color-text);
          font-size: 16px;
        }
      }
    }
  }

  section {
    padding: 20px 10px;

    h3 {
      color: var(--color-link-hover);
      font-size: 22px;
      margin-bottom: 20px;
    }
  }

  .about-sec {
    p {
      font-size: 15px;
      max-width: 650px;
      margin: 0 auto;
      line-height: 1.5;
    }
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 10px;

  div {
    background-color: #fafafa;
    padding: 15px 20px;
    border-radius: 10px;
    border: 1px solid #ddd;

    strong {
      display: block;
      color: var(--color-link);
      font-weight: 600;
      margin-bottom: 5px;
    }

    span {
      font-size: 15px;
      color: var(--color-text);
    }
  }
`;

export const EditButton = styled.button`
  margin-top: 12px;
  padding: 10px 18px;
  background-color: var(--color-link);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  width: max-content;
  transition: background-color 0.3s ease;

  &:hover,
  &:focus-visible {
    background-color: var(--color-link-hover);
    outline: none;
  }
`;

export const EditProfileWrapper = styled.div`
  padding: 40px 0;
  background-color: #fdfdfd;
`;

export const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;

  label {
    font-weight: 600;
    display: flex;
    flex-direction: column;

    input,
    textarea {
      margin-top: 8px;
      padding: 10px;
      font-size: 14px;
      border-radius: 8px;
      border: 1px solid #ccc;
      transition: border-color 0.2s ease;

      &:focus {
        outline: 2px solid var(--color-link);
        border-color: var(--color-link);
      }
    }

    span {
      color: red;
      font-size: 12px;
      margin-top: 5px;
    }
  }
`;

export const SaveButton = styled.button`
  padding: 12px;
  background-color: var(--color-link);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background-color: var(--color-link-hover);
    outline: none;
  }
`;

export const UploadImg = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin: 0 auto;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.4);
  transition: box-shadow 0.3s ease;

  &:hover,
  &:focus-visible {
    box-shadow: 0 0 12px rgba(0, 123, 255, 0.6);
    outline: none;
  }
`;

export const ErrorText = styled.span`
  color: red;
  font-size: 12px;
  margin-top: 5px;
  display: block;
`;
