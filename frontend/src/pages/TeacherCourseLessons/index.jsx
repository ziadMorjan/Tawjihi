import { useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowRight,
  Plus,
  GripVertical,
  Clock,
  Eye,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  Save,
  PlayCircle,
  Upload,
  LayoutDashboard,
  Layers,
  MessageSquare,
  Star,
  Bell,
  FileText,
  Download,
} from 'lucide-react';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { Button } from '../../shared/components/Button';
import { useLessons, useLessonActions } from '../../features/lessons';
import { useTeacherCourses } from '../../features/teacher';
import { PATH } from '../../constants';
import {
  PageInner, PageHeader, HeaderLeft, BackBtn, PageTitle, PageSubtitle,
  UnsavedBanner, LessonList, LessonCard, DragHandle, OrderBadge,
  LessonInfo, LessonName, LessonMeta, MetaBadge, LessonActions, ActionIconBtn,
  EmptyState, SkeletonCard, ModalOverlay, ModalBox, ModalHeader, ModalTitle,
  CloseBtn, Form, FieldGroup, Label, Input, Textarea, HintText, ErrorText,
  UploadWrap, ProgressBarTrack, ProgressBarFill, ProgressLabel,
  ToggleRow, ToggleCheckbox, ToggleTextWrap, ToggleLabel, ToggleHint,
  FormActions, ConfirmRow, ConfirmText, ResourceList, ResourceItem,
} from './styles';

// ── Sortable Lesson Row ────────────────────────────────────────────────────────
function SortableLessonRow({ lesson, index, onEdit, onManageResources, onDeleteStart, deletingId }) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lesson._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    position: isDragging ? 'relative' : 'static',
  };

  const formatDuration = (secs) => {
    if (!secs || secs <= 0) return null;
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return m === 0 ? `${s}s` : `${m}:${String(s).padStart(2, '0')}`;
  };

  const isDeleting = deletingId === lesson._id;

  return (
    <div ref={setNodeRef} style={style}>
      <LessonCard $isDragging={isDragging}>
        {/* Drag Handle */}
        <DragHandle {...attributes} {...listeners} title={t('lessons.dragHint')}>
          <GripVertical size={16} />
        </DragHandle>

        {/* Order Number */}
        <OrderBadge>{String(index + 1).padStart(2, '0')}</OrderBadge>

        {/* Info */}
        <LessonInfo>
          <LessonName>{lesson.name}</LessonName>
          <LessonMeta>
            {lesson.duration > 0 && (
              <MetaBadge $variant="duration">
                <Clock size={10} />
                {formatDuration(lesson.duration)}
              </MetaBadge>
            )}
            {lesson.isFreePreview && (
              <MetaBadge $variant="free">
                <Eye size={10} />
                {t('lessons.freePreview')}
              </MetaBadge>
            )}
          </LessonMeta>
        </LessonInfo>

        {/* Actions */}
        <LessonActions>
          {isDeleting ? (
            <ConfirmRow>
              <ConfirmText>{t('teacherDashboard.actions.delete')}?</ConfirmText>
              <ActionIconBtn
                $danger
                onClick={() => onDeleteStart(lesson._id, 'confirm')}
                title={t('teacherDashboard.actions.confirmDelete')}
              >
                <CheckCircle2 size={14} />
              </ActionIconBtn>
              <ActionIconBtn onClick={() => onDeleteStart(null)} title={t('teacherDashboard.actions.cancel')}>
                <X size={14} />
              </ActionIconBtn>
            </ConfirmRow>
          ) : (
            <>
              <ActionIconBtn onClick={() => onManageResources(lesson)} title={t('teacherDashboard.actions.manageResources')}>
                <FileText size={14} />
              </ActionIconBtn>
              <ActionIconBtn onClick={() => onEdit(lesson)} title={t('teacherDashboard.actions.edit')}>
                <Pencil size={14} />
              </ActionIconBtn>
              <ActionIconBtn
                $danger
                onClick={() => onDeleteStart(lesson._id, 'ask')}
                title={t('teacherDashboard.actions.delete')}
              >
                <Trash2 size={14} />
              </ActionIconBtn>
            </>
          )}
        </LessonActions>
      </LessonCard>
    </div>
  );
}

