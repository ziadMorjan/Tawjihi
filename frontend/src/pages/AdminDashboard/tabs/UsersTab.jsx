import { useState } from 'react';
import { Check, X, Loader2, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useAdminActions, useAllUsers } from '../../../features/admin';
import {
  TableWrap, StyledTable, Th, Td, ActionsCell, ActionBtn,
  ConfirmGroup, ConfirmBtn, EmptyState, RowHover, SkeletonCard, StyledInput,
} from '../styles';
import { formatDate } from '../helpers';

export default function UsersTab() {
  const { deleteUser, isDeletingUser } = useAdminActions();
  const { users, isLoading } = useAllUsers();
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);
  const { t } = useLanguage();

  const filtered = search
    ? users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
    : users;

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <StyledInput
          placeholder={t('adminDashboard.search.users')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      {!filtered.length ? (
        <EmptyState>{search ? t('adminDashboard.empty.noSearchResults') : t('adminDashboard.empty.noUsers')}</EmptyState>
      ) : (
        <TableWrap>
          <StyledTable>
            <thead><tr><Th>{t('adminDashboard.table.image')}</Th><Th>{t('adminDashboard.table.name')}</Th><Th>{t('adminDashboard.table.email')}</Th><Th>{t('adminDashboard.table.phone')}</Th><Th>{t('adminDashboard.table.joinDate')}</Th><Th>{t('adminDashboard.table.actions')}</Th></tr></thead>
            <tbody>
              {filtered.map((u) => (
                <RowHover key={u._id}>
                  <Td>
                    {u.coverImage ? <img src={u.coverImage} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} /> : '—'}
                  </Td>
                  <Td>{u.name}</Td>
                  <Td>{u.email}</Td>
                  <Td>{u.phone || '—'}</Td>
                  <Td>{formatDate(u.createdAt)}</Td>
                  <ActionsCell>
                    {confirm === u._id ? (
                      <ConfirmGroup>
                        <ConfirmBtn $variant="confirm" onClick={() => { deleteUser(u._id); setConfirm(null); }} disabled={isDeletingUser}>
                          {isDeletingUser ? <Loader2 size={13} /> : <Check size={13} />}
                        </ConfirmBtn>
                        <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                      </ConfirmGroup>
                    ) : (
                      <ActionBtn $color="danger" title={t('adminDashboard.actions.delete')} onClick={() => setConfirm(u._id)}><Trash2 size={16} /></ActionBtn>
                    )}
                  </ActionsCell>
                </RowHover>
              ))}
            </tbody>
          </StyledTable>
        </TableWrap>
      )}
    </div>
  );
}
