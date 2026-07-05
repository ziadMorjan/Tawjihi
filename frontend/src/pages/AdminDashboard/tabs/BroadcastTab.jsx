import { useState } from 'react';
import { Send, Loader2, Clock } from 'lucide-react';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useAdminActions } from '../../../features/admin';
import { adminApi } from '../../../features/admin';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../../shared/components/Button';
import { getNotificationTypeConfig } from '../../../features/notifications/utils/notificationTypes';
import {
  Form, FieldGroup, Label, StyledInput, StyledTextarea, Select,
  SectionTitle, PreviewCard, PreviewIcon, PreviewContent,
  PreviewTitle, PreviewBody, HistoryCard, HistoryIcon, HistoryContent,
  HistoryTitle, HistoryBody, HistoryTime,
} from '../styles';

export default function BroadcastTab() {
  const { broadcastNotification, broadcastToSpecific, isBroadcasting } = useAdminActions();
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [recipientType, setRecipientType] = useState('all_students');
  const [notifType, setNotifType] = useState('message');
  const [sentHistory, setSentHistory] = useState([]);

  const { data: allTeachers } = useQuery({
    queryKey: ['all-teacher-ids'],
    queryFn: adminApi.getAllTeacherIds,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: recipientType === 'all_teachers' || recipientType === 'everyone',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const payload = { title: title.trim(), body: body.trim(), type: notifType };

    const addToHistory = () => {
      setSentHistory((prev) => [{ ...payload, sentAt: new Date().toISOString() }, ...prev].slice(0, 5));
      setTitle('');
      setBody('');
    };

    if (recipientType === 'all_students') {
      broadcastNotification(payload, { onSuccess: addToHistory });
    } else if (recipientType === 'all_teachers') {
      if (!allTeachers?.length) return;
      broadcastToSpecific({ ...payload, recipients: allTeachers }, { onSuccess: addToHistory });
    } else if (recipientType === 'everyone') {
      const uData = await adminApi.getAllUsers();
      const tData = allTeachers || [];
      const allIds = [...(uData?.map((u) => u._id) || []), ...tData];
      if (!allIds.length) return;
      broadcastToSpecific({ ...payload, recipients: allIds }, { onSuccess: addToHistory });
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FieldGroup>
          <Label>{t('adminDashboard.form.title')}</Label>
          <StyledInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('adminDashboard.broadcast.titlePlaceholder')} required />
        </FieldGroup>
        <FieldGroup>
          <Label>{t('adminDashboard.form.message')}</Label>
          <StyledTextarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={t('adminDashboard.broadcast.bodyPlaceholder')} required />
        </FieldGroup>
        <FieldGroup>
          <Label>{t('adminDashboard.broadcast.recipients')}</Label>
          <Select value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
            <option value="all_students">{t('adminDashboard.broadcast.allStudents')}</option>
            <option value="all_teachers">{t('adminDashboard.broadcast.allTeachers')}</option>
            <option value="everyone">{t('adminDashboard.broadcast.everyone')}</option>
          </Select>
        </FieldGroup>
        <FieldGroup>
          <Label>{t('adminDashboard.broadcast.notifType')}</Label>
          <Select value={notifType} onChange={(e) => setNotifType(e.target.value)}>
            <option value="message">{t('notifications.types.message')}</option>
            <option value="course">{t('notifications.types.course')}</option>
            <option value="news">{t('notifications.types.news')}</option>
          </Select>
        </FieldGroup>
        <Button type="submit" variant="primary" size="md" leftIcon={isBroadcasting ? <Loader2 size={16} /> : <Send size={16} />} isLoading={isBroadcasting} disabled={!title.trim() || !body.trim()}>
          {t('adminDashboard.broadcast.sendButton')}
        </Button>
      </Form>

      <SectionTitle style={{ marginTop: 32 }}>{t('adminDashboard.broadcast.previewTitle')}</SectionTitle>
      {(() => {
        const config = getNotificationTypeConfig(notifType);
        const Icon = config.icon;
        return (
          <PreviewCard>
            <PreviewIcon $color={config.color}><Icon /></PreviewIcon>
            <PreviewContent>
              <PreviewTitle>{title || t('adminDashboard.broadcast.previewPlaceholder')}</PreviewTitle>
              {body && <PreviewBody>{body}</PreviewBody>}
            </PreviewContent>
          </PreviewCard>
        );
      })()}

      {sentHistory.length > 0 && (
        <>
          <SectionTitle style={{ marginTop: 32 }}>{t('adminDashboard.broadcast.sentHistory')}</SectionTitle>
          {sentHistory.map((h, i) => {
            const cfg = getNotificationTypeConfig(h.type);
            const HIcon = cfg.icon;
            return (
              <HistoryCard key={i}>
                <HistoryIcon $color={cfg.color}><HIcon /></HistoryIcon>
                <HistoryContent>
                  <HistoryTitle>{h.title}</HistoryTitle>
                  {h.body && <HistoryBody>{h.body}</HistoryBody>}
                  <HistoryTime><Clock size={12} /> {new Date(h.sentAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</HistoryTime>
                </HistoryContent>
              </HistoryCard>
            );
          })}
        </>
      )}
    </>
  );
}
