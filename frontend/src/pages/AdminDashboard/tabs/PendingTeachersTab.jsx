import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useAdminActions, usePendingTeachers } from '../../../features/admin';
import {
  TableWrap, StyledTable, Th, Td, ActionsCell, ActionBtn,
  ConfirmGroup, ConfirmBtn, EmptyState, RowHover, SkeletonCard,
} from '../styles';

export default function PendingTeachersTab() {
  const { approveTeacher, rejectTeacher, isApproving, isRejecting } = useAdminActions();
  const { pendingTeachers, isLoading } = usePendingTeachers();
  const [confirm, setConfirm] = useState(null);
  const { t } = useLanguage();

  if (isLoading) return <SkeletonCard />;
  if (!pendingTeachers.length) return <EmptyState>{t('adminDashboard.empty.noPendingTeachers')}</EmptyState>;

  return (
    <TableWrap>
      <StyledTable>
        <thead><tr><Th>{t('adminDashboard.table.name')}</Th><Th>{t('adminDashboard.table.email')}</Th><Th>{t('adminDashboard.table.phone')}</Th><Th>{t('adminDashboard.table.cv')}</Th><Th>{t('adminDashboard.table.actions')}</Th></tr></thead>
        <tbody>
          {pendingTeachers.map((pt) => (
            <RowHover key={pt._id}>
              <Td>{pt.name}</Td>
              <Td>{pt.email}</Td>
              <Td>{pt.phone || '—'}</Td>
              <Td>{pt.cv ? <a href={pt.cv} target="_blank" rel="noreferrer">{t('adminDashboard.actions.view')}</a> : '—'}</Td>
              <ActionsCell>
                {confirm?.id === pt._id && confirm.type === 'approve' ? (
                  <ConfirmGroup>
                    <ConfirmBtn $variant="confirm" onClick={() => { approveTeacher(pt._id); setConfirm(null); }} disabled={isApproving}>
                      {isApproving ? <Loader2 size={13} /> : <Check size={13} />}
                    </ConfirmBtn>
                    <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                  </ConfirmGroup>
                ) : (
                  <ActionBtn $color="success" title={t('adminDashboard.actions.approve')} onClick={() => setConfirm({ type: 'approve', id: pt._id })}><Check size={16} /></ActionBtn>
                )}
                {confirm?.id === pt._id && confirm.type === 'reject' ? (
                  <ConfirmGroup>
                    <ConfirmBtn $variant="confirm" onClick={() => { rejectTeacher(pt._id); setConfirm(null); }} disabled={isRejecting}>
                      {isRejecting ? <Loader2 size={13} /> : <X size={13} />}
                    </ConfirmBtn>
                    <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                  </ConfirmGroup>
                ) : (
                  <ActionBtn $color="danger" title={t('adminDashboard.actions.reject')} onClick={() => setConfirm({ type: 'reject', id: pt._id })}><X size={16} /></ActionBtn>
                )}
              </ActionsCell>
            </RowHover>
          ))}
        </tbody>
      </StyledTable>
    </TableWrap>
  );
}
