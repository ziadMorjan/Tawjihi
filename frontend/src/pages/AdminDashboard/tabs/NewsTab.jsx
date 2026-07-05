import { useState } from 'react';
import { Plus, Check, X, Loader2, Edit3, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useAdminActions, useNews } from '../../../features/admin';
import { Button } from '../../../shared/components/Button';
import {
  ModalOverlay, ModalContent, ModalTitle,
  Form, FieldGroup, Label, StyledInput, StyledTextarea,
  NewsCard, NewsImg, NewsContent, NewsTitle, NewsBody,
  ConfirmGroup, ConfirmBtn, ActionBtn,
  EmptyState, SkeletonCard,
} from '../styles';

export default function NewsTab() {
  const { createNews, updateNews, deleteNews, isCreatingNews, isUpdatingNews, isDeletingNews } = useAdminActions();
  const { news, isLoading } = useNews();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [editNews, setEditNews] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const { t } = useLanguage();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const fd = new FormData();
    fd.append('title', title.trim());
    fd.append('body', content.trim());
    if (file) fd.append('coverImage', file);
    createNews(fd, { onSuccess: () => { setTitle(''); setContent(''); setFile(null); } });
  };

  const openEdit = (n) => {
    setEditNews(n);
    setEditTitle(n.title);
    setEditContent(n.body);
    setEditFile(null);
  };

  const handleSave = () => {
    const fd = new FormData();
    fd.append('title', editTitle.trim());
    fd.append('body', editContent.trim());
    if (editFile) fd.append('coverImage', editFile);
    updateNews({ id: editNews._id, formData: fd }, { onSuccess: () => setEditNews(null) });
  };

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      {editNews && (
        <ModalOverlay onClick={() => setEditNews(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{t('adminDashboard.news.editTitle')}</ModalTitle>
            <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <FieldGroup><Label>{t('adminDashboard.form.title')}</Label><StyledInput value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required /></FieldGroup>
              <FieldGroup><Label>{t('adminDashboard.form.content')}</Label><StyledTextarea value={editContent} onChange={(e) => setEditContent(e.target.value)} required /></FieldGroup>
              <FieldGroup><Label>{t('adminDashboard.form.imageOptional')}</Label><StyledInput type="file" accept="image/*" onChange={(e) => setEditFile(e.target.files[0] || null)} /></FieldGroup>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="submit" variant="primary" size="sm" isLoading={isUpdatingNews} disabled={!editTitle.trim() || !editContent.trim()}>{t('adminDashboard.actions.save')}</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditNews(null)}>{t('adminDashboard.actions.cancel')}</Button>
              </div>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      <Form onSubmit={handleAdd} style={{ marginBottom: 24 }}>
        <FieldGroup>
          <Label>{t('adminDashboard.form.title')}</Label>
          <StyledInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الخبر" required />
        </FieldGroup>
        <FieldGroup>
          <Label>{t('adminDashboard.form.content')}</Label>
          <StyledTextarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="نص الخبر" required />
        </FieldGroup>
        <FieldGroup>
          <Label>{t('adminDashboard.form.imageOptional')}</Label>
          <StyledInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
        </FieldGroup>
        <Button type="submit" variant="primary" size="sm" leftIcon={isCreatingNews ? <Loader2 size={14} /> : <Plus size={14} />} isLoading={isCreatingNews} disabled={!title.trim() || !content.trim()}>{t('adminDashboard.news.addButton')}</Button>
      </Form>
      {news.length === 0 && <EmptyState>{t('adminDashboard.empty.noNews')}</EmptyState>}
      {news.map((n) => (
        <NewsCard key={n._id}>
          {n.coverImage && <NewsImg src={n.coverImage} alt="" />}
          <NewsContent>
            <NewsTitle>{n.title}</NewsTitle>
            <NewsBody>{n.body}</NewsBody>
          </NewsContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ActionBtn $color="primary" title={t('adminDashboard.actions.edit')} onClick={() => openEdit(n)}><Edit3 size={16} /></ActionBtn>
            {confirm === n._id ? (
              <ConfirmGroup>
                <ConfirmBtn $variant="confirm" onClick={() => { deleteNews(n._id); setConfirm(null); }} disabled={isDeletingNews}>
                  {isDeletingNews ? <Loader2 size={13} /> : <Check size={13} />}
                </ConfirmBtn>
                <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
              </ConfirmGroup>
            ) : (
              <ActionBtn $color="danger" title={t('adminDashboard.actions.delete')} onClick={() => setConfirm(n._id)}><Trash2 size={16} /></ActionBtn>
            )}
          </div>
        </NewsCard>
      ))}
    </div>
  );
}
