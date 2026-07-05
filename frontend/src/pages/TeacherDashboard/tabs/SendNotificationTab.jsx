import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useTeacherActions } from '../../../features/teacher';
import { Button } from '../../../shared/components/Button';
import {
  Form, FieldGroup, Label, StyledInput, StyledTextarea, Note,
} from '../styles';

export default function SendNotificationTab() {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const { sendNotification, isSending } = useTeacherActions();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    sendNotification({ title: title.trim(), message: message.trim() }, {
      onSuccess: () => { setTitle(''); setMessage(''); },
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FieldGroup>
        <Label>{t('teacherDashboard.form.title')}</Label>
        <StyledInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('teacherDashboard.sendNotification.titlePlaceholder')} required />
      </FieldGroup>
      <FieldGroup>
        <Label>{t('teacherDashboard.form.message')}</Label>
        <StyledTextarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('teacherDashboard.sendNotification.bodyPlaceholder')} required />
      </FieldGroup>
      <Button type="submit" variant="primary" size="md" leftIcon={isSending ? <Loader2 size={16} /> : <Send size={16} />} isLoading={isSending} disabled={!title.trim() || !message.trim()}>
        {t('teacherDashboard.sendNotification.sendToStudents')}
      </Button>
      <Note>{t('teacherDashboard.sendNotification.hint')}</Note>
    </Form>
  );
}
