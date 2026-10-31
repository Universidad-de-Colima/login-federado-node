import type { ReactNode } from "react";
import { Button, Select, ListBox } from "@heroui/react";
import {
	FiChevronsLeft,
	FiChevronLeft,
	FiChevronRight,
	FiChevronsRight,
	FiRefreshCw,
} from "react-icons/fi";
import CrudTableControls, {
	type CrudTableColumnOption,
} from "@/components/common/CrudTableControls";
import CrudDataTable, {
	type CrudDataTableColumn,
	type CrudDataTableSortState,
} from "@/components/common/CrudDataTable";
import { Surface } from "@heroui/react";

interface SuperCrudPagination {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
	from: number;
	to: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	pageSizeOptions?: number[];
}

interface SuperCrudProps<T> {
	title: ReactNode;
	subtitle?: ReactNode;
	searchTerm: string;
	onSearchTermChange: (value: string) => void;
	searchPlaceholder?: string;
	columnOptions: CrudTableColumnOption[];
	onToggleColumn: (key: string, nextVisible: boolean) => void;
	toolbarActions?: ReactNode;
	onReload?: () => void;
	tableColumns: CrudDataTableColumn<T>[];
	data: T[];
	isLoading: boolean;
	rowKey: (row: T, index: number) => string;
	loadingRows?: number;
	emptyMessage?: string;
	pagination: SuperCrudPagination;
	sortState?: CrudDataTableSortState | null;
	onSortChange?: (state: CrudDataTableSortState) => void;
	columnFilters?: Record<string, string[]>;
	onColumnFilterChange?: (key: string, values: string[]) => void;
	getFilterOptions?: (key: string) => string[];
	onRowClick?: (row: T) => void;
	rowClassName?: (row: T) => string;
	expandable?: boolean;
	clickColumn?: string;
}

export default function SuperCrud<T>({
	title,
	subtitle,
	searchTerm,
	onSearchTermChange,
	searchPlaceholder,
	columnOptions,
	onToggleColumn,
	toolbarActions,
	onReload,
	tableColumns,
	data,
	isLoading,
	rowKey,
	loadingRows,
	emptyMessage,
	pagination,
	sortState,
	onSortChange,
	columnFilters,
	onColumnFilterChange,
	getFilterOptions,
	onRowClick,
	rowClassName,
	expandable,
	clickColumn,
}: SuperCrudProps<T>) {
	const {
		page,
		pageSize,
		total,
		totalPages,
		from,
		to,
		onPageChange,
		onPageSizeChange,
		pageSizeOptions = [10, 20, 50],
	} = pagination;

	return (
		<div className="space-y-4">
			<div className="space-y-3">
				<div>
					<h2 className="text-base font-semibold">{title}</h2>
					{subtitle && <p className="text-xs text-muted">{subtitle}</p>}
				</div>

				<CrudTableControls
					searchTerm={searchTerm}
					onSearchTermChange={onSearchTermChange}
					searchPlaceholder={searchPlaceholder}
					columns={columnOptions}
					onToggleColumn={onToggleColumn}
					actions={
						<>
							{onReload && (
								<Button
									size="sm"
									isIconOnly
									aria-label="Recargar"
									onPress={onReload}
									isDisabled={isLoading}
									variant="secondary"
									className="bg-gray-50 dark:bg-gray-800"
								>
									<FiRefreshCw className="size-4" />
								</Button>
							)}
							{toolbarActions}
						</>
					}
				/>
			</div>

			<CrudDataTable
				columns={tableColumns}
				data={data}
				isLoading={isLoading}
				rowKey={rowKey}
				loadingRows={loadingRows}
				emptyMessage={emptyMessage}
				sortState={sortState}
				onSortChange={onSortChange}
				columnFilters={columnFilters}
				onColumnFilterChange={onColumnFilterChange}
				getFilterOptions={getFilterOptions}
				onRowClick={onRowClick}
				rowClassName={rowClassName}
				expandable={expandable}
				clickColumn={clickColumn}
			/>

			<Surface className="p-4 rounded-xl shadow">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-2">
						<label
							htmlFor="rows-per-page-supercrud"
							className="text-sm text-muted whitespace-nowrap"
						>
							Filas por página
						</label>
						<Select
							id="rows-per-page-supercrud"
							selectedKey={String(pageSize)}
							onSelectionChange={(key) => onPageSizeChange(Number(key))}
							className="w-20"
							aria-label="Filas por página"
						>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover placement="top">
								<ListBox>
									{pageSizeOptions.map((option) => (
										<ListBox.Item key={option} id={String(option)}>
											{option}
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
						</Select>
					</div>

					<div className="flex items-center justify-between gap-4 sm:justify-end">
						<span className="text-sm text-muted">
							{total > 0 ? `${from}–${to} de ${total}` : "–"}
						</span>
						<div className="flex items-center gap-1">
							<Button
								variant="outline"
								isIconOnly
								size="sm"
								className="hidden lg:flex"
								onPress={() => onPageChange(1)}
								isDisabled={page <= 1 || isLoading}
								aria-label="Primera página"
							>
								<FiChevronsLeft className="size-4" />
							</Button>
							<Button
								variant="outline"
								isIconOnly
								size="sm"
								onPress={() => onPageChange(page - 1)}
								isDisabled={page <= 1 || isLoading}
								aria-label="Página anterior"
							>
								<FiChevronLeft className="size-4" />
							</Button>
							<span className="min-w-20 text-center text-sm text-muted">
								Página {page} de {totalPages}
							</span>
							<Button
								variant="outline"
								isIconOnly
								size="sm"
								onPress={() => onPageChange(page + 1)}
								isDisabled={page >= totalPages || isLoading}
								aria-label="Página siguiente"
							>
								<FiChevronRight className="size-4" />
							</Button>
							<Button
								variant="outline"
								isIconOnly
								size="sm"
								className="hidden lg:flex"
								onPress={() => onPageChange(totalPages)}
								isDisabled={page >= totalPages || isLoading}
								aria-label="Última página"
							>
								<FiChevronsRight className="size-4" />
							</Button>
						</div>
					</div>
				</div>
			</Surface>
		</div>
	);
}
