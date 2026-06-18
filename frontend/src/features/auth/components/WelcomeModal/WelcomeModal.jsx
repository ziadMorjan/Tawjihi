import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../../constants';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { welcomeApi } from '../../api/welcomeApi';
import {
  Overlay,
  Card,
  CloseBtn,
  IconWrap,
  Emoji,
  Ring,
  Title,
  Subtitle,
  GiftText,
  CouponWrap,
  CouponCode,
  CouponText,
  CopyHint,
  CopiedHint,
  DiscountBadge,
  Expire,
  Actions,
  PrimaryBtn,
  SecondaryBtn,
  ConfettiContainer,
  ConfettiPiece,
} from './WelcomeModal.styles';

/* ─── Framer Motion variants ─── */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.93 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 22, stiffness: 260, delay: 0.05 },
  },
  exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } },
};

/**
 * WelcomeModal — يظهر مرة واحدة فقط عند أول تسجيل دخول
 * البيانات (كود الخصم، الخصم، الانتهاء) تأتي من الـ Backend
 */
export function WelcomeModal() {
  const navigate = useNavigate();
  const { user, welcomeReward, clearWelcomeReward } = useAuth();
  const markedRef = useRef(false);

  const handleClose = useCallback(async () => {
    if (markedRef.current) return;
    markedRef.current = true;
    try {
      await welcomeApi.markWelcomeSeen();
    } catch (_) {
      // silent fail
    } finally {
      clearWelcomeReward();
    }
  }, [clearWelcomeReward]);

  const handleUseCoupon = useCallback(async () => {
    await handleClose();
    navigate(PATH.courses);
  }, [handleClose, navigate]);

  // إغلاق عند Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    if (welcomeReward) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [welcomeReward, handleClose]);

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(coupon);
    const el = document.getElementById('wm-coupon-code');
    if (el) {
      el.classList.add('copied');
      setTimeout(() => el.classList.remove('copied'), 1500);
    }
  };

  const { coupon, discount, expire } = welcomeReward ?? {};

  const expireDate = expire
    ? new Date(expire).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <AnimatePresence>
      {welcomeReward && (
        <Overlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          {/* Confetti */}
          <ConfettiContainer aria-hidden="true">
            {Array.from({ length: 20 }).map((_, i) => (
              <ConfettiPiece key={i} $i={i} />
            ))}
          </ConfettiContainer>

          <Card
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wm-title"
          >
            {/* زر الإغلاق */}
            <CloseBtn onClick={handleClose} aria-label="إغلاق">✕</CloseBtn>

            {/* الأيقونة */}
            <IconWrap>
              <Ring $size="90px" />
              <Ring $size="120px" $delay="0.5s" />
              <Emoji>🎉</Emoji>
            </IconWrap>

            {/* الترحيب */}
            <Title id="wm-title">
              أهلاً وسهلاً{user?.name ? `، ${user.name}` : ''}!
            </Title>
            <Subtitle>
              يسعدنا انضمامك إلى منصة <strong>توجيهي</strong>
            </Subtitle>
            <GiftText>حصلت على كود خصم حصري لأول طلب:</GiftText>

            {/* كود الخصم */}
            <CouponWrap>
              <CouponCode
                id="wm-coupon-code"
                onClick={copyToClipboard}
                title="اضغط للنسخ"
              >
                <CouponText>{coupon}</CouponText>
                <CopyHint>انسخ</CopyHint>
                <CopiedHint>✓ تم النسخ!</CopiedHint>
              </CouponCode>
              <DiscountBadge>خصم {discount}%</DiscountBadge>
            </CouponWrap>

            {expireDate && (
              <Expire>صالح حتى: <strong>{expireDate}</strong></Expire>
            )}

            {/* الأزرار */}
            <Actions>
              <PrimaryBtn onClick={handleUseCoupon}>
                استخدم الكود الآن
              </PrimaryBtn>
              <SecondaryBtn onClick={handleClose}>
                ربما لاحقاً
              </SecondaryBtn>
            </Actions>
          </Card>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
