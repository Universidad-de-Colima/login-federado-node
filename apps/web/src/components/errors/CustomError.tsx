import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { BiErrorCircle, BiHome } from "react-icons/bi";
import { IoMdArrowRoundBack } from "react-icons/io";

const UCOL_GREEN = "#245528";
const UCOL_GREEN_LIGHT = "#3c8c43";

interface CustomErrorProps {
	title?: string;
	status?: string;
	subtitle?: string;
	redirectTo?: string;
	message?: string;
	showHomeButton?: boolean;
}

export function CustomError({
	title = "Lo sentimos, ocurrió un error",
	status = "404",
	subtitle = "Página no encontrada",
	redirectTo,
	message = "",
	showHomeButton = true,
}: CustomErrorProps) {
	const navigate = useNavigate();

	useEffect(() => {
		document.title = `Error ${status} | Universidad de Colima`;
	}, [status]);

	const handleNavigation = (path?: string) => {
		if (path) {
			navigate(path);
		} else if (typeof redirectTo === "string") {
			navigate(redirectTo);
		} else {
			navigate(-1);
		}
	};

	return (
		<motion.main
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="min-h-screen flex items-center justify-center p-4"
		>
			<div className="max-w-5xl w-full bg-white/90 backdrop-blur-xs rounded-2xl shadow-2xl p-8 border border-tea_green-900 dark:bg-dark-200 dark:bg-opacity-90 dark:border-tea_green-500">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<motion.section
						initial={{ y: 20 }}
						animate={{ y: 0 }}
						transition={{ delay: 0.2 }}
						className="order-2 lg:order-1 space-y-8"
					>
						<div className="space-y-4">
							<motion.h2
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.3 }}
								className="text-4xl md:text-5xl font-bold leading-tight"
							>
								{title}
							</motion.h2>
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4 }}
								className="text-xl"
							>
								{subtitle}
							</motion.p>
						</div>

						{message && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5 }}
								className="flex items-center gap-4 text-lg"
							>
								<span className="font-bold">Código:</span>
								<span>{status}</span>
								<span className="font-bold">Motivo:</span>
								<span>{message}</span>
							</motion.div>
						)}

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="flex flex-col sm:flex-row gap-4"
						>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => handleNavigation()}
								style={{ backgroundColor: UCOL_GREEN }}
								className="flex items-center justify-center gap-2 px-6 py-3.5 text-white rounded-xl transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 text-lg"
								aria-label="Regresar a la página anterior"
							>
								<IoMdArrowRoundBack className="text-xl" />
								<span>Regresar</span>
							</motion.button>

							{showHomeButton && (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => handleNavigation("/")}
									style={{ borderColor: UCOL_GREEN, color: UCOL_GREEN }}
									className="flex items-center justify-center gap-2 px-6 py-3.5 text-lg border-2 rounded-xl transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
									aria-label="Ir al inicio"
								>
									<BiHome className="text-xl" />
									<span>Ir al inicio</span>
								</motion.button>
							)}
						</motion.div>
					</motion.section>

					<motion.section
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2 }}
						className="order-1 lg:order-2 flex justify-center items-center"
					>
						<div className="relative inline-block group">
							<BiErrorCircle
								className="text-[200px] md:text-[300px] transition-all duration-300 group-hover:scale-105 opacity-10"
								style={{ color: UCOL_GREEN }}
							/>
							<motion.div
								initial={{ scale: 0.5 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.3 }}
								className="absolute inset-0 flex items-center justify-center"
							>
								<h1
									className="text-7xl md:text-9xl font-black text-transparent bg-clip-text select-none"
									style={{
										backgroundImage: `linear-gradient(to right, ${UCOL_GREEN}, ${UCOL_GREEN_LIGHT})`,
									}}
								>
									{status}
								</h1>
							</motion.div>
						</div>
					</motion.section>
				</div>
			</div>
		</motion.main>
	);
}
