import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PATH } from "../../constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  ChevronRight,
  ChevronLeft,
  Clock,
  PlayCircle,
  Lock,
  MessageSquare,
  Pencil,
  Trash2,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../features/auth";
import { useMyEnrollments } from "../../features/enrollments/hooks/useMyEnrollments";
import { useLessons, useGenerateAI, AISummary, Flashcards } from "../../features/lessons";
import {
  useComments,
  useAddComment,
  useEditComment,
  useDeleteComment,
} from "../../features/comments";
import { MainLayout } from "../../shared/components/layout/MainLayout";
import { Button, Spinner, Badge } from "../../shared/components";
import {
  PageWrapper,
  VideoHeader,
  HeaderLeft,
  VideoTitle,
  VideoMeta,
  NavHint,
  ContentWrapper,
  PlayerSection,
  PlayerWrapper,
  NoVideoPlaceholder,
  PlaylistWrapper,
  PlaylistHeader,
  PlaylistTitle,
  PlaylistCount,
  PlaylistScroll,
  LessonItem,
  LessonNumber,
  LessonInfo,
  LessonTitle,
  LessonDuration,
  NavButtons,
  ReviewsSection,
  ReviewsTitle,
  ReviewCard,
  ReviewHeader,
  ReviewAvatar,
  ReviewerName,
  ReviewText,
  AddReviewForm,
  EmptyState,
  TabsContainer,
  TabButton,
} from "./VideoPage.styles";

