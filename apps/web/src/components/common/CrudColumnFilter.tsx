import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@heroui/react";
import { FilterIcon } from "lucide-react";

interface CrudColumnFilterProps {
	label: string;
	options: string[];
	selected: string[];
	onChange: (values: string[]) => void;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function CrudColumnFilter({
	label,
	options,
	selected,
	onChange,
	isOpen,
	onOpenChange,
}: CrudColumnFilterProps) {
	const [search, setSearch] = useState("");
	const triggerRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState({ top: 0, left: 0 });

	useEffect(() => {
		if (!isOpen) return;
		const handlePointerDown = (e: MouseEvent) => {
			const target = e.target as Node;
			if (
				!triggerRef.current?.contains(target) &&
				!panelRef.current?.contains(target)
			) {
				onOpenChange(false);
			}
		};
		document.addEventListener("mousedown", handlePointerDown);
		return () => document.removeEventListener("mousedown", handlePointerDown);
	}, [isOpen, onOpenChange]);

	useLayoutEffect(() => {
		if (!isOpen || !triggerRef.current) return;
		const updatePosition = () => {
			const rect = triggerRef.current!.getBoundingClientRect();
			setPosition({ top: rect.bottom + 4, left: rect.left });
		};
		updatePosition();
		window.addEventListener("scroll", updatePosition, true);
		window.addEventListener("resize", updatePosition);
		return () => {
			window.removeEventListener("scroll", updatePosition, true);
			window.removeEventListener("resize", updatePosition);
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) setSearch("");
	}, [isOpen]);

	const filteredOptions = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!term) return options;
		return options.filter((o) => o.toLowerCase().includes(term));
	}, [options, search]);

	const toggle = (value: string) => {
		if (selected.includes(value)) onChange(selected.filter((v) => v !== value));
		else onChange([...selected, value]);
	};

	const isActive = selected.length > 0;

	return (
		<div
			className="relative inline-block"
			ref={triggerRef}
			onPointerDown={(e) => e.stopPropagation()}
		>
			<Button
				isIconOnly
				variant="ghost"
				size="sm"
				onPress={() => onOpenChange(!isOpen)}
				aria-label={`Filtrar por ${label}`}
				aria-expanded={isOpen}
				className={isActive ? "text-ucol_green-500" : "text-muted"}
			>
				<FilterIcon className="size-3.5" />
			</Button>
			{isOpen &&
				createPortal(
					<div
						ref={panelRef}
						className="fixed z-50 w-56 rounded-lg border border-default-200 bg-background p-2 shadow-md"
						style={{ top: position.top, left: position.left }}
						onClick={(e) => e.stopPropagation()}
						onPointerDown={(e) => e.stopPropagation()}
					>
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Buscar..."
							className="mb-2 w-full rounded border border-default-200 bg-transparent px-2 py-1 text-xs outline-none"
						/>
						<div className="max-h-48 space-y-0.5 overflow-y-auto">
							{filteredOptions.length === 0 && (
								<p className="px-2 py-1 text-xs text-muted">Sin resultados</p>
							)}
							{filteredOptions.map((option) => (
								<label
									key={option}
									className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-default-100"
								>
									<input
										type="checkbox"
										checked={selected.includes(option)}
										onChange={() => toggle(option)}
										className="accent-ucol_green-500"
									/>
									<span className="truncate">{option}</span>
								</label>
							))}
						</div>
						{isActive && (
							<Button
								variant="ghost"
								size="sm"
								onPress={() => onChange([])}
								className="mt-2 w-full text-red-600"
							>
								Limpiar filtro
							</Button>
						)}
					</div>,
					document.body,
				)}
		</div>
	);
}
