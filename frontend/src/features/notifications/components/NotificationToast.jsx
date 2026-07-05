import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getNotificationTypeConfig } from '../utils/notificationTypes';
import {
  Container, ToastWrap, ProgressBar, IconCircle,
  Content, ToastTitle, ToastBody, CloseBtn,
} from './NotificationToast.styles';

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