// ── Upload Progress Bar ────────────────────────────────────────────────────────
function UploadProgress({ pct }) {
  const { t } = useTranslation();
  if (pct === null) return null;
  return (
    <UploadWrap>
      <ProgressBarTrack>
        <ProgressBarFill $pct={pct} />
      </ProgressBarTrack>
      <ProgressLabel>
        <span>{pct < 100 ? t('lessons.form.uploading') : t('lessons.form.uploadComplete')}</span>
        <span>{pct}%</span>
      </ProgressLabel>
    </UploadWrap>
  );
}

// ── Lesson Form Modal ─────────────────────────────────────────────────────────
function LessonModal({ courseId, lesson, onClose }) {
  const { t } = useTranslation();
  const { createLesson, updateLesson, isCreating, isUpdating } = useLessonActions(courseId);

  const [name, setName] = useState(lesson?.name || '');
  const [description, setDescription] = useState(lesson?.description || '');
  const [isFreePreview, setIsFreePreview] = useState(lesson?.isFreePreview || false);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadPct, setUploadPct] = useState(null);
  const [errors, setErrors] = useState({});

  const isEditing = !!lesson;
  const isPending = isCreating || isUpdating;

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = t('lessons.form.nameRequired');
    if (!description.trim()) e.description = t('lessons.form.descRequired');
    if (!isEditing && !videoFile) e.video = t('lessons.form.videoRequired');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('description', description.trim());
    fd.append('isFreePreview', isFreePreview);
    if (!isEditing) fd.append('course', courseId);
    if (videoFile) fd.append('video', videoFile);

    const onUploadProgress = (evt) => {
      const pct = Math.round((evt.loaded / evt.total) * 100);
      setUploadPct(pct);
    };

    try {
      if (isEditing) {
        await updateLesson({ id: lesson._id, formData: fd, onUploadProgress });
      } else {
        await createLesson({ formData: fd, onUploadProgress });
      }
      onClose();
    } catch {
      setUploadPct(null);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {isEditing ? t('lessons.form.editLesson') : t('lessons.form.addLesson')}
          </ModalTitle>
          <CloseBtn onClick={onClose} disabled={isPending}>
            <X size={16} />
          </CloseBtn>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          {/* Name */}
          <FieldGroup>
            <Label htmlFor="lesson-name">
              {t('lessons.form.name')} <span>*</span>
            </Label>
            <Input
              id="lesson-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              $error={!!errors.name}
              placeholder={t('lessons.form.namePlaceholder')}
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </FieldGroup>

          {/* Description */}
          <FieldGroup>
            <Label htmlFor="lesson-desc">
              {t('lessons.form.description')} <span>*</span>
            </Label>
            <Textarea
              id="lesson-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              $error={!!errors.description}
              placeholder={t('lessons.form.descPlaceholder')}
              rows={3}
            />
            {errors.description && <ErrorText>{errors.description}</ErrorText>}
          </FieldGroup>

          {/* Video Upload */}
          <FieldGroup>
            <Label htmlFor="lesson-video">
              {t('lessons.form.video')}
              {!isEditing && <span> *</span>}
            </Label>
            {isEditing && lesson?.video && (
              <div style={{ marginBottom: 8 }}>
                <a href={lesson.video} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#0D7FA3', textDecoration: 'underline' }}>
                  {t('lessons.form.previewCurrentVideo')}
                </a>
              </div>
            )}
            <Input
              id="lesson-video"
              type="file"
              accept="video/*"
              onChange={(e) => {
                setVideoFile(e.target.files[0] || null);
                setUploadPct(null);
              }}
              $error={!!errors.video}
            />
            <HintText>{t('lessons.form.videoHint')}</HintText>
            {errors.video && <ErrorText>{errors.video}</ErrorText>}
            {uploadPct !== null && <UploadProgress pct={uploadPct} />}
          </FieldGroup>

          {/* Free Preview Toggle */}
          <ToggleRow $checked={isFreePreview} htmlFor="free-preview">
            <ToggleCheckbox
              id="free-preview"
              type="checkbox"
              checked={isFreePreview}
              onChange={(e) => setIsFreePreview(e.target.checked)}
            />
            <ToggleTextWrap>
              <ToggleLabel>{t('lessons.form.isFreePreview')}</ToggleLabel>
              <ToggleHint>{t('lessons.form.isFreePreviewHint')}</ToggleHint>
            </ToggleTextWrap>
          </ToggleRow>

          {/* Submit */}
          <FormActions>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isPending}
              disabled={isPending || uploadPct !== null && uploadPct < 100}
            >
              {isEditing ? t('teacherDashboard.actions.update') : t('teacherDashboard.actions.create')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isPending}
            >
              {t('teacherDashboard.actions.cancel')}
            </Button>
          </FormActions>
        </Form>
      </ModalBox>
    </ModalOverlay>
  );
}

