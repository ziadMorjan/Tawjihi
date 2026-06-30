import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { COUPONS_KEY } from './useAdminActions';

export function useCoupons() {
  const { data, isLoading } = useQuery({
    queryKey: COUPONS_KEY,
    queryFn: adminApi.getCoupons,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  return { coupons: data ?? [], isLoading };
}
