import { useState } from 'react';
import { Plus, Check, X, Loader2, Edit3, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useAdminActions, useCoupons } from '../../../features/admin';
import { Button } from '../../../shared/components/Button';
import {
  TableWrap, StyledTable, Th, Td, ActionsCell, ActionBtn,
  ConfirmGroup, ConfirmBtn, ModalOverlay, ModalContent, ModalTitle,
  Form, FieldGroup, Label, StyledInput,
  EmptyState, RowHover, Badge, SkeletonCard,
} from '../styles';
import { formatDate } from '../helpers';

export default function CouponsTab() {
  const { createCoupon, updateCoupon, deleteCoupon, isCreatingCoupon, isUpdatingCoupon, isDeletingCoupon } = useAdminActions();
  const { coupons, isLoading } = useCoupons();
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');
  const [expire, setExpire] = useState('');
  const [editCoupon, setEditCoupon] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDiscount, setEditDiscount] = useState('');
  const [editExpire, setEditExpire] = useState('');
  const [confirm, setConfirm] = useState(null);
  const { t } = useLanguage();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !discount || !expire) return;
    createCoupon({ name: name.trim().toUpperCase(), discount: Number(discount), expire: new Date(expire).toISOString() }, { onSuccess: () => { setName(''); setDiscount(''); setExpire(''); } });
  };

  const openEdit = (c) => {
    setEditCoupon(c);
    setEditName(c.name);
    setEditDiscount(String(c.discount));
    setEditExpire(new Date(c.expire).toISOString().split('T')[0]);
  };

  const handleSave = () => {
    updateCoupon({ id: editCoupon._id, name: editName.trim().toUpperCase(), discount: Number(editDiscount), expire: editExpire }, { onSuccess: () => setEditCoupon(null) });
  };

  const handleDelete = (id) => {
    deleteCoupon(id, { onSuccess: () => setConfirm(null) });
  };

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      {editCoupon && (
        <ModalOverlay onClick={() => setEditCoupon(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{t('adminDashboard.coupons.editTitle')}</ModalTitle>
            <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <FieldGroup><Label>{t('adminDashboard.form.name')}</Label><StyledInput value={editName} onChange={(e) => setEditName(e.target.value)} required /></FieldGroup>
              <FieldGroup><Label>{t('adminDashboard.form.discountPercent')}</Label><StyledInput type="number" value={editDiscount} onChange={(e) => setEditDiscount(e.target.value)} min="1" max="100" required /></FieldGroup>
              <FieldGroup><Label>{t('adminDashboard.form.expireDate')}</Label><StyledInput type="date" value={editExpire} onChange={(e) => setEditExpire(e.target.value)} required /></FieldGroup>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="submit" variant="primary" size="sm" isLoading={isUpdatingCoupon} disabled={!editName.trim() || !editDiscount || !editExpire}>{t('adminDashboard.actions.save')}</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditCoupon(null)}>{t('adminDashboard.actions.cancel')}</Button>
              </div>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      <Form onSubmit={handleAdd} style={{ marginBottom: 24 }}>
        <FieldGroup>
          <Label>{t('adminDashboard.form.name')}</Label>
          <StyledInput value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: SAVE20" required />
        </FieldGroup>
        <FieldGroup>
          <Label>{t('adminDashboard.form.discountPercent')}</Label>
          <StyledInput type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="20" min="1" max="100" required />
        </FieldGroup>
        <FieldGroup>
          <Label>{t('adminDashboard.form.expireDate')}</Label>
          <StyledInput type="date" value={expire} onChange={(e) => setExpire(e.target.value)} required />
        </FieldGroup>
        <Button type="submit" variant="primary" size="sm" leftIcon={isCreatingCoupon ? <Loader2 size={14} /> : <Plus size={14} />} isLoading={isCreatingCoupon} disabled={!name.trim() || !discount || !expire}>{t('adminDashboard.coupons.addButton')}</Button>
      </Form>
      {coupons.length === 0 && <EmptyState>{t('adminDashboard.empty.noCoupons')}</EmptyState>}
      {coupons.length > 0 && (
        <TableWrap>
          <StyledTable>
            <thead><tr><Th>{t('adminDashboard.table.name')}</Th><Th>{t('adminDashboard.table.discount')}</Th><Th>{t('adminDashboard.table.expireDate')}</Th><Th>{t('adminDashboard.table.status')}</Th><Th>{t('adminDashboard.table.actions')}</Th></tr></thead>
            <tbody>
              {coupons.map((c) => {
                const expired = new Date(c.expire) < new Date();
                return (
                  <RowHover key={c._id} style={{ opacity: expired ? 0.5 : 1 }}>
                    <Td><strong>{c.name}</strong></Td>
                    <Td>{c.discount}%</Td>
                    <Td>{formatDate(c.expire)}</Td>
                    <Td>{expired ? <Badge $type="danger">{t('adminDashboard.coupons.expired')}</Badge> : <Badge $type="success">{t('adminDashboard.coupons.active')}</Badge>}</Td>
                    <ActionsCell>
                      <ActionBtn $color="primary" title={t('adminDashboard.actions.edit')} onClick={() => openEdit(c)}><Edit3 size={16} /></ActionBtn>
                      {confirm === c._id ? (
                        <ConfirmGroup>
                          <ConfirmBtn $variant="confirm" onClick={() => handleDelete(c._id)} disabled={isDeletingCoupon}>
                            {isDeletingCoupon ? <Loader2 size={13} /> : <Check size={13} />}
                          </ConfirmBtn>
                          <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                        </ConfirmGroup>
                      ) : (
                        <ActionBtn $color="danger" title={t('adminDashboard.actions.delete')} onClick={() => setConfirm(c._id)}><Trash2 size={16} /></ActionBtn>
                      )}
                    </ActionsCell>
                  </RowHover>
                );
              })}
            </tbody>
          </StyledTable>
        </TableWrap>
      )}
    </div>
  );
}
