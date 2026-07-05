import { useState } from 'react';
import { Plus, Check, X, Loader2, Edit3, Trash2, Save, XCircle } from 'lucide-react';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useAdminActions, useBranches, useSubjects } from '../../../features/admin';
import { Button } from '../../../shared/components/Button';
import {
  InlineForm, StyledInput, StyledInput as Input,
  Select, ListCard, ConfirmGroup, ConfirmBtn, ActionBtn,
  EmptyState, SkeletonCard,
} from '../styles';

export default function SubjectsTab() {
  const { createSubject, updateSubject, deleteSubject, isCreatingSubject, isUpdatingSubject, isDeletingSubject } = useAdminActions();
  const { subjects, isLoading } = useSubjects();
  const { branches } = useBranches();
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editBranch, setEditBranch] = useState('');
  const [confirm, setConfirm] = useState(null);
  const { t } = useLanguage();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createSubject({ name: name.trim(), branch: branch || undefined }, { onSuccess: () => { setName(''); setBranch(''); } });
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setEditName(s.name);
    setEditBranch(s.branch?._id || '');
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    updateSubject({ id: editingId, name: editName.trim(), branch: editBranch || undefined }, { onSuccess: () => setEditingId(null) });
  };

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      <InlineForm as="form" onSubmit={handleAdd}>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('adminDashboard.form.subjectName')} required />
        <Select value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="">{t('adminDashboard.form.noBranch')}</option>
          {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </Select>
        <Button type="submit" variant="primary" size="sm" leftIcon={isCreatingSubject ? <Loader2 size={14} /> : <Plus size={14} />} isLoading={isCreatingSubject} disabled={!name.trim()}>{t('adminDashboard.actions.add')}</Button>
      </InlineForm>
      {subjects.length === 0 && <EmptyState>{t('adminDashboard.empty.noSubjects')}</EmptyState>}
      {subjects.map((s) => (
        <ListCard key={s._id}>
          {editingId === s._id ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <StyledInput value={editName} onChange={(e) => setEditName(e.target.value)} style={{ flex: 1 }} autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingId(null); }} />
              <Select value={editBranch} onChange={(e) => setEditBranch(e.target.value)} style={{ width: 140 }}>
                <option value="">{t('adminDashboard.form.noBranch')}</option>
                {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
              </Select>
              <ConfirmBtn $variant="confirm" onClick={saveEdit} disabled={isUpdatingSubject || !editName.trim()}>
                {isUpdatingSubject ? <Loader2 size={13} /> : <Save size={13} />}
              </ConfirmBtn>
              <ConfirmBtn $variant="cancel" onClick={() => setEditingId(null)}><XCircle size={13} /></ConfirmBtn>
            </div>
          ) : (
            <>
              <span style={{ cursor: 'pointer' }} onClick={() => startEdit(s)}>
                {s.name} {s.branch?.name ? <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>({s.branch?.name})</span> : ''}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <ActionBtn $color="primary" title={t('adminDashboard.actions.edit')} onClick={() => startEdit(s)}><Edit3 size={16} /></ActionBtn>
                {confirm === s._id ? (
                  <ConfirmGroup>
                    <ConfirmBtn $variant="confirm" onClick={() => { deleteSubject(s._id); setConfirm(null); }} disabled={isDeletingSubject}>
                      {isDeletingSubject ? <Loader2 size={13} /> : <Check size={13} />}
                    </ConfirmBtn>
                    <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                  </ConfirmGroup>
                ) : (
                  <ActionBtn $color="danger" title={t('adminDashboard.actions.delete')} onClick={() => setConfirm(s._id)}><Trash2 size={16} /></ActionBtn>
                )}
              </div>
            </>
          )}
        </ListCard>
      ))}
    </div>
  );
}
