import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, RotateCw, AlertCircle } from 'lucide-react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  margin-top: 16px;
  width: 100%;
`;

const Hint = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary || '#64748B'};
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
`;

const CardContainer = styled.div`
  perspective: 1000px;
  width: 100%;
  max-width: 500px;
  height: 280px;
  margin: 16px 0;
  cursor: pointer;
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  
  &.flipped {
    transform: rotateY(180deg);
  }
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  box-shadow: ${({ theme }) => theme.shadows.lg || '0 10px 15px -3px rgba(0,0,0,0.07)'};
  box-sizing: border-box;
`;

const CardFront = styled(CardFace)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[50] || '#EDF6F9'}, #FFFFFF);
  border: 2px solid ${({ theme }) => theme.colors.primary[100] || '#C8E8F2'};
  color: ${({ theme }) => theme.colors.textPrimary || '#0F172A'};
`;

const CardBack = styled(CardFace)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent[50] || '#FDF6EC'}, #FFFFFF);
  border: 2px solid ${({ theme }) => theme.colors.accent[500] || '#C8893A'};
  color: ${({ theme }) => theme.colors.textPrimary || '#0F172A'};
  transform: rotateY(180deg);
`;

const ContentText = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
`;

const CardFooter = styled.span`
  position: absolute;
  bottom: 20px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary || '#64748B'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 12px;
`;

const RoundBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border || '#E2E8F0'};
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textPrimary || '#0F172A'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.bgPrimary || '#F8FAFC'};
    border-color: ${({ theme }) => theme.colors.primary[500] || '#0D7FA3'};
    color: ${({ theme }) => theme.colors.primary[500] || '#0D7FA3'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProgressText = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary || '#64748B'};
  min-width: 100px;
  text-align: center;
`;

const EmptyState = styled.div`
  background: ${({ theme }) => theme.colors.bgSecondary || '#FFFFFF'};
  border: 1px dashed ${({ theme }) => theme.colors.border || '#E2E8F0'};
  border-radius: 16px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary || '#64748B'};
  width: 100%;
  max-width: 500px;
`;

export default function Flashcards({ flashcards = [] }) {
  const { t, i18n } = useTranslation();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const lang = i18n.resolvedLanguage ?? i18n.language;
  const isRtl = lang === 'ar' || lang.startsWith('ar');

  // Reset card state when changing card or lesson
  useEffect(() => {
    setFlipped(false);
  }, [index, flashcards]);

  useEffect(() => {
    setIndex(0);
  }, [flashcards]);

  if (!flashcards || flashcards.length === 0) {
    return (
      <Container>
        <EmptyState>
          <AlertCircle size={32} style={{ color: '#C8893A' }} />
          <p style={{ margin: 0, fontWeight: 600 }}>{t('flashcards.generateFirst')}</p>
        </EmptyState>
      </Container>
    );
  }

  const currentCard = flashcards[index];
  const hasPrev = index > 0;
  const hasNext = index < flashcards.length - 1;

  const handleNext = () => {
    if (hasNext) setIndex((p) => p + 1);
  };

  const handlePrev = () => {
    if (hasPrev) setIndex((p) => p - 1);
  };

  return (
    <Container>
      <Hint>
        <RotateCw size={12} />
        {t('flashcards.flipHint')}
      </Hint>

      <CardContainer onClick={() => setFlipped(!flipped)}>
        <CardInner className={flipped ? 'flipped' : ''}>
          <CardFront>
            <ContentText>{currentCard.front}</ContentText>
            <CardFooter>
              <RotateCw size={10} /> {t('flashcards.flipHint')}
            </CardFooter>
          </CardFront>
          <CardBack>
            <ContentText>{currentCard.back}</ContentText>
            <CardFooter>
              <RotateCw size={10} /> {t('flashcards.flipHint')}
            </CardFooter>
          </CardBack>
        </CardInner>
      </CardContainer>

      <Controls>
        <RoundBtn onClick={isRtl ? handleNext : handlePrev} disabled={isRtl ? !hasNext : !hasPrev}>
          {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </RoundBtn>
        <ProgressText>
          {t('flashcards.progress', { current: index + 1, total: flashcards.length })}
        </ProgressText>
        <RoundBtn onClick={isRtl ? handlePrev : handleNext} disabled={isRtl ? !hasPrev : !hasNext}>
          {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </RoundBtn>
      </Controls>
    </Container>
  );
}