export default function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const videoRef = useRef(null);

  // تحويل الثواني إلى صيغة دقيقة:ثانية
  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return null;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins === 0) return `${secs}s`;
    return `${mins}:${String(secs).padStart(2, '0')} ${t('video.minute')}`;
  };

  const { state } = useLocation();
  const [currentIndex, setCurrentIndex] = useState(state?.startIndex ?? 0);
  const [activeTab, setActiveTab] = useState("comments");
  const generateAIMutation = useGenerateAI(id);

  // ─── Data ───
  const { isEnrolled, isLoading: enrollLoading } = useMyEnrollments();
  const { data: lessons = [], isLoading: lessonsLoading } = useLessons(id);

  //  currentLesson يُعرَّف هنا — قبل أي hook يعتمد عليه
  const currentLesson = lessons[currentIndex] ?? null;


  const editCommentMutation = useEditComment(currentLesson?._id);
  const deleteCommentMutation = useDeleteComment(currentLesson?._id);

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Comments مرتبطة بالـ Lesson
  const { data: comments = [], isLoading: commentsLoading } = useComments(
    currentLesson?._id,
  );
  const addCommentMutation = useAddComment(currentLesson?._id);

  // ─── Form ───
  const commentSchema = useMemo(() => yup.object({
    review: yup.string().min(3, t('video.commentMinChar')).required(t('video.commentRequired')),
  }), [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(commentSchema) });

  // ─── Effects ───
  useEffect(() => {
    if (!lessons.length) return;
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.key === "ArrowRight")
        setCurrentIndex((p) => (p + 1) % lessons.length);
      if (e.key === "ArrowLeft")
        setCurrentIndex((p) => (p - 1 + lessons.length) % lessons.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lessons.length]);

  useEffect(() => {
    document
      .getElementById(`lesson-${currentIndex}`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [currentIndex]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentLesson?._id]);

  // ─── Submit ───
  const onSubmitComment = async (data) => {
    await addCommentMutation.mutateAsync({
      lessonId: currentLesson._id,
      content: data.review,
    });
    reset();
  };

  // ─── Guards ───
  if (enrollLoading || lessonsLoading) {
    return (
      <MainLayout>
        <div
          style={{
            height: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!isEnrolled(id)) {
    return (
      <MainLayout>
        <EmptyState>
          <Lock size={56} color="#94A3B8" />
          <h3>{t('video.notEnrolledTitle')}</h3>
          <p>{t('video.notEnrolledSub')}</p>
          <Button onClick={() => navigate(PATH.courseDetails(id))}>
            {t('video.backToCourse')}
          </Button>
        </EmptyState>
      </MainLayout>
    );
  }

  if (!lessons.length) {
    return (
      <MainLayout>
        <EmptyState>
          <PlayCircle size={56} color="#94A3B8" />
          <h3>{t('video.noLessonsTitle')}</h3>
          <p>{t('video.noLessonsSub')}</p>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            {t('common.back')}
          </Button>
        </EmptyState>
      </MainLayout>
    );
  }

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < lessons.length - 1;

  return (
      <MainLayout>
        <PageWrapper>
        {/* Header */}
        <VideoHeader>
          <HeaderLeft>
            <VideoTitle>
              {currentLesson?.title ??
                currentLesson?.name ??
                `${t('video.lessonNum')} ${currentIndex + 1}`}
            </VideoTitle>
            <VideoMeta>
              <Badge variant="primary">
                {currentIndex + 1} / {lessons.length}
              </Badge>
              {currentLesson?.duration > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={13} />
                  {formatDuration(currentLesson.duration)}
                </span>
              )}
            </VideoMeta>
          </HeaderLeft>
          <NavHint>{t('video.navHint')}</NavHint>
        </VideoHeader>

        <ContentWrapper>
          <PlayerSection>
            {/* Video */}
            {currentLesson?.video ? (
              <PlayerWrapper>
                <video
                  ref={videoRef}
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <source src={currentLesson.video} type="video/mp4" />
                  {t('video.noBrowserSupport')}
                </video>
              </PlayerWrapper>
            ) : (
              <NoVideoPlaceholder>
                <PlayCircle size={48} />
                <p style={{ margin: 0, fontSize: 14 }}>
                  {t('video.noVideo')}
                </p>
              </NoVideoPlaceholder>
            )}

            {/* Nav */}
            <NavButtons>
              <Button
                variant="secondary"
                size="sm"
                disabled={!hasPrev}
                onClick={() => setCurrentIndex((p) => p - 1)}
                leftIcon={<ChevronRight size={16} />}
              >
                {t('video.prevLesson')}
              </Button>
              <span style={{ fontSize: 13, color: "#94A3B8" }}>
                {currentIndex + 1} {t('video.of')} {lessons.length}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={!hasNext}
                onClick={() => setCurrentIndex((p) => p + 1)}
                rightIcon={<ChevronLeft size={16} />}
              >
                {t('video.nextLesson')}
              </Button>
            </NavButtons>
            {/* Tabs for comments, summary, and flashcards */}
            <TabsContainer>
              <TabButton
                $active={activeTab === "comments"}
                onClick={() => setActiveTab("comments")}
              >
                <MessageSquare size={16} />
                {t('video.comments')} ({comments.length})
              </TabButton>
              <TabButton
                $active={activeTab === "summary"}
                onClick={() => setActiveTab("summary")}
              >
                <Sparkles size={16} />
                {t('aiSummary.title')}
              </TabButton>
              <TabButton
                $active={activeTab === "flashcards"}
                onClick={() => setActiveTab("flashcards")}
              >
                <Sparkles size={16} style={{ display: 'none' }} />
                {t('flashcards.title')}
              </TabButton>
            </TabsContainer>

            {/* Tab Contents */}
            {activeTab === "comments" && (
              <ReviewsSection>
                <ReviewsTitle>
                  <MessageSquare size={18} style={{ marginInlineEnd: 8 }} />
                  {t('video.comments')} ({comments.length})
                </ReviewsTitle>

                {/* Add Comment */}
                {user && (
                  <AddReviewForm>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#0F172A",
                      }}
                    >
                      {t('video.addComment')}
                    </p>
                    <textarea
                      {...register("review")}
                      placeholder={t('video.placeholder')}
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: `1.5px solid ${errors.review ? "#DC2626" : "#E2E8F0"}`,
                        borderRadius: 10,
                        fontFamily: "inherit",
                        fontSize: 14,
                        resize: "vertical",
                        outline: "none",
                      }}
                    />
                    {errors.review && (
                      <span style={{ fontSize: 12, color: "#DC2626" }}>
                        {errors.review.message}
                      </span>
                    )}
                    <Button
                      size="sm"
                      onClick={handleSubmit(onSubmitComment)}
                      isLoading={addCommentMutation.isPending}
                      style={{ alignSelf: "flex-start" }}
                    >
                      {t('video.submit')}
                    </Button>
                  </AddReviewForm>
                )}

                {/* Comments List */}
                {commentsLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: 24,
                    }}
                  >
                    <Spinner size="md" />
                  </div>
                ) : comments.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#94A3B8",
                      fontSize: 14,
                      margin: "16px 0",
                    }}
                  >
                    {t('video.noComments')}
                  </p>
                ) : (
                  comments.map((comment) => {
                    const isOwner = user?._id === comment.user?._id;
                    const isEditing = editingId === comment._id;

                    return (
                      <ReviewCard key={comment._id}>
                        <ReviewHeader>
                          <ReviewAvatar>
                            {comment.user?.name?.charAt(0) ?? "؟"}
                          </ReviewAvatar>
                          <div style={{ flex: 1 }}>
                            <ReviewerName>
                              {comment.user?.name ?? t('teachers.anonymous')}
                            </ReviewerName>
                          </div>

                          {/* أزرار التعديل والحذف — للمالك فقط */}
                          {isOwner && !isEditing && (
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                onClick={() => {
                                  setEditingId(comment._id);
                                  setEditContent(comment.content);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: 4,
                                  color: "#94A3B8",
                                  borderRadius: 6,
                                }}
                                title={t('video.edit')}
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  deleteCommentMutation.mutate(comment._id)
                                }
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: 4,
                                  color: "#94A3B8",
                                  borderRadius: 6,
                                }}
                                title={t('video.delete')}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </ReviewHeader>

                        {/* محتوى التعليق — عرض أو تعديل */}
                        {isEditing ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                            }}
                          >
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={2}
                              style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: "1.5px solid #E2E8F0",
                                borderRadius: 8,
                                fontFamily: "inherit",
                                fontSize: 14,
                                resize: "vertical",
                                outline: "none",
                              }}
                            />
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                onClick={async () => {
                                    await editCommentMutation.mutateAsync({
                                      commentId: comment._id,
                                      content: editContent,
                                    });
                                    setEditingId(null);
                                  }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  padding: "4px 10px",
                                  borderRadius: 6,
                                  border: "1px solid #16A34A",
                                  background: "#F0FDF4",
                                  color: "#16A34A",
                                  cursor: "pointer",
                                  fontSize: 12,
                                  fontFamily: "inherit",
                                }}
                              >
                                <Check size={13} /> {t('video.save')}
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  padding: "4px 10px",
                                  borderRadius: 6,
                                  border: "1px solid #E2E8F0",
                                  background: "transparent",
                                  color: "#94A3B8",
                                  cursor: "pointer",
                                  fontSize: 12,
                                  fontFamily: "inherit",
                                }}
                              >
                                <X size={13} /> {t('video.cancel')}
                              </button>
                            </div>
                          </div>
                        ) : (
                          comment.content && (
                            <ReviewText>{comment.content}</ReviewText>
                          )
                        )}

                        {/* replies */}
                        {comment.replies?.length > 0 && (
                          <div style={{
                            marginTop: 12, paddingTop: 12,
                            borderTop: "1px solid #E2E8F0",
                            display: "flex", flexDirection: "column", gap: 10,
                          }}>
                            {comment.replies.map((r, idx) => (
                              <div key={r._id || idx} style={{
                                display: "flex", alignItems: "flex-start", gap: 8,
                                paddingInlineStart: 8,
                                borderInlineStart: "2px solid #E2E8F0",
                              }}>
                                <div style={{
                                  width: 24, height: 24,
                                  borderRadius: "50%",
                                  background: "#F1F5F9",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: 9, fontWeight: 700,
                                  color: "#94A3B8", flexShrink: 0,
                                }}>
                                  {r.user?.name?.charAt(0) ?? "?"}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>
                                      {r.user?.name ?? "معلم"}
                                    </span>
                                    {r.createdAt && (
                                      <span style={{ fontSize: 10, color: "#94A3B8" }}>
                                        {new Date(r.createdAt).toLocaleDateString("ar-SA", { month: "short", day: "numeric" })}
                                      </span>
                                    )}
                                  </div>
                                  <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0", lineHeight: 1.5 }}>
                                    {r.text}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ReviewCard>
                    );
                  })
                )}
              </ReviewsSection>
            )}

            {activeTab === "summary" && (
              <AISummary
                summary={currentLesson?.aiSummary}
                isGenerating={generateAIMutation.isPending}
                onGenerate={() => generateAIMutation.mutate(currentLesson?._id)}
              />
            )}

            {activeTab === "flashcards" && (
              <Flashcards
                flashcards={currentLesson?.aiFlashcards}
              />
            )}
          </PlayerSection>

          {/* Playlist */}
          <PlaylistWrapper>
            <PlaylistHeader>
              <PlaylistTitle>{t('video.lessonsList')}</PlaylistTitle>
              <PlaylistCount>{lessons.length} {t('video.lessonCount')}</PlaylistCount>
            </PlaylistHeader>
            <PlaylistScroll>
              {lessons.map((lesson, index) => {
                const isActive = index === currentIndex;
                return (
                  <LessonItem
                    key={lesson._id}
                    id={`lesson-${index}`}
                    $active={isActive}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <LessonNumber $active={isActive}>
                      {isActive ? (
                        <PlayCircle size={14} />
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </LessonNumber>
                    <LessonInfo>
                      <LessonTitle $active={isActive}>
                        {lesson.title ?? lesson.name}
                      </LessonTitle>
                      {lesson.duration > 0 && (
                        <LessonDuration>
                          <Clock size={11} />
                          {formatDuration(lesson.duration)}
                        </LessonDuration>
                      )}
                    </LessonInfo>
                  </LessonItem>
                );
              })}
            </PlaylistScroll>
          </PlaylistWrapper>
        </ContentWrapper>
      </PageWrapper>
    </MainLayout>
  );
}
