import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

/* ─── Keyframes (للأشياء اللي مش Framer Motion) ─── */

const wmBounce = keyframes`
  from { transform: translateY(0); }
  to   { transform: translateY(-10px); }
`;

const wmPulse = keyframes`
  0%   { transform: scale(0.8);  opacity: 0.7; }
  100% { transform: scale(1.35); opacity: 0;   }
`;

const wmConfettiFall = keyframes`
  0%   { opacity: 1; transform: translateY(0)    rotate(0deg)   scaleX(1);  }
  50%  { opacity: 1; transform: translateY(45vh) rotate(180deg) scaleX(-1); }
  100% { opacity: 0; transform: translateY(90vh) rotate(360deg) scaleX(1);  }
`;

/* ─── Overlay — motion.div ─── */
export const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(10, 15, 40, 0.65);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

/* ─── Card — motion.div ─── */
export const Card = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 28px;
  padding: 48px 36px 36px;
  text-align: center;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.06),
    0 32px 64px -12px rgba(79, 70, 229, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset;
  overflow: hidden;
  direction: rtl;

  /* خلفية زخرفية — pseudo elements */
  &::before {
    content: '';
    position: absolute;
    top: -80px;
    right: -80px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(167, 139, 250, 0.22) 0%, transparent 70%);
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -60px;
    left: -60px;
    width: 180px;
    height: 180px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, transparent 70%);
    pointer-events: none;
  }

  @media (prefers-color-scheme: dark) {
    background: #1e1b2e;
    box-shadow:
      0 32px 64px -12px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.06) inset;
  }

  @media (max-width: 480px) {
    padding: 40px 20px 28px;
    border-radius: 20px;
  }
`;

/* ─── Close Button ─── */
export const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 50%;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s, transform 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.12);
    color: #1e293b;
    transform: rotate(90deg);
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.08);
    color: #94a3b8;
    &:hover {
      background: rgba(255, 255, 255, 0.14);
      color: #f1f5f9;
    }
  }
`;

/* ─── Icon ─── */
export const IconWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

export const Emoji = styled.span`
  font-size: 64px;
  line-height: 1;
  display: block;
  position: relative;
  z-index: 1;
  animation: ${wmBounce} 1.2s ease infinite alternate;

  @media (max-width: 480px) {
    font-size: 52px;
  }
`;

export const Ring = styled.div`
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(167, 139, 250, 0.35);
  animation: ${wmPulse} 2s ease-out infinite;
  animation-delay: ${({ $delay }) => $delay ?? '0s'};
  width: ${({ $size }) => $size ?? '90px'};
  height: ${({ $size }) => $size ?? '90px'};
`;

/* ─── Typography ─── */
export const Title = styled.h2`
  font-size: 1.65rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px;
  line-height: 1.3;

  @media (prefers-color-scheme: dark) { color: #f1f5f9; }
  @media (max-width: 480px) { font-size: 1.35rem; }
`;

export const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin: 0 0 16px;
  line-height: 1.6;

  @media (prefers-color-scheme: dark) { color: #94a3b8; }
`;

export const GiftText = styled.p`
  font-size: 0.95rem;
  color: #475569;
  margin: 0 0 16px;
  font-weight: 500;

  @media (prefers-color-scheme: dark) { color: #94a3b8; }
`;

/* ─── Coupon Block ─── */
export const CouponWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
`;

export const CouponCode = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border: 2.5px dashed #7c3aed;
  border-radius: 16px;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  cursor: pointer;
  font-family: 'Courier New', Courier, monospace;
  transition: transform 0.15s, box-shadow 0.15s;
  overflow: hidden;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.2);
  }

  /* حالة بعد النسخ */
  &.copied .wm-coupon-text,
  &.copied .wm-copy-hint { opacity: 0; }
  &.copied .wm-copied-hint { opacity: 1; }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, #2d2a4a, #1f1c3a);
    border-color: #7c3aed;
  }
`;

export const CouponText = styled.span.attrs({ className: 'wm-coupon-text' })`
  font-size: 1.4rem;
  font-weight: 800;
  color: #5b21b6;
  letter-spacing: 3px;
  text-transform: uppercase;
  transition: opacity 0.2s;

  @media (max-width: 480px) {
    font-size: 1.15rem;
    letter-spacing: 2px;
  }
`;

export const CopyHint = styled.span.attrs({ className: 'wm-copy-hint' })`
  font-size: 0.75rem;
  color: #7c3aed;
  opacity: 0.75;
  transition: opacity 0.2s;
`;

export const CopiedHint = styled.span.attrs({ className: 'wm-copied-hint' })`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  color: #065f46;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 14px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
`;

export const DiscountBadge = styled.p`
  display: inline-block;
  padding: 4px 16px;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: #fff;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin: 0;
`;

/* ─── Expire ─── */
export const Expire = styled.p`
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 0 0 24px;

  strong { color: #64748b; }
`;

/* ─── Actions ─── */
export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PrimaryBtn = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.45);
  }
  &:active { transform: translateY(0); opacity: 0.9; }
`;

export const SecondaryBtn = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 12px;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: #475569;
    background: rgba(0, 0, 0, 0.04);
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #cbd5e1;
    }
  }
`;

/* ─── Confetti ─── */
export const ConfettiContainer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  overflow: hidden;
`;

export const ConfettiPiece = styled.span`
  --i: ${({ $i }) => $i};
  position: absolute;
  top: -20px;
  left: calc(var(--i) * 5.2%);
  width: 8px;
  height: 14px;
  border-radius: 2px;
  opacity: 0;
  background: hsl(calc(var(--i) * 18), 80%, 58%);
  animation: ${wmConfettiFall} 3s ease-in calc(var(--i) * 0.15s) both;
  transform-origin: center bottom;
`;