// ── Resources Modal ─────────────────────────────────────────────────────────
function ResourcesModal({ courseId, lesson, onClose }) {
  const { t } = useTranslation();
  const { addResource, deleteResource, isAddingResource, isDeletingResource } = useLessonActions(courseId);

  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [uploadPct, setUploadPct] = useState(null);
  const [error, setError] = useState('');

  const isPending = isAddingResource;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError(t('lessons.resources.nameRequired')); return; }
    if (!file) { setError(t('lessons.resources.fileRequired')); return; }

    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('content', file);

    const onUploadProgress = (evt) => {
      const pct = Math.round((evt.loaded / evt.total) * 100);
      setUploadPct(pct);
    };

    try {
      await addResource({ lessonId: lesson._id, formData: fd, onUploadProgress });
      setName('');
      setFile(null);
      setUploadPct(null);
      setError('');
    } catch {
      setUploadPct(null);
    }
  };

  const handleDelete = (resourceId) => {
    if (window.confirm(t('lessons.resources.confirmDelete'))) {
      deleteResource({ lessonId: lesson._id, resourceId });
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{t('lessons.resources.manageTitle')} {lesson.name}</ModalTitle>
          <CloseBtn onClick={onClose} disabled={isPending}>
            <X size={16} />
          </CloseBtn>
        </ModalHeader>

        {/* Existing Resources */}
        {lesson.resources?.length > 0 ? (
          <ResourceList>
            {lesson.resources.map(res => (
              <ResourceItem key={res._id}>
                <div className="info">
                  <FileText size={16} color="#0D7FA3" />
                  {res.name}
                </div>
                <div className="actions">
                  <ActionIconBtn as="a" href={res.content} target="_blank" rel="noreferrer" title={t('lessons.resources.download')}>
                    <Download size={14} />
                  </ActionIconBtn>
                  <ActionIconBtn $danger onClick={() => handleDelete(res._id)} title={t('lessons.resources.delete')} disabled={isDeletingResource}>
                    <Trash2 size={14} />
                  </ActionIconBtn>
                </div>
              </ResourceItem>
            ))}
          </ResourceList>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
            {t('lessons.resources.noResources')}
          </div>
        )}

        {/* Add Resource Form */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #E2E8F0' }}>
          <h4 style={{ fontSize: 14, marginBottom: 12, color: '#0F172A' }}>{t('lessons.resources.addResource')}</h4>
          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <Input
                placeholder={t('lessons.resources.namePlaceholder')}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.zip,.rar,.ppt,.pptx"
                onChange={e => {
                  setFile(e.target.files[0] || null);
                  setUploadPct(null);
                }}
              />
              <HintText>{t('lessons.resources.supportedTypes')}</HintText>
              {error && <ErrorText>{error}</ErrorText>}
              {uploadPct !== null && <UploadProgress pct={uploadPct} />}
            </FieldGroup>
            <FormActions>
              <Button type="submit" variant="primary" size="sm" isLoading={isPending} disabled={isPending || (uploadPct !== null && uploadPct < 100)}>
                {t('lessons.resources.uploadButton')}
              </Button>
            </FormActions>
          </Form>
        </div>
      </ModalBox>
    </ModalOverlay>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function TeacherCourseLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // get course name from navigation state or courses list
  const { courses } = useTeacherCourses();
  const courseName =
    location.state?.courseName ||
    courses?.find((c) => c._id === courseId)?.name ||
    '...';

  const { data: lessons = [], isLoading } = useLessons(courseId);
  const { deleteLesson, reorderLessons, isDeleting, isReordering } = useLessonActions(courseId);

  // local ordered list (for DnD optimistic UI)
  const [orderedLessons, setOrderedLessons] = useState(null);
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);

  const displayLessons = orderedLessons ?? lessons;

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [resourcesLesson, setResourcesLesson] = useState(null);

  // Delete confirm state (inline)
  const [deletingId, setDeletingId] = useState(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      if (!over || active.id === over.id) return;
      const oldIndex = displayLessons.findIndex((l) => l._id === active.id);
      const newIndex = displayLessons.findIndex((l) => l._id === over.id);
      const reordered = arrayMove(displayLessons, oldIndex, newIndex);
      setOrderedLessons(reordered);
      setHasUnsavedOrder(true);
    },
    [displayLessons],
  );

  const handleSaveOrder = () => {
    if (!orderedLessons) return;
    reorderLessons({
      courseId,
      lessons: orderedLessons.map((l, i) => ({ _id: l._id, order: i })),
    });
    setHasUnsavedOrder(false);
  };

  const handleOpenAdd = () => {
    setEditingLesson(null);
    setShowModal(true);
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setShowModal(true);
  };

  const handleDeleteStart = (id, action) => {
    if (action === 'ask') {
      setDeletingId(id);
    } else if (action === 'confirm') {
      deleteLesson(id);
      setDeletingId(null);
    } else {
      setDeletingId(null);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingLesson(null);
    // reset ordered if lessons changed
    setOrderedLessons(null);
    setHasUnsavedOrder(false);
  };

  const NAV_ITEMS = (t) => [
    { key: 0, label: t('teacherDashboard.nav.overview'), icon: LayoutDashboard },
    { key: 1, label: t('teacherDashboard.nav.courses'), icon: Layers },
    { key: 2, label: t('teacherDashboard.nav.comments'), icon: MessageSquare },
    { key: 3, label: t('teacherDashboard.nav.reviews'), icon: Star },
    { key: 4, label: t('teacherDashboard.nav.sendNotification'), icon: Bell },
  ];

  return (
    <DashboardLayout navItems={NAV_ITEMS(t)} activeNav={1} onNavChange={(key) => navigate(PATH.teacherDashboard)}>
      <PageInner>
        {/* Header */}
        <PageHeader>
          <HeaderLeft>
            <BackBtn onClick={() => navigate(PATH.teacherDashboard)}>
              <ArrowRight size={14} />
              {t('lessons.backToCourses')}
            </BackBtn>
            <PageTitle>
              {t('lessons.pageTitle')}:{' '}
              <span>{courseName}</span>
            </PageTitle>
            <PageSubtitle>
              {displayLessons.length} {t('video.lessonCount')} • {t('lessons.dragHint')}
            </PageSubtitle>
          </HeaderLeft>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={handleOpenAdd}
          >
            {t('teacherDashboard.actions.addLesson')}
          </Button>
        </PageHeader>

        {/* Unsaved Order Banner */}
        {hasUnsavedOrder && (
          <UnsavedBanner>
            <p>
              <AlertTriangle size={15} />
              {t('lessons.unsavedOrder')}
            </p>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Save size={13} />}
              onClick={handleSaveOrder}
              isLoading={isReordering}
            >
              {t('teacherDashboard.actions.saveOrder')}
            </Button>
          </UnsavedBanner>
        )}

        {/* Lesson List */}
        {isLoading ? (
          <LessonList>
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </LessonList>
        ) : displayLessons.length === 0 ? (
          <EmptyState>
            <PlayCircle size={56} />
            <h3>{t('teacherDashboard.empty.noLessons')}</h3>
            <p>{t('teacherDashboard.empty.startBuilding')}</p>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={handleOpenAdd}
            >
              {t('teacherDashboard.actions.addLesson')}
            </Button>
          </EmptyState>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displayLessons.map((l) => l._id)}
              strategy={verticalListSortingStrategy}
            >
              <LessonList>
                {displayLessons.map((lesson, index) => (
                  <SortableLessonRow
                    key={lesson._id}
                    lesson={lesson}
                    index={index}
                    onEdit={handleEdit}
                    onManageResources={setResourcesLesson}
                    onDeleteStart={handleDeleteStart}
                    deletingId={deletingId}
                  />
                ))}
              </LessonList>
            </SortableContext>
          </DndContext>
        )}
      </PageInner>

      {/* Add / Edit Modal */}
      {showModal && (
        <LessonModal
          courseId={courseId}
          lesson={editingLesson}
          onClose={handleModalClose}
        />
      )}

      {/* Resources Modal */}
      {resourcesLesson && (
        <ResourcesModal
          courseId={courseId}
          lesson={resourcesLesson}
          onClose={() => setResourcesLesson(null)}
        />
      )}
    </DashboardLayout>
  );
}
