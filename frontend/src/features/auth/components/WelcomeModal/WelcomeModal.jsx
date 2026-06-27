import { useEffect, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../shared/hooks/useLanguage';
import { PATH } from '../../../../constants';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { welcomeApi } from '../../api/welcomeApi';
import {
  Overlay,
  Card,
  CloseBtn,
  IconWrap,
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
  overlayVariants,
  cardVariants
} from './WelcomeModal.styles';



export function WelcomeModal() {
  const { t, isAr } = useLanguage();
  const navigate = useNavigate();
  const { user, welcomeReward, clearWelcomeReward } = useAuth();
  const markedRef = useRef(false);
  const [isCopied, setIsCopied] = useState(false);

  const dateLocale = isAr ? 'ar-EG' : 'en-US';
  const { coupon, discount, expire } = welcomeReward ?? {};

  
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

  const copyToClipboard = useCallback(() => {
    if (!coupon) return;
    navigator.clipboard?.writeText(coupon);
    setIsCopied(true);
  }, [coupon]);

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [isCopied]);

  // إعادة تعيين markedRef عند إغلاق/تصفير الترحيب لمنع حظر الإغلاق في المرات القادمة
  useEffect(() => {
    if (!welcomeReward) {
      markedRef.current = false;
    }
  }, [welcomeReward]);


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
                className={isCopied ? 'copied' : ''}
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
