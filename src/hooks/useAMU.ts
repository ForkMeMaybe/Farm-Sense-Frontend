import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { amuService, AMURecord } from '../services/farmService';
import { ErrorHandler } from '../utils/errorHandler';
import authService from '../services/authService';

export const useAMU = () => {
  const queryClient = useQueryClient();

  const amuRecords = useQuery({
    queryKey: ['amu-records'],
    queryFn: () => amuService.getAll(),
    enabled: authService.isAuthenticated(),
    retry: false,
  });

  const createAMURecord = useMutation({
    mutationFn: (data: Omit<AMURecord, 'id'>) => amuService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amu-records'] });
    },
    onError: (error) => ErrorHandler.showError(error as any),
  });

  const generateInsights = useMutation({
    mutationFn: (livestockId: number) => amuService.generateInsights(livestockId),
    onError: (error) => ErrorHandler.showError(error as any),
  });

  const chartData = useMutation({
    mutationFn: (livestockId: number) => amuService.getChartData(livestockId),
    onError: (error) => ErrorHandler.showError(error as any),
  });

  return {
    amuRecords: amuRecords.data || [],
    isLoading: amuRecords.isLoading,
    isFetching: amuRecords.isFetching,
    error: amuRecords.error as unknown as Error | null,
    createAMURecord,
    generateInsights,
    chartData,
    refetch: amuRecords.refetch,
  };
};

export const useAMUByLivestock = (livestockId: number) => {
  return useQuery({
    queryKey: ['amu-records', 'livestock', livestockId],
    queryFn: () => amuService.getByLivestock(livestockId),
    enabled: !!livestockId,
  });
};
