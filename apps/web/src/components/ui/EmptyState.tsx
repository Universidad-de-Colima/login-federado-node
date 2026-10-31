import { MdMenuBook } from "react-icons/md";

interface EmptyStateProps {
	message?: string;
	icon?: React.ReactNode;
}

export default function EmptyState({
	message = "No hay datos disponibles en este momento",
	icon,
}: EmptyStateProps) {
	return (
		<div className="bg-white rounded-2xl shadow-xl p-12 dark:bg-dark-200">
			<div className="text-center">
				<div className="inline-flex items-center justify-center w-24 h-24 bg-tea_green-900 rounded-full mb-6 dark:bg-tea_green-200">
					<span className="text-5xl text-tea_green-500">
						{icon ?? <MdMenuBook />}
					</span>
				</div>
				<p className="text-dim_gray text-lg font-medium dark:text-white">
					{message}
				</p>
			</div>
		</div>
	);
}
