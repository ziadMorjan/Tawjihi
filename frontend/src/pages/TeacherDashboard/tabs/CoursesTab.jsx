import { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useTeacherActions, useTeacherCourses } from '../../../features/teacher';
import { useBranches, useSubjects } from '../../../features/admin';
import { Button } from '../../../shared/components/Button';
import {
  EmptyState, ModalOverlay, ModalContent, ModalTitle,
  Form, FieldGroup, Label, StyledInput, StyledTextarea, Select,
  TableWrap, StyledTable, Th, Td, ActionsCell, ActionBtn,
  RowHover, Badge, OldPrice, SkeletonCard,
} from '../styles';
import { formatPrice } from '../helpers';

export default function CoursesTab() {
  const { t } = useLanguage();
  const { courses, isLoading } = useTeacherCourses();
  const { deleteCourse, updateCourse, createCourse, isDeleting, isCreating, isUpdating } = useTeacherActions();
  const { subjects } = useSubjects();
  const { branches } = useBranches();
  const [editingCourse, setEditingCourse] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  // Add/Edit form state
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formPriceAfter, setFormPriceAfter] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formBranches, setFormBranches] = useState([]);
  const [formFile, setFormFile] = useState(null);

  const resetForm = () => {
    setFormName(''); setFormDesc(''); setFormPrice(''); setFormPriceAfter('');
    setFormSubject(''); setFormBranches([]); setFormFile(null);
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setFormName(course.name);
    setFormDesc(course.description || '');
    setFormPrice(String(course.price || ''));
    setFormPriceAfter(String(course.priceAfterDiscount || ''));
    setFormSubject(course.subject?._id || '');
    setFormBranches(course.branches?.map((b) => b._id || b) || []);
    setFormFile(null);
    setShowAdd(false);
  };

  const openAdd = () => {
    resetForm();
    setShowAdd(true);
    setEditingCourse(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', formName.trim());
    if (formDesc.trim()) fd.append('description', formDesc.trim());
    if (formPrice) fd.append('price', formPrice);
    if (formPriceAfter) fd.append('priceAfterDiscount', formPriceAfter);
    if (formSubject) fd.append('subject', formSubject);
    if (formBranches.length) fd.append('branches', JSON.stringify(formBranches));
    if (formFile) fd.append('coverImage', formFile);

    if (editingCourse) {
      updateCourse({ id: editingCourse._id, formData: fd }, { onSuccess: () => { setEditingCourse(null); resetForm(); } });
    } else {
      createCourse(fd, { onSuccess: () => { setShowAdd(false); resetForm(); } });
    }
  };

  const handleDelete = (c) => {
    const msg = t('teacherDashboard.confirmDelete', { name: c.name });
    if (window.confirm(msg)) deleteCourse(c._id);
  };

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={openAdd}>{t('teacherDashboard.actions.add')}</Button>
      </div>

      {courses.length === 0 && <EmptyState>{t('teacherDashboard.empty.noCourses')}</EmptyState>}

      {(showAdd || editingCourse) && (
        <ModalOverlay onClick={() => { setShowAdd(false); setEditingCourse(null); }}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{editingCourse ? t('teacherDashboard.form.editCourse') : t('teacherDashboard.form.addCourse')}</ModalTitle>
            <Form onSubmit={handleSave}>
              <FieldGroup><Label>{t('teacherDashboard.form.name')}</Label><StyledInput value={formName} onChange={(e) => setFormName(e.target.value)} required /></FieldGroup>
              <FieldGroup><Label>{t('teacherDashboard.form.description')}</Label><StyledTextarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} /></FieldGroup>
              <FieldGroup><Label>{t('teacherDashboard.form.price')}</Label><StyledInput type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} /></FieldGroup>
              <FieldGroup><Label>{t('teacherDashboard.form.priceAfterDiscount')}</Label><StyledInput type="number" value={formPriceAfter} onChange={(e) => setFormPriceAfter(e.target.value)} /></FieldGroup>
              <FieldGroup>
                <Label>{t('teacherDashboard.form.subject')}</Label>
                <Select value={formSubject} onChange={(e) => setFormSubject(e.target.value)}>
                  <option value="">{t('teacherDashboard.form.selectSubject')}</option>
                  {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </Select>
              </FieldGroup>
              <FieldGroup>
                <Label>{t('teacherDashboard.form.branches')}</Label>
                <Select multiple value={formBranches} onChange={(e) => setFormBranches(Array.from(e.target.selectedOptions, (o) => o.value))}>
                  {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                </Select>
              </FieldGroup>
              <FieldGroup><Label>{t('teacherDashboard.form.courseImage')}</Label><StyledInput type="file" accept="image/*" onChange={(e) => setFormFile(e.target.files[0] || null)} /></FieldGroup>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="submit" variant="primary" size="sm" isLoading={isCreating || isUpdating} disabled={!formName.trim()}>
                  {editingCourse ? t('teacherDashboard.actions.update') : t('teacherDashboard.actions.create')}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setShowAdd(false); setEditingCourse(null); }}>{t('teacherDashboard.actions.cancel')}</Button>
              </div>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      {courses.length > 0 && (
        <TableWrap>
          <StyledTable>
            <thead><tr><Th>{t('teacherDashboard.table.image')}</Th><Th>{t('teacherDashboard.table.title')}</Th><Th>{t('teacherDashboard.table.subject')}</Th><Th>{t('teacherDashboard.table.branch')}</Th><Th>{t('teacherDashboard.table.price')}</Th><Th>{t('teacherDashboard.table.rating')}</Th><Th>{t('teacherDashboard.table.actions')}</Th></tr></thead>
            <tbody>
              {courses.map((c) => (
                <RowHover key={c._id}>
                  <Td>{c.coverImage ? <img src={c.coverImage} alt="" style={{ width: 48, height: 32, borderRadius: 6, objectFit: 'cover' }} /> : '—'}</Td>
                  <Td>{c.name}</Td>
                  <Td>{c.subject?.name || '—'}</Td>
                  <Td>{c.branches?.[0]?.name || '—'}</Td>
                  <Td>{c.priceAfterDiscount ? <><span>{formatPrice(c.priceAfterDiscount)}</span> <OldPrice>{formatPrice(c.price)}</OldPrice></> : formatPrice(c.price)}</Td>
                  <Td>{c.averageRating > 0 ? <Badge>{c.averageRating.toFixed(1)}</Badge> : '—'}</Td>
                  <ActionsCell>
                    <ActionBtn $color="primary" title={t('teacherDashboard.actions.edit')} onClick={() => openEdit(c)}><Edit3 size={16} /></ActionBtn>
                    <ActionBtn $color="danger" title={t('teacherDashboard.actions.delete')} onClick={() => handleDelete(c)} disabled={isDeleting}><Trash2 size={16} /></ActionBtn>
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
