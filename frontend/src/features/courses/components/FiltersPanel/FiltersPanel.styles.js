import styled, { css } from 'styled-components';

export const PanelWrapper = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};

  ${({ theme }) => theme.media.maxMd} {
    display: ${({ $mobileOpen }) => $mobileOpen ? 'flex' : 'none'};
    position: fixed;
    inset: 0;
    z-index: 200;
    background: ${({ theme }) => theme.colors.bgPrimary};
    padding: ${({ theme }) => theme.spacing[6]};
    overflow-y: auto;
  }
`;

export const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const FilterLabel = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding-bottom: ${({ theme }) => theme.spacing[2]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const FilterOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1.5px solid transparent;
  background: transparent;
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-align: start;
  width: 100%;

  ${({ $active, theme }) => $active && css`
    background: ${theme.colors.primaryLight};
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
    font-weight: ${theme.typography.fontWeight.medium};
  `}

  &:hover:not([disabled]) {
    background: ${({ theme }) => theme.colors.bgTertiary};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const SortSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  outline: none;
  appearance: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const ClearButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1.5px solid ${({ theme }) => theme.colors.danger};
  background: ${({ theme }) => theme.colors.dangerLight};
  color: ${({ theme }) => theme.colors.danger};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  width: 100%;

  &:hover {
    opacity: 0.85;
  }
`;