import React, { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { welcomeApi } from '../../api/welcomeApi';
import './WelcomeModal.css';

/**
 * WelcomeModal — يظهر مرة واحدة فقط عند أول تسجيل دخول
 * البيانات (كود الخصم، الخصم، الانتهاء) تأتي من الـ Backend
 */
export function WelcomeModal() {
  const navigate = useNavigate();
  const { user, welcomeReward, clearWelcomeReward } = useAuth();
  const markedRef = useRef(false);

  const handleClose = useCallback(async () => {
    // نمنع الإرسال المزدوج
    if (markedRef.current) return;
    markedRef.current = true;

    try {
      await welcomeApi.markWelcomeSeen();
    } catch (_) {
      // silent fail — الأهم أن الـ UI يُغلق
    } finally {
      clearWelcomeReward();
    }
  }, [clearWelcomeReward]);

  const handleUseCoupon = useCallback(async () => {
    await handleClose();
    navigate('/courses');
  }, [handleClose, navigate]);

  // إغلاق عند الضغط على Escape
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

  if (!welcomeReward) return null;

  const { coupon, discount, expire } = welcomeReward;

  const expireDate = expire
    ? new Date(expire).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(coupon);
    // flash animation بدون toast — بسيطة ونظيفة
    const el = document.getElementById('wm-coupon-code');
    if (el) {
      el.classList.add('copied');
      setTimeout(() => el.classList.remove('copied'), 1500);
    }
  };

  return (
    <div className="wm-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      {/* Confetti particles */}
      <div className="wm-confetti" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="wm-confetti-piece" style={{ '--i': i }} />
        ))}
      </div>

      <div className="wm-card" role="dialog" aria-modal="true" aria-labelledby="wm-title">
        {/* زر الإغلاق */}
        <button className="wm-close-btn" onClick={handleClose} aria-label="إغلاق">
          ✕
        </button>

        {/* الأيقونة */}
        <div className="wm-icon-wrap">
          <div className="wm-ring wm-ring-1" />
          <div className="wm-ring wm-ring-2" />
        </div>

        {/* الترحيب */}
        <h2 className="wm-title" id="wm-title">
          أهلاً وسهلاً{user?.name ? `، ${user.name}` : ''}!
        </h2>
        <p className="wm-subtitle">
          يسعدنا انضمامك إلى منصة <strong>توجيهي</strong> 
        </p>
        <p className="wm-gift-text">
           حصلت على كود خصم حصري لأول طلب:
        </p>

        {/* كود الخصم */}
        <div className="wm-coupon-wrap">
          <button
            id="wm-coupon-code"
            className="wm-coupon-code"
            onClick={copyToClipboard}
            title="اضغط للنسخ"
          >
            <span className="wm-coupon-text">{coupon}</span>
            <span className="wm-copy-hint"> انسخ</span>
            <span className="wm-copied-hint"> تم النسخ!</span>
          </button>
          <p className="wm-discount-badge">خصم {discount}%</p>
        </div>

        {expireDate && (
          <p className="wm-expire"> صالح حتى: <strong>{expireDate}</strong></p>
        )}

        {/* الأزرار */}
        <div className="wm-actions">
          <button className="wm-btn-primary" onClick={handleUseCoupon}>
             استخدم الكود الآن
          </button>
          <button className="wm-btn-secondary" onClick={handleClose}>
            ربما لاحقاً
          </button>
        </div>
      </div>
    </div>
  );
}
