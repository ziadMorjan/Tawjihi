import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, welcomeReward, clearWelcomeReward } = useAuth();
  const markedRef = useRef(false);

  const lang = i18n.resolvedLanguage ?? i18n.language;
  const isAr = lang === 'ar' || lang.startsWith('ar');
  const dateLocale = isAr ? 'ar-EG' : 'en-US';

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
    ? new Date(expire).toLocaleDateString(dateLocale, {
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
            <CloseBtn onClick={handleClose} aria-label={t('welcomeModal.close')}>✕</CloseBtn>

            {/* الأيقونة */}
            <IconWrap>
              <Ring $size="90px" />
              <Ring $size="120px" $delay="0.5s" />
              <Emoji>🎉</Emoji>
            </IconWrap>

            {/* الترحيب */}
            <Title id="wm-title">
              {t('welcomeModal.title', { name: user?.name ? (isAr ? `، ${user.name}` : `, ${user.name}`) : '' })}
            </Title>
            <Subtitle dangerouslySetInnerHTML={{ __html: t('welcomeModal.subtitle') }} />
            <GiftText>{t('welcomeModal.giftText')}</GiftText>

            {/* كود الخصم */}
            <CouponWrap>
              <CouponCode
                id="wm-coupon-code"
                onClick={copyToClipboard}
                title={t('welcomeModal.copyTooltip')}
              >
                <CouponText>{coupon}</CouponText>
                <CopyHint>{t('welcomeModal.copyBtn')}</CopyHint>
                <CopiedHint>{t('welcomeModal.copiedHint')}</CopiedHint>
              </CouponCode>
              <DiscountBadge>{t('welcomeModal.discountBadge', { discount })}</DiscountBadge>
            </CouponWrap>

            {expireDate && (
              <Expire dangerouslySetInnerHTML={{ __html: t('welcomeModal.expire', { date: expireDate }) }} />
            )}

            {/* الأزرار */}
            <Actions>
              <PrimaryBtn onClick={handleUseCoupon}>
                {t('welcomeModal.primaryBtn')}
              </PrimaryBtn>
              <SecondaryBtn onClick={handleClose}>
                {t('welcomeModal.secondaryBtn')}
              </SecondaryBtn>
            </Actions>
          </Card>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
