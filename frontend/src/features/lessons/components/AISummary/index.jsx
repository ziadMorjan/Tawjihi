import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Sparkles, Loader } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
  background: ${({ theme }) => theme.colors.bgSecondary || '#FFFFFF'};
  border: 1px solid ${({ theme }) => theme.colors.border || '#E2E8F0'};
  border-radius: 16px;
  padding: 24px;
  margin-top: 16px;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.card || '0 2px 8px rgba(0,0,0,0.06)'};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border || '#E2E8F0'};
  padding-bottom: 12px;
`;

const Title = styled.h4`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textPrimary || '#0F172A'};
  font-size: 1.1rem;
  font-weight: 700;
`;

const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border || '#E2E8F0'};
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary || '#64748B'};
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bgPrimary || '#F8FAFC'};
    color: ${({ theme }) => theme.colors.primary[500] || '#0D7FA3'};
    border-color: ${({ theme }) => theme.colors.primary[500] || '#0D7FA3'};
  }
`;

const MarkdownBody = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary || '#334155'};
  font-size: 0.95rem;
  line-height: 1.7;

  h1, h2, h3, h4 {
    color: ${({ theme }) => theme.colors.textPrimary || '#0F172A'};
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
  }

  p {
    margin-bottom: 1rem;
  }

  ul, ol {
    margin-bottom: 1rem;
    padding-inline-start: 20px;
  }

  li {
    margin-bottom: 0.5rem;
  }

  code {
    background: ${({ theme }) => theme.colors.bgPrimary || '#F1F5F9'};
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
`;

const SparkleBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500] || '#0D7FA3'}, ${({ theme }) => theme.colors.accent[500] || '#C8893A'});
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 12px rgba(13, 127, 163, 0.25);
  transition: all 0.2s ease;
  animation: ${pulse} 2s infinite ease-in-out;

  &:hover {
    box-shadow: 0 6px 16px rgba(13, 127, 163, 0.4);
    transform: translateY(-2px);
  }

  &:disabled {
    animation: none;
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SpinningLoader = styled(Loader)`
  animation: ${rotate} 1.5s linear infinite;
`;

const GeneratingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors.primary[500] || '#0D7FA3'};
  font-weight: 600;
`;

export default function AISummary({ summary, isGenerating, onGenerate }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isGenerating) {
    return (
      <Container>
        <GeneratingWrapper>
          <SpinningLoader size={36} />
          <span>{t('aiSummary.generating')}</span>
        </GeneratingWrapper>
      </Container>
    );
  }

  if (!summary) {
    return (
      <Container>
        <EmptyState>
          <SparkleBtn onClick={onGenerate}>
            <Sparkles size={18} />
            {t('aiSummary.generateBtn')}
          </SparkleBtn>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <Sparkles size={18} style={{ color: '#C8893A' }} />
          {t('aiSummary.title')}
        </Title>
        <ActionBtn onClick={handleCopy}>
          {copied ? <Check size={14} style={{ color: '#16A34A' }} /> : <Copy size={14} />}
          {copied ? t('aiSummary.copied') : t('aiSummary.copyBtn')}
        </ActionBtn>
      </Header>
      <MarkdownBody>
        <ReactMarkdown>{summary}</ReactMarkdown>
      </MarkdownBody>
    </Container>
  );
}
