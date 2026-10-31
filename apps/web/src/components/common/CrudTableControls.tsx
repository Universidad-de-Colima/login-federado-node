import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { SearchField, Button } from "@heroui/react";
import { SearchIcon, XIcon, SlidersHorizontalIcon } from "lucide-react";

export interface CrudTableColumnOption {
	key: string;
	label: string;
	visible: boolean;
}

interface CrudTableControlsProps {
	searchTerm: string;
	onSearchTermChange: (value: string) => void;
	searchPlaceholder?: string;
	columns: CrudTableColumnOption[];
	onToggleColumn: (key: string, nextVisible: boolean) => void;
	actions?: ReactNode;
}

export default function CrudTableControls({
	searchTerm,
	onSearchTermChange,
	searchPlaceholder = "Buscar...",
	columns,
	onToggleColumn,
	actions,
}: CrudTableControlsProps) {
	const [colsOpen, setColsOpen] = useState(false);
	const colsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handlePointerDown = (e: MouseEvent) => {
			if (colsRef.current && !colsRef.current.contains(e.target as Node)) {
				setColsOpen(false);
			}
		};
		document.addEventListener("mousedown", handlePointerDown);
		return () => document.removeEventListener("mousedown", handlePointerDown);
	}, []);

	return (
		<div className="flex flex-wrap items-center gap-2">
			<SearchField
				value={searchTerm}
				onChange={onSearchTermChange}
				className="flex-1 min-w-48"
				aria-label="Buscar"
			>
				<SearchField.Group>
					<SearchField.SearchIcon>
						<SearchIcon className="size-4 text-muted" />
					</SearchField.SearchIcon>
					<SearchField.Input placeholder={searchPlaceholder} />
					<SearchField.ClearButton>
						<XIcon className="size-3" />
					</SearchField.ClearButton>
				</SearchField.Group>
			</SearchField>

			{columns.length > 0 && (
				<div className="relative" ref={colsRef}>
					<Button
						variant="outline"
						size="sm"
						onPress={() => setColsOpen((prev) => !prev)}
						aria-expanded={colsOpen}
					>
						<SlidersHorizontalIcon className="size-4" />
						Columnas
					</Button>
					{colsOpen && (
						<div className="absolute right-0 top-full mt-1 z-50 min-w-44 rounded-lg border border-default-200 bg-background shadow-md p-1">
							{columns.map((col) => (
								<label
									key={col.key}
									className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-default-100"
								>
									<input
										type="checkbox"
										checked={col.visible}
										onChange={(e) => onToggleColumn(col.key, e.target.checked)}
										className="accent-ucol_green-500"
									/>
									{col.label}
								</label>
							))}
						</div>
					)}
				</div>
			)}

			{actions}
		</div>
	);
}
