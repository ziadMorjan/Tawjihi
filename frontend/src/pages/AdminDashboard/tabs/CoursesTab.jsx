import { useState } from 'react';
import { Check, X, Loader2, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useAdminActions, useAllCourses } from '../../../features/admin';
import {
  TableWrap, StyledTable, Th, Td, ActionsCell, ActionBtn,
  ConfirmGroup, ConfirmBtn, EmptyState, RowHover, SkeletonCard,
  StyledInput, Badge, OldPrice,
} from '../styles';
import { formatPrice } from '../helpers';

export default function CoursesTab() {
  const { deleteCourse, isDeletingCourse } = useAdminActions();
  const { courses, isLoading } = useAllCourses();
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);
  const { t } = useLanguage();

  const filtered = search
    ? courses.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()) || c.teacher?.name?.toLowerCase().includes(search.toLowerCase()))
    : courses;

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <StyledInput
          placeholder={t('adminDashboard.search.courses')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      {!filtered.length ? (
        <EmptyState>{search ? t('adminDashboard.empty.noSearchResults') : t('adminDashboard.empty.noCourses')}</EmptyState>
      ) : (
        <TableWrap>
          <StyledTable>
            <thead><tr><Th>{t('adminDashboard.table.image')}</Th><Th>{t('adminDashboard.table.title')}</Th><Th>{t('adminDashboard.table.teacher')}</Th><Th>{t('adminDashboard.table.subject')}</Th><Th>{t('adminDashboard.table.price')}</Th><Th>{t('adminDashboard.table.rating')}</Th><Th>{t('adminDashboard.table.actions')}</Th></tr></thead>
            <tbody>
              {filtered.map((c) => (
                <RowHover key={c._id}>
                  <Td>
                    {c.coverImage ? <img src={c.coverImage} alt="" style={{ width: 48, height: 32, borderRadius: 6, objectFit: 'cover' }} /> : '—'}
                  </Td>
                  <Td>{c.name}</Td>
                  <Td>{c.teacher?.name || '—'}</Td>
                  <Td>{c.subject?.name || '—'}</Td>
                  <Td>
                    {c.priceAfterDiscount ? <><span>{formatPrice(c.priceAfterDiscount)}</span> <OldPrice>{formatPrice(c.price)}</OldPrice></> : formatPrice(c.price)}
                  </Td>
                  <Td>{c.averageRating > 0 ? <Badge $type={c.averageRating >= 4 ? 'success' : c.averageRating >= 2.5 ? 'warning' : 'danger'}>{c.averageRating.toFixed(1)}</Badge> : '—'}</Td>
                  <ActionsCell>
                    {confirm === c._id ? (
                      <ConfirmGroup>
                        <ConfirmBtn $variant="confirm" onClick={() => { deleteCourse(c._id); setConfirm(null); }} disabled={isDeletingCourse}>
                          {isDeletingCourse ? <Loader2 size={13} /> : <Check size={13} />}
                        </ConfirmBtn>
                        <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                      </ConfirmGroup>
                    ) : (
                      <ActionBtn $color="danger" title={t('adminDashboard.actions.delete')} onClick={() => setConfirm(c._id)}><Trash2 size={16} /></ActionBtn>
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
