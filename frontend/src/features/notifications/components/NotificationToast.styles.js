import styled, { keyframes } from 'styled-components';

export const slideIn = keyframes`
  from { opacity: 0; transform: translateX(100px); }
  to   { opacity: 1; transform: translateX(0); }
`;

export const slideOut = keyframes`
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(100px); }
`;

export const Container = styled.div`
  position: fixed;
  top: 80px;
  left: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  max-width: 360px;
  width: 100%;
  pointer-events: none;
`;

export const ToastWrap = styled.div`
  pointer-events: auto;
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[3]};
  animation: ${({ $exiting }) => ($exiting ? slideOut : slideIn)} 0.25s ease forwards;
  overflow: hidden;
  position: relative;
`;

export const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${({ theme, $color }) => theme.colors[$color]};
  transition: width 0.1s linear;
`;

export const IconCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme, $color }) => theme.colors[$color] + '15'};
  color: ${({ theme, $color }) => theme.colors[$color]};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg { width: 16px; height: 16px; }
`;

export const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ToastTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ToastBody = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
`;

export const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 2px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  &:hover {
    background: ${({ theme }) => theme.colors.bgSecondary};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
