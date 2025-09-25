import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authService, { LoginCredentials, User } from '../services/authService';
import { ErrorHandler } from '../utils/errorHandler';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
    onError: (error) => {
      ErrorHandler.showError(error);
    },
  });

  const registerFarmOwner = useMutation({
    mutationFn: (data: {
      email: string;
      username: string;
      password: string;
      re_password: string;
      farm_name: string;
      farm_location: string;
    }) => authService.registerFarmOwner(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
    onError: (error) => {
      ErrorHandler.showError(error);
    },
  });

  const registerLabourer = useMutation({
    mutationFn: (data: {
      email: string;
      username: string;
      password: string;
      re_password: string;
    }) => authService.registerLabourer(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
    onError: (error) => {
      ErrorHandler.showError(error);
    },
  });

  const user = useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
    enabled: authService.isAuthenticated(),
    retry: false,
  });

  const logout = () => {
    authService.logout();
    queryClient.clear();
  };

  return {
    login,
    registerFarmOwner,
    registerLabourer,
    logout,
    user: user.data,
    isLoading: user.isLoading || login.isPending || registerFarmOwner.isPending || registerLabourer.isPending,
    isAuthenticated: authService.isAuthenticated(),
  };
};
