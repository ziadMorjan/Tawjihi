import { useState } from 'react';
import { Plus, Check, X, Loader2, Edit3, Trash2, Save, XCircle } from 'lucide-react';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useAdminActions, useBranches } from '../../../features/admin';
import { Button } from '../../../shared/components/Button';
import {
  InlineForm, StyledInput, StyledInput as Input, ListCard,
  ConfirmGroup, ConfirmBtn, ActionBtn, EmptyState, SkeletonCard,
} from '../styles';

export default function BranchesTab() {
  const { createBranch, updateBranch, deleteBranch, isCreatingBranch, isUpdatingBranch, isDeletingBranch } = useAdminActions();
  const { branches, isLoading } = useBranches();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [confirm, setConfirm] = useState(null);
  const { t } = useLanguage();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createBranch(name.trim(), { onSuccess: () => setName('') });
  };

  const startEdit = (b) => {
    setEditingId(b._id);
    setEditName(b.name);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    updateBranch({ id: editingId, name: editName.trim() }, { onSuccess: () => setEditingId(null) });
  };

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      <InlineForm as="form" onSubmit={handleAdd}>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('adminDashboard.form.branchName')} required style={{ flex: 1 }} />
        <Button type="submit" variant="primary" size="sm" leftIcon={isCreatingBranch ? <Loader2 size={14} /> : <Plus size={14} />} isLoading={isCreatingBranch} disabled={!name.trim()}>{t('adminDashboard.actions.add')}</Button>
      </InlineForm>
      {branches.length === 0 && <EmptyState>{t('adminDashboard.empty.noBranches')}</EmptyState>}
      {branches.map((b) => (
        <ListCard key={b._id}>
          {editingId === b._id ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <StyledInput value={editName} onChange={(e) => setEditName(e.target.value)} style={{ flex: 1 }} autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingId(null); }} />
              <ConfirmBtn $variant="confirm" onClick={saveEdit} disabled={isUpdatingBranch || !editName.trim()}>
                {isUpdatingBranch ? <Loader2 size={13} /> : <Save size={13} />}
              </ConfirmBtn>
              <ConfirmBtn $variant="cancel" onClick={() => setEditingId(null)}><XCircle size={13} /></ConfirmBtn>
            </div>
          ) : (
            <>
              <span style={{ cursor: 'pointer' }} onClick={() => startEdit(b)}>{b.name}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <ActionBtn $color="primary" title={t('adminDashboard.actions.edit')} onClick={() => startEdit(b)}><Edit3 size={16} /></ActionBtn>
                {confirm === b._id ? (
                  <ConfirmGroup>
                    <ConfirmBtn $variant="confirm" onClick={() => { deleteBranch(b._id); setConfirm(null); }} disabled={isDeletingBranch}>
                      {isDeletingBranch ? <Loader2 size={13} /> : <Check size={13} />}
                    </ConfirmBtn>
                    <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                  </ConfirmGroup>
                ) : (
                  <ActionBtn $color="danger" title={t('adminDashboard.actions.delete')} onClick={() => setConfirm(b._id)}><Trash2 size={16} /></ActionBtn>
                )}
              </div>
            </>
          )}
        </ListCard>
      ))}
    </div>
  );
}
