// src/features/courses/hooks/useFiltersData.js
// جلب بيانات الفلاتر — مرة واحدة وتُخزّن في الـ cache

import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../shared/lib/axiosInstance';

const fetchSubjects = async () => {
  const { data } = await axiosInstance.get('/subjects');
  return data.data ?? data;
};

const fetchBranches = async () => {
  const { data } = await axiosInstance.get('/branches');
  return data.data ?? data;
};

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
    staleTime: Infinity, // المواد الدراسية ما بتتغير كثير
    refetchOnWindowFocus: false,
  });
}

export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}