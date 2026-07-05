import styled from 'styled-components';



export const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bgSecondary};
`;

export const CoverSection = styled.div`
  position: relative;
  height: 260px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, #1e1b4b 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
    z-index: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.55;
    z-index: 0;
  }

  ${({ theme }) => theme.media.maxMd} {
    height: 180px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${({ theme }) => `0 ${theme.spacing[6]} ${theme.spacing[12]}`};
  position: relative;
  z-index: 2;

  ${({ theme }) => theme.media.maxMd} {
    padding: ${({ theme }) => `0 ${theme.spacing[4]} ${theme.spacing[8]}`};
  }
`;

export const ProfileHeaderCard = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  margin-top: -80px;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;

  ${({ theme }) => theme.media.maxSm} {
    flex-direction: column;
    text-align: center;
    padding: ${({ theme }) => theme.spacing[6]};
    margin-top: -60px;
  }
`;

export const UserBrief = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[5]};

  ${({ theme }) => theme.media.maxSm} {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

export const AvatarWrapper = styled.div`
  width: 110px;
  height: 110px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 4px solid ${({ theme }) => theme.colors.bgPrimary};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    font-size: 40px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const UserName = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  ${({ theme }) => theme.media.maxSm} {
    justify-content: center;
    flex-direction: column;
    gap: 8px;
  }
`;

export const UserEmail = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  ${({ theme }) => theme.media.maxSm} {
    justify-content: center;
  }
`;

export const ActionArea = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: ${({ theme }) => theme.spacing[8]};

  ${({ theme }) => theme.media.maxMd} {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

export const MainPane = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`;

export const SidebarPane = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`;

export const DashboardCard = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2.5]};
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[5]};

  ${({ theme }) => theme.media.maxSm} {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: transparent;
    transition: background 0.3s;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.bgPrimary};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};

    &::before {
      background: ${({ theme }) => theme.colors.primary};
    }

    svg {
      transform: scale(1.1);
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  svg {
    transition: transform 0.3s ease, color 0.3s ease;
  }
`;

export const StatIconContainer = styled.div`
  width: 52px;
  height: 52px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

export const StatValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1;
`;

export const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const BioContainer = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  border-inline-start: 4px solid ${({ theme }) => theme.colors.primary};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

export const BioText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
  font-style: italic;
`;

export const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4.5]};
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing[3]} 0`};
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const DetailLabelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const DetailLabelText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export const DetailValueText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
`;

export const SecurityActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;