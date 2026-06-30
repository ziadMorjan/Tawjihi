import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { X } from 'lucide-react';
import { getNotificationTypeConfig } from '../utils/notificationTypes';

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(100px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const slideOut = keyframes`
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(100px); }
`;

const Container = styled.div`
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

const ToastWrap = styled.div`
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

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${({ theme, $color }) => theme.colors[$color]};
  transition: width 0.1s linear;
`;

const IconCircle = styled.div`
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

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const ToastTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ToastBody = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
`;

const CloseBtn = styled.button`
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

const DURATION = 6000;

function ToastItem({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const config = getNotificationTypeConfig(toast.type);
  const Icon = config.icon;

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(pct);
      if (elapsed >= DURATION) {
        clearInterval(interval);
        setExiting(true);
        setTimeout(() => onDismiss(toast.id), 250);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [toast.id, onDismiss]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 250);
  };

  return (
    <ToastWrap $exiting={exiting}>
      <IconCircle $color={config.color}>
        <Icon />
      </IconCircle>
      <Content>
        <ToastTitle>{toast.title}</ToastTitle>
        {toast.body && <ToastBody>{toast.body}</ToastBody>}
      </Content>
      <CloseBtn onClick={handleClose}><X size={14} /></CloseBtn>
      <ProgressBar $color={config.color} style={{ width: `${progress}%` }} />
    </ToastWrap>
  );
}

export function NotificationToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <Container>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </Container>
  );
}
