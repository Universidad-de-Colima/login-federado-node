import logoIcon from "@/assets/images/escudo.svg";
import { useTheme } from "@/contexts/ThemeContext";
import clsx from "clsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function LoaderFull() {
	const { theme } = useTheme();
	return (
		<div className="fixed inset-0 z-[1001] flex items-center justify-center bg-white dark:bg-ucol_gray_dark-100">
			<div className="flex flex-col items-center justify-center text-center p-4">
				<div className="relative w-48 h-48">
					<img
						src={logoIcon}
						alt="Universidad de Colima"
						className={clsx(
							"relative z-10 w-full h-full object-contain",
							theme === "light" ? "filter-none" : "filter invert",
						)}
					/>
				</div>

				<h1 className="text-4xl md:text-5xl lg:text-6xl mt-6 max-w-7xl dark:text-white font-bold tracking-wide text-black">
					{PROJ_NAME}
				</h1>

				<div className="mt-6 text-[color:var(--accent)] text-2xl font-semibold tracking-wider flex items-center">
					<span className="mr-2 text-[color:var(--accent)]">●</span>
					Cargando
					<span className="ml-2 text-[color:var(--accent)]">●</span>
				</div>

				{/* Spinner */}
				<AiOutlineLoading3Quarters className="text-[color:var(--accent)] text-6xl mt-6 animate-spin" />
			</div>
		</div>
	);
}
