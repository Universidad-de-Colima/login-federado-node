/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Hook para realizar operaciones CRUD sobre una entidad.
 * @param getAll Función que obtiene todos los items.
 * @param create Función que crea un item.
 * @param update Función que actualiza un item.
 * @param delete Función que elimina un item.
 * @param idField Campo que identifica a cada item.
 * @param entityName Nombre de la entidad.
 * @returns Objeto con los datos y funciones necesarios para realizar las operaciones CRUD.
 */
import { useQueryFetch, useMutationFetch } from '@/hooks/useFetchQuery';
import { openNotification } from 'ucol-ui';
import { useId } from 'react';

type CrudOperations<T, CreateT = T> = {
  getAll: () => Promise<{ data: T[], error?: boolean, message?: string }>;
  create?: (item: CreateT) => Promise<{ data: T, error?: boolean, message?: string }>;
  update?: (item: T) => Promise<{ data: T, error?: boolean, message?: string }>;
  delete?: (item: T | { [key: string]: any }) => Promise<{ data: T, error?: boolean, message?: string }>;
  idField?: string;
  entityName?: string;
};

export function useCrudOperations<T extends { [key: string]: any }, CreateT = Omit<T, 'id'>>({
  getAll,
  create,
  update,
  delete: deleteItem,
  idField = 'id',
  entityName = 'item',
}: CrudOperations<T, CreateT>) {
  const KEY = [`crud-${entityName}-${idField}`, useId()];

  // Consulta para obtener todos los items
  const {
    data = [],
    isLoading,
    refetch
  } = useQueryFetch({
    queryKey: KEY,
    queryFn: async () => {
      const response = await getAll();
      return response.data ?? [];
    },
    config: {
      onError: (error: Error) => openNotification('error', 'Error al cargar los datos', error.message),
    },
  });

  // Mapeo de acciones a mensajes de error
  const errorMessages = {
    creado: 'crear',
    actualizado: 'actualizar',
    eliminado: 'eliminar',
  };

  // Configuración común para las mutaciones
  const getMutationConfig = (action: keyof typeof errorMessages) => ({
    queryKey: KEY,
    config: {
      onSuccess: () => {
        openNotification('success', `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} ${action} exitosamente`, '');
        refetch();
      },
      onError: (error: Error) =>
        openNotification('error', `Error al ${errorMessages[action]} el ${entityName}`, error.message),
    },
  });

  // Mutación para crear un item
  const { mutateAsync: createItemAsync } = useMutationFetch<T, Error, CreateT>({
    ...getMutationConfig('creado'),
    mutationFn: async (item: CreateT) => {
      if (!create) {
        throw new Error('Create function is not defined');
      }
      const response = await create(item);
      if (response.error) {
        throw new Error(response.data.errors);
      }
      return response.data;
    },
  });

  // Mutación para actualizar un item
  const { mutateAsync: updateItemAsync } = useMutationFetch<T, Error, T>({
    ...getMutationConfig('actualizado'),
    mutationFn: async (item: T) => {
      if (!update) {
        throw new Error('Update function is not defined');
      }
      const response = await update(item);
      if (response.error) {
        throw new Error(response.message);
      }
      return response.data;
    },
  });

  // Mutación para eliminar un item
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

  // Handlers para las operaciones
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

  return {
    data,
    isLoading,
    refetch,
    handleCreate,
    handleUpdate,
    handleDelete,
    createItemAsync,
    updateItemAsync,
    deleteItemAsync
  };
}