/**
 * Use Fetch Query Hook
 * @param queryKey - The query key.
 * @param queryFn - The query function.
 * @param config - The query configuration.
 * @returns The query result.
 * @template TData - The query data type.
 * @template TError - The query error type.
 * @example
 * const { data, isLoading, error } = useQueryFetch({
 *  queryKey: ['tramites'],
 * queryFn: getTramites,
 * config: {
 * onError: (error: Error) => {
 * notification.error({
 * message: 'Error al cargar trámites',
 * description: error.message,
 * });
 * }
 * }
 * });
 * @see https://tanstack.com/query/latest/docs/framework/react/overview
 */
import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';

type QueryConfig<TData, TError> = {
  enabled?: boolean;
  retry?: boolean | number;
  staleTime?: number;
  cacheTime?: number;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
};

type MutationConfig<TData, TError, TVariables> = {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onMutate?: (variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: TError | null) => void;
};

export const useQueryFetch = <TData, TError = Error>({
  queryKey,
  queryFn,
  config = {}
}: {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  config?: QueryConfig<TData, TError>;
}) => {
  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...config
  });
};

export const useMutationFetch = <TData, TError = Error, TVariables = unknown>({
  queryKey,
  mutationFn,
  config = {}
}: {
  queryKey: QueryKey;
  mutationFn: (variables: TVariables) => Promise<TData>;
  config?: MutationConfig<TData, TError, TVariables>;
}) => {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>({
    mutationFn,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    ...config
  });
};