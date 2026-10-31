/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Hook para operaciones CRUD paginadas del lado del servidor (page/per_page/search).
 * Variante de useCrudOperations pensada para listas grandes con paginación real en backend.
 */
import { useEffect, useId, useState } from 'react';
import { useQueryFetch, useMutationFetch } from '@/hooks/useFetchQuery';
import { openNotification } from 'ucol-ui';
import type { PaginatedResult } from '@/interfaces/pagination';

type ApiResponse<T> = { data: T; error?: boolean; message?: string };

type PaginatedCrudOperations<T, CreateT = T> = {
  getAllPaginated: (params: { page: number; per_page: number; search?: string }) => Promise<ApiResponse<PaginatedResult<T>>>;
  create?: (item: CreateT) => Promise<ApiResponse<T>>;
  update?: (item: T) => Promise<ApiResponse<T>>;
  delete?: (item: T | { [key: string]: any }) => Promise<ApiResponse<T>>;
  idField?: string;
  entityName?: string;
  pageSize?: number;
  searchDebounceMs?: number;
};

export function usePaginatedCrud<T extends { [key: string]: any }, CreateT = Omit<T, 'id'>>({
  getAllPaginated,
  create,
  update,
  delete: deleteItem,
  idField = 'id',
  entityName = 'item',
  pageSize: initialPageSize = 10,
  searchDebounceMs = 350,
}: PaginatedCrudOperations<T, CreateT>) {
  const KEY_BASE = [`paginated-crud-${entityName}-${idField}`, useId()];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce de búsqueda: evita disparar una request por cada tecla.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchTerm.trim()), searchDebounceMs);
    return () => clearTimeout(timeout);
  }, [searchTerm, searchDebounceMs]);

  // Toda búsqueda nueva reinicia a la primera página.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const KEY = [...KEY_BASE, page, pageSize, debouncedSearch];

  const {
    data: response,
    isLoading,
    refetch,
  } = useQueryFetch({
    queryKey: KEY,
    queryFn: async () => {
      const result = await getAllPaginated({
        page,
        per_page: pageSize,
        search: debouncedSearch || undefined,
      });
      return result.data;
    },
    config: {
      onError: (error: Error) => openNotification('error', 'Error al cargar los datos', error.message),
    },
  });

  const data = response?.items ?? [];
  const meta = response?.pagination;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(1, meta?.last_page ?? 1);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(page * pageSize, total);

  const errorMessages = {
    creado: 'crear',
    actualizado: 'actualizar',
    eliminado: 'eliminar',
  };

  const getMutationConfig = (action: keyof typeof errorMessages) => ({
    queryKey: KEY_BASE,
    config: {
      onSuccess: () => {
        openNotification('success', `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} ${action} exitosamente`, '');
        refetch();
      },
      onError: (error: Error) =>
        openNotification('error', `Error al ${errorMessages[action]} el ${entityName}`, error.message),
    },
  });

  const { mutateAsync: createItemAsync } = useMutationFetch<T, Error, CreateT>({
    ...getMutationConfig('creado'),
    mutationFn: async (item: CreateT) => {
      if (!create) {
        throw new Error('Create function is not defined');
      }
      const response = await create(item);
      if (response.error) {
        throw new Error(response.message ?? 'Error al crear');
      }
      return response.data;
    },
  });

  const { mutateAsync: updateItemAsync } = useMutationFetch<T, Error, T>({
    ...getMutationConfig('actualizado'),
    mutationFn: async (item: T) => {
      if (!update) {
        throw new Error('Update function is not defined');
      }
      const response = await update(item);
      if (response.error) {
        throw new Error(response.message ?? 'Error al actualizar');
      }
      return response.data;
    },
  });

  const { mutateAsync: deleteItemAsync } = useMutationFetch<T, Error, T>({
    ...getMutationConfig('eliminado'),
    mutationFn: async (item: T) => {
      if (!deleteItem) {
        throw new Error('Delete function is not defined');
      }
      const response = await deleteItem(item);
      return response.data;
    },
  });

  const handleCreate = async (values: Record<string, unknown>) => {
    const item = values as unknown as CreateT;
    return await createItemAsync(item);
  };

  const handleUpdate = async (record: unknown) => {
    const item = record as T;
    return await updateItemAsync(item);
  };

  const handleDelete = async (record: unknown) => {
    const item = record as T;
    return await deleteItemAsync(item);
  };

  const handlePageChange = (newPage: number) => setPage(Math.min(Math.max(1, newPage), totalPages));
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  return {
    data,
    isLoading,
    refetch,
    handleCreate,
    handleUpdate,
    handleDelete,
    createItemAsync,
    updateItemAsync,
    deleteItemAsync,
    searchTerm,
    setSearchTerm,
    page,
    pageSize,
    total,
    totalPages,
    from,
    to,
    handlePageChange,
    handlePageSizeChange,
  };
}
