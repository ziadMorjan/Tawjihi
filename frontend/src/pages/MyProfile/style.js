import styled from "styled-components";

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const HeaderSection = styled.div`
  position: relative;
  height: 12rem;
  background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%);
  overflow: hidden;

  @media (min-width: 768px) {
    height: 16rem;
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.2;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
`;

const ProfileSection = styled.div`
  position: relative;
  padding: 0 1rem;
  margin-top: -4rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const MaxWidthContainer = styled.div`
  max-width: 56rem;
  margin: 0 auto;
`;

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
`;

const ProfileContent = styled.div`
  padding: 1.5rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const UserDetails = styled.div``;

const UserName = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0f172a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.875rem;
  }
`;

const UserEmail = styled.p`
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.25rem 0;
`;

const RoleBadge = styled.span`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: #f1f5f9;
  color: #475569;
  font-size: 0.875rem;
  border-radius: 9999px;
  font-weight: 500;
`;

const EditButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: linear-gradient(90deg, #1d4ed8 0%, #7c3aed 100%);
    transform: translateY(-1px);
  }
`;

const SectionCard = styled.div`
  margin-top: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const SectionContent = styled.div`
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #0f172a;
  margin: 0 0 1rem 0;
`;

const SectionDescription = styled.p`
  color: #64748b;
  margin: 0 0 1.5rem 0;
`;

const AboutText = styled.p`
  color: #374151;
  line-height: 1.625;
  margin: 0;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f8fafc;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const DetailIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
`;

const DetailContent = styled.div``;

const DetailLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin: 0;
`;

const DetailValue = styled.p`
  font-weight: 600;
  color: #0f172a;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const StatContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatInfo = styled.div``;

const StatLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin: 0 0 0.25rem 0;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0f172a;
  margin: 0;
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${(props) => props.color}1a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const StatBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0.25rem;
  background-color: ${(props) => props.color};
`;

const LastCard = styled(SectionCard)`
  margin-bottom: 2rem;
`;




///////////////////////////////////////////////
const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #0f172a;
  margin: 0 0 0.5rem 0;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.125rem;
  margin: 0;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Form = styled.form`
  padding: 2rem;

  @media (min-width: 768px) {
    padding: 3rem;
  }
`;

const ProfileImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
`;

const ProfileImageContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const ProfileImage = styled.img`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ImageUploadOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;

  ${ProfileImage}:hover + & {
    opacity: 1;
  }
`;

const UploadIcon = styled.div`
  color: white;
  font-size: 1.5rem;
`;

const ImageUploadText = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  text-align: center;
  margin: 0;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  &.full-width {
    @media (min-width: 768px) {
      grid-column: span 2;
    }
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:invalid {
    border-color: #ef4444;
  }

  &[aria-invalid="true"] {
    border-color: #ef4444;
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &[aria-invalid="true"] {
    border-color: #ef4444;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  resize: vertical;
  min-height: 6rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &[aria-invalid="true"] {
    border-color: #ef4444;
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: "⚠️";
    font-size: 0.75rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const SaveButton = styled.button`
  flex: 1;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.875rem 2rem;
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  font-size: 1.25rem;
  padding: 0.25rem;

  &:hover {
    color: #374151;
  }
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;


export {
  Container,
  HeaderSection,
  CoverImage,
  Overlay,
  ProfileSection,
  MaxWidthContainer,
  ProfileCard,
  ProfileContent,
  ProfileHeader,
  AvatarContainer,
  Avatar,
  AvatarImage,
  ProfileInfo,
  UserDetails,
  UserName,
  UserEmail,
  RoleBadge,
  EditButton,
  SectionCard,
  SectionContent,
  SectionTitle,
  SectionDescription,
  AboutText,
  DetailsGrid,
  DetailItem,
  DetailIcon,
  DetailContent,
  DetailLabel,
  DetailValue,
  StatsGrid,
  StatCard,
  StatContent,
  StatInfo,
  StatLabel,
  StatValue,
  StatIcon,
  StatBar,
  LastCard,
  Header,
  Title,
  Subtitle,
  FormCard,
  Form,
  ProfileImageSection,
  ProfileImageContainer,
  ProfileImage,
  ImageUploadOverlay,
  UploadIcon,
  ImageUploadText,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Select,
  TextArea,
  ErrorText,
  ButtonGroup,
  SaveButton,
  CancelButton,
  HiddenInput,
  PasswordToggle,
  InputContainer
};
