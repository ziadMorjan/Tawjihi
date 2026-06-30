import { useState, useRef, useCallback, useEffect } from 'react';
import { useNotifications } from './useNotifications';

export function useNotificationToasts() {
  const { notifications } = useNotifications();
  const [toasts, setToasts] = useState([]);
  const lastIdRef = useRef(null);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!notifications.length) return;

    const firstId = notifications[0]._id;
    if (!lastIdRef.current) {
      lastIdRef.current = firstId;
      return;
    }

    if (firstId !== lastIdRef.current) {
      const newOnes = [];
      for (const n of notifications) {
        if (n._id === lastIdRef.current) break;
        newOnes.push(n);
      }
      lastIdRef.current = firstId;

      if (newOnes.length) {
        setToasts((prev) => [
          ...newOnes.map((n) => ({
            id: n._id,
            title: n.title,
            body: n.body,
            type: n.type,
            createdAt: Date.now(),
          })),
          ...prev,
        ].slice(0, 5));
      }
    }
  }, [notifications]);

  return { toasts, dismiss };
}
