import type { CrudDataTableColumn } from '@/components/common/CrudDataTable';
import type { CrudTableColumnOption } from '@/components/common/CrudTableControls';
import type { User } from '@/api/users.api';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal, useOverlayState } from '@heroui/react';
import { PlusIcon, Trash2Icon } from 'lucide-react';

import SuperCrud from '@/components/common/SuperCrud';
import { createUser, deleteUser, getUsers } from '@/api/users.api';

const INPUT =
  'w-full rounded-lg border border-default-200 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';

export default function UsersPage() {
  const addModal    = useOverlayState();
  const deleteModal = useOverlayState();

  const [items, setItems]           = useState<User[]>([]);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [selected, setSelected]     = useState<User | null>(null);
  const [form, setForm]             = useState({ nombre: '', correo: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const [columns, setColumns]       = useState<CrudTableColumnOption[]>([
    { key: 'nombre',   label: 'Nombre',   visible: true },
    { key: 'correo',   label: 'Correo',   visible: true },
    { key: 'creado',   label: 'Creado',   visible: true },
    { key: 'acciones', label: 'Acciones', visible: true },
  ]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await getUsers());
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // La API devuelve la lista completa: búsqueda y paginación se hacen en el cliente.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? items.filter((u) => u.nombre.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q))
      : items;
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current    = Math.min(page, totalPages);
  const rows       = filtered.slice((current - 1) * pageSize, current * pageSize);

  const run = async (action: () => Promise<unknown>, close: () => void) => {
    setError('');
    setSubmitting(true);
    try {
      await action();
      close();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
    } finally {
      setSubmitting(false);
    }
  };

  const allColumns: CrudDataTableColumn<User>[] = [
    { key: 'nombre', header: 'Nombre', sortable: true, render: (u: User) => <span className="text-sm">{u.nombre}</span> },
    { key: 'correo', header: 'Correo', sortable: true, render: (u: User) => <span className="text-sm">{u.correo}</span> },
    {
      key: 'creado',
      header: 'Creado',
      sortable: true,
      render: (u: User) => <span className="text-sm text-muted">{new Date(u.creado).toLocaleDateString('es-MX')}</span>,
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (u: User) => (
        <Button
          size="sm"
          variant="outline"
          isIconOnly
          aria-label="Eliminar usuario"
          className="border-danger text-danger hover:bg-danger/10"
          onPress={() => { setSelected(u); setError(''); deleteModal.open(); }}
        >
          <Trash2Icon className="size-4" />
        </Button>
      ),
    },
  ];
  const tableColumns = allColumns.filter((c) => columns.find((o) => o.key === c.key)?.visible ?? true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Usuarios</h1>
        <p className="text-sm text-muted">Registros de la tabla usuarios (MySQL)</p>
      </div>

      <SuperCrud
        title="Usuarios"
        subtitle="Datos de la API /usuarios"
        searchTerm={search}
        onSearchTermChange={(v: string) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Buscar por nombre o correo..."
        columnOptions={columns}
        onToggleColumn={(key: string, visible: boolean) =>
          setColumns((prev) => prev.map((c) => (c.key === key ? { ...c, visible } : c)))}
        onReload={load}
        toolbarActions={
          <Button size="sm" onPress={() => { setError(''); addModal.open(); }}>
            <PlusIcon className="size-4" /> Agregar usuario
          </Button>
        }
        tableColumns={tableColumns}
        data={rows}
        isLoading={loading}
        rowKey={(u: User) => String(u.id)}
        emptyMessage="No hay usuarios registrados"
        pagination={{
          page: current,
          pageSize,
          total: filtered.length,
          totalPages,
          from: filtered.length ? (current - 1) * pageSize + 1 : 0,
          to: Math.min(current * pageSize, filtered.length),
          onPageChange: setPage,
          onPageSizeChange: (ps: number) => { setPageSize(ps); setPage(1); },
        }}
      />

      <Modal.Backdrop isOpen={addModal.isOpen} onOpenChange={addModal.setOpen}>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header><Modal.Heading>Agregar usuario</Modal.Heading></Modal.Header>
            <Modal.Body>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input className={INPUT} value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Correo electrónico</label>
                  <input type="email" className={INPUT} placeholder="usuario@ucol.mx" value={form.correo}
                    onChange={(e) => setForm({ ...form, correo: e.target.value })} />
                </div>
                {error && <p className="text-sm text-danger">{error}</p>}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="outline" isDisabled={submitting}>Cancelar</Button>
              <Button
                isDisabled={submitting || !form.nombre || !form.correo}
                onPress={() => run(async () => { await createUser(form); setForm({ nombre: '', correo: '' }); }, addModal.close)}
              >
                {submitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

      <Modal.Backdrop isOpen={deleteModal.isOpen} onOpenChange={deleteModal.setOpen}>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header><Modal.Heading>Eliminar usuario</Modal.Heading></Modal.Header>
            <Modal.Body>
              <p className="text-sm">¿Eliminar a <strong>{selected?.nombre}</strong>?</p>
              {error && <p className="text-sm text-danger mt-2">{error}</p>}
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="outline" isDisabled={submitting}>Cancelar</Button>
              <Button
                className="bg-danger text-white hover:bg-danger/90"
                isDisabled={submitting}
                onPress={() => selected && run(() => deleteUser(selected.id), deleteModal.close)}
              >
                {submitting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  );
}
