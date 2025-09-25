import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import livestockService, { Livestock } from '../services/livestockService';
import { ErrorHandler } from '../utils/errorHandler';
import authService from '../services/authService';

export const useLivestock = () => {
  const queryClient = useQueryClient();

  const livestock = useQuery({
    queryKey: ['livestock'],
    queryFn: () => livestockService.getAll(),
    enabled: authService.isAuthenticated(),
    retry: false,
    staleTime: 1000 * 30,
  });

  const createLivestock = useMutation({
    mutationFn: (data: Omit<Livestock, 'id'>) => livestockService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
    },
    onError: ErrorHandler.showError,
  });

  const updateLivestock = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Livestock> }) =>
      livestockService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
    },
    onError: ErrorHandler.showError,
  });

  const deleteLivestock = useMutation({
    mutationFn: (id: number) => livestockService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
    },
    onError: ErrorHandler.showError,
  });

  return {
    livestock: livestock.data || [],
    isLoading: livestock.isLoading,
    isFetching: livestock.isFetching,
    error: livestock.error as unknown as Error | null,
    createLivestock,
    updateLivestock,
    deleteLivestock,
    refetch: livestock.refetch,
  };
};

// Hook for specific livestock
export const useLivestockById = (id: number) => {
  return useQuery({
    queryKey: ['livestock', id],
    queryFn: () => livestockService.getById(id),
    enabled: !!id,
  });
};
