// src/features/courses/components/Pagination/index.jsx
import styled, { css } from 'styled-components';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[10]};
`;

const PageBtn = styled.button`
  min-width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing[3]};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  ${({ $active, theme }) => $active && css`
    background: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
    color: white;
    font-weight: ${theme.typography.fontWeight.semibold};

    &:hover {
      background: ${theme.colors.primaryHover};
      border-color: ${theme.colors.primaryHover};
      color: white;
    }
  `}
`;

const PageInfo = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0 ${({ theme }) => theme.spacing[2]};
`;

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // نحسب الصفحات اللي تظهر — max 5
  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4, totalPages - 3, totalPages - 2,
        totalPages - 1, totalPages,
      ];
    }
    return [
      currentPage - 2, currentPage - 1, currentPage,
      currentPage + 1, currentPage + 2,
    ];
  };

  return (
    <Wrapper>
      {/* زر السابق */}
      <PageBtn
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="الصفحة السابقة"
      >
        <ChevronRight size={18} />
      </PageBtn>

      {/* أرقام الصفحات */}
      {getPages().map(page => (
        <PageBtn
          key={page}
          $active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </PageBtn>
      ))}

      {/* زر التالي */}
      <PageBtn
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="الصفحة التالية"
      >
        <ChevronLeft size={18} />
      </PageBtn>

      <PageInfo>
        {currentPage} / {totalPages}
      </PageInfo>
    </Wrapper>
  );
}