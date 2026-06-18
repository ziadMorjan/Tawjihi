import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { useAuth } from "../../features/auth";
import { useMyEnrollments } from "../../features/enrollments/hooks/useMyEnrollments";
import { useLessons } from "../../features/lessons";
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
} from "./VideoPage.styles";

const commentSchema = yup.object({
  review: yup.string().min(3, "التعليق قصير جداً").required("التعليق مطلوب"),
});

export default function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef(null);

  const { state } = useLocation();
  const [currentIndex, setCurrentIndex] = useState(state?.startIndex ?? 0);

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
          <h3>غير مسجل في الدورة</h3>
          <p>يجب الاشتراك في هذه الدورة لمشاهدة الفيديوهات</p>
          <Button onClick={() => navigate(PATH.courseDetails(id))}>
            العودة لصفحة الكورس
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
          <h3>لا توجد دروس بعد</h3>
          <p>لم يُضف المعلم دروساً لهذا الكورس حتى الآن</p>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            رجوع
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
                `الدرس ${currentIndex + 1}`}
            </VideoTitle>
            <VideoMeta>
              <Badge variant="primary">
                {currentIndex + 1} / {lessons.length}
              </Badge>
              {currentLesson?.duration && (
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={13} />
                  {Math.ceil(currentLesson.duration / 60)} دقيقة
                </span>
              )}
            </VideoMeta>
          </HeaderLeft>
          <NavHint>استخدم الأسهم ← → للتنقل بين الدروس</NavHint>
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
                  متصفحك لا يدعم تشغيل الفيديو
                </video>
              </PlayerWrapper>
            ) : (
              <NoVideoPlaceholder>
                <PlayCircle size={48} />
                <p style={{ margin: 0, fontSize: 14 }}>
                  لا يوجد فيديو لهذا الدرس
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
                الدرس السابق
              </Button>
              <span style={{ fontSize: 13, color: "#94A3B8" }}>
                {currentIndex + 1} من {lessons.length}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={!hasNext}
                onClick={() => setCurrentIndex((p) => p + 1)}
                rightIcon={<ChevronLeft size={16} />}
              >
                الدرس التالي
              </Button>
            </NavButtons>

            {/* Comments */}
            <ReviewsSection>
              <ReviewsTitle>
                <MessageSquare size={18} style={{ marginLeft: 8 }} />
                التعليقات ({comments.length})
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
                    أضف تعليقك
                  </p>
                  <textarea
                    {...register("review")}
                    placeholder="اكتب تعليقك هنا..."
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
                      direction: "rtl",
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
                    إرسال التعليق
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
                  لا توجد تعليقات بعد — كن أول من يعلّق!
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
                            {comment.user?.name ?? "مجهول"}
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
                              title="تعديل"
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
                              title="حذف"
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
                              direction: "rtl",
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
                              <Check size={13} /> حفظ
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
                              <X size={13} /> إلغاء
                            </button>
                          </div>
                        </div>
                      ) : (
                        comment.content && (
                          <ReviewText>{comment.content}</ReviewText>
                        )
                      )}
                    </ReviewCard>
                  );
                })
              )}
            </ReviewsSection>
          </PlayerSection>

          {/* Playlist */}
          <PlaylistWrapper>
            <PlaylistHeader>
              <PlaylistTitle>قائمة الدروس</PlaylistTitle>
              <PlaylistCount>{lessons.length} درس</PlaylistCount>
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
                      {lesson.duration && (
                        <LessonDuration>
                          <Clock size={11} />
                          {Math.ceil(lesson.duration / 60)} دقيقة
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
