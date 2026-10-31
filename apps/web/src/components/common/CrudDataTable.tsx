import { useState, type ReactNode } from "react";
import type { SortDescriptor } from "@heroui/react";
import {
	Table,
	TableScrollContainer,
	TableContent,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	TableSortableColumnHeader,
	Skeleton,
	EmptyState,
} from "@heroui/react";
import CrudColumnFilter from "./CrudColumnFilter";

const ROW_BORDER_CLASS =
	"border-b border-gray-200 dark:border-ucol_gray_dark-400 last:border-b-0";

export interface CrudDataTableColumn<T> {
	key: string;
	header: ReactNode;
	render?: (row: T) => ReactNode;
	className?: string;
	sortable?: boolean;
	filterable?: boolean;
	getValue?: (row: T) => string | number | null | undefined;
	/** Oculta la columna por debajo del breakpoint `md` */
	hideOnMobile?: boolean;
	/** Columna de acciones: no se puede ocultar desde el selector de columnas */
	isAction?: boolean;
}

export interface CrudDataTableSortState {
	key: string;
	direction: "asc" | "desc";
}

interface CrudDataTableProps<T> {
	columns: CrudDataTableColumn<T>[];
	data: T[];
	isLoading: boolean;
	rowKey: (row: T, index: number) => string;
	loadingRows?: number;
	emptyMessage?: string;
	/** Si se provee, cada fila se vuelve interactiva (cursor pointer + onAction). */
	onRowClick?: (row: T) => void;
	/** Clases extra por fila (p. ej. para resaltar la fila seleccionada). */
	rowClassName?: (row: T) => string;
	sortState?: CrudDataTableSortState | null;
	onSortChange?: (state: CrudDataTableSortState) => void;
	columnFilters?: Record<string, string[]>;
	onColumnFilterChange?: (key: string, values: string[]) => void;
	getFilterOptions?: (key: string) => string[];
	/** En móvil, las columnas `hideOnMobile` se muestran apiladas bajo `clickColumn` */
	expandable?: boolean;
	/** Key de la columna que aloja el detalle apilado (por defecto la primera) */
	clickColumn?: string;
}

const MOBILE_HIDDEN = "hidden md:table-cell";

const colClass = <T,>(col: CrudDataTableColumn<T>) =>
	[col.className, col.hideOnMobile ? MOBILE_HIDDEN : ""].filter(Boolean).join(" ") || undefined;

export default function CrudDataTable<T>({
	columns,
	data,
	isLoading,
	rowKey,
	loadingRows = 5,
	emptyMessage = "No hay datos disponibles",
	onRowClick,
	rowClassName,
	sortState,
	onSortChange,
	columnFilters,
	onColumnFilterChange,
	getFilterOptions,
	expandable,
	clickColumn,
}: CrudDataTableProps<T>) {
	const detailKey = clickColumn ?? columns[0]?.key;
	const hiddenCols = expandable ? columns.filter((c) => c.hideOnMobile) : [];

	const renderCell = (col: CrudDataTableColumn<T>, row: T) =>
		col.render
			? col.render(row)
			: String((row as Record<string, unknown>)[col.key] ?? "");

	const [openFilterKey, setOpenFilterKey] = useState<string | null>(null);

	const sortDescriptor: SortDescriptor | undefined = sortState
		? {
				column: sortState.key,
				direction: sortState.direction === "asc" ? "ascending" : "descending",
			}
		: undefined;

	const handleSortChange = (descriptor: SortDescriptor) => {
		onSortChange?.({
			key: String(descriptor.column),
			direction: descriptor.direction === "ascending" ? "asc" : "desc",
		});
	};

	return (
		<Table>
			<TableScrollContainer className="overflow-x-auto rounded-xl ">
				<TableContent
					aria-label="Tabla de datos"
					sortDescriptor={sortDescriptor}
					onSortChange={onSortChange ? handleSortChange : undefined}
				>
					<TableHeader>
						{columns.map((col, i) => (
							<TableColumn
								key={col.key}
								id={col.key}
								isRowHeader={i === 0}
								className={colClass(col)}
								allowsSorting={col.sortable}
							>
								{({ sortDirection }) => (
									<div className="flex items-center gap-1">
										{col.sortable ? (
											<TableSortableColumnHeader sortDirection={sortDirection}>
												{col.header}
											</TableSortableColumnHeader>
										) : (
											<span>{col.header}</span>
										)}
										{col.filterable &&
											onColumnFilterChange &&
											getFilterOptions && (
												<CrudColumnFilter
													label={
														typeof col.header === "string"
															? col.header
															: col.key
													}
													options={getFilterOptions(col.key)}
													selected={columnFilters?.[col.key] ?? []}
													onChange={(values) =>
														onColumnFilterChange(col.key, values)
													}
													isOpen={openFilterKey === col.key}
													onOpenChange={(open) =>
														setOpenFilterKey(open ? col.key : null)
													}
												/>
											)}
									</div>
								)}
							</TableColumn>
						))}
					</TableHeader>
					<TableBody
						renderEmptyState={() => (
							<EmptyState className="py-6 text-center">
								<span className="text-sm text-muted">{emptyMessage}</span>
							</EmptyState>
						)}
					>
						{isLoading
							? Array.from({ length: loadingRows }).map((_, rowIdx) => (
									<TableRow
										key={`skeleton-${rowIdx}`}
										id={`skeleton-${rowIdx}`}
										className={ROW_BORDER_CLASS}
									>
										{columns.map((col) => (
											<TableCell key={col.key} className={colClass(col)}>
												<Skeleton className="h-4 w-full rounded" />
											</TableCell>
										))}
									</TableRow>
								))
							: data.map((row, idx) => (
									<TableRow
										key={rowKey(row, idx)}
										id={rowKey(row, idx)}
										onAction={onRowClick ? () => onRowClick(row) : undefined}
										className={`${ROW_BORDER_CLASS} hover:bg-ucol_gray_dark-900 dark:hover:bg-ucol_gray_dark-300 ${onRowClick ? "cursor-pointer" : ""} ${rowClassName ? rowClassName(row) : ""}`}
									>
										{columns.map((col) => (
											<TableCell key={col.key} className={colClass(col)}>
												{renderCell(col, row)}
												{col.key === detailKey && hiddenCols.length > 0 && (
													<dl className="mt-1 flex flex-col gap-0.5 text-xs text-muted md:hidden">
														{hiddenCols
															.filter((h) => h.key !== col.key)
															.map((h) => (
																<div key={h.key} className="flex gap-1">
																	<dt>{h.header}:</dt>
																	<dd>{renderCell(h, row)}</dd>
																</div>
															))}
													</dl>
												)}
											</TableCell>
										))}
									</TableRow>
								))}
					</TableBody>
				</TableContent>
			</TableScrollContainer>
		</Table>
	);
}
