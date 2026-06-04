// src/features/courses/components/FiltersPanel/index.jsx
import { useSubjects, useBranches } from '../../hooks/useFiltersData';
import {
  PanelWrapper, FilterSection, FilterLabel,
  FilterOption, SortSelect, ClearButton,
} from './FiltersPanel.styles';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'الأحدث أولاً'    },
  { value: 'createdAt',  label: 'الأقدم أولاً'    },
  { value: 'price',      label: 'السعر: الأقل'    },
  { value: '-price',     label: 'السعر: الأعلى'   },
  { value: '-averageRating', label: 'الأعلى تقييماً' },
];

export function FiltersPanel({ filters, setFilter, clearFilters, hasActiveFilters, mobileOpen }) {
  const { data: subjects = [] } = useSubjects();
  const { data: branches = [] } = useBranches();

  // 🟡 نستخرج الـ array من الـ response
  const subjectsList = Array.isArray(subjects) ? subjects : subjects.subjects ?? [];
  const branchesList = Array.isArray(branches) ? branches : branches.branches ?? [];

  return (
    <PanelWrapper $mobileOpen={mobileOpen}>

      {/* Sort */}
      <FilterSection>
        <FilterLabel>الترتيب</FilterLabel>
        <SortSelect
          value={filters.sort}
          onChange={(e) => setFilter('sort', e.target.value)}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </SortSelect>
      </FilterSection>

      {/* Subjects */}
      {subjectsList.length > 0 && (
        <FilterSection>
          <FilterLabel>المادة</FilterLabel>
          {subjectsList.map(subject => (
            <FilterOption
              key={subject._id}
              $active={filters.subject === subject._id}
              onClick={() => setFilter(
                'subject',
                filters.subject === subject._id ? '' : subject._id
              )}
            >
              {subject.name}
            </FilterOption>
          ))}
        </FilterSection>
      )}

      {/* Branches */}
      {branchesList.length > 0 && (
        <FilterSection>
          <FilterLabel>الفرع</FilterLabel>
          {branchesList.map(branch => (
            <FilterOption
              key={branch._id}
              $active={filters.branch === branch._id}
              onClick={() => setFilter(
                'branch',
                filters.branch === branch._id ? '' : branch._id
              )}
            >
              {branch.name}
            </FilterOption>
          ))}
        </FilterSection>
      )}

      {/* Clear */}
      {hasActiveFilters && (
        <ClearButton onClick={clearFilters}>
          مسح الفلاتر
        </ClearButton>
      )}

    </PanelWrapper>
  );
}