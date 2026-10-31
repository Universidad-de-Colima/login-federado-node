import { useRouteError, useNavigate } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	RefreshIcon,
	LoginSquare01Icon,
	Home01Icon,
	ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import { handleRedirect } from "@/utils/redirect.utils";
import type { RouterError } from "@/types/general.types";
import { useEnvironment } from "@/hooks";
import { Button } from "@heroui/react";
import RootLayout from "@/layouts/RootLayout";
import clsx from "clsx";
import { errorMap, defaultError } from "./errorMap";

const NotFound = () => {
	const error = useRouteError() as RouterError | null;
	const navigate = useNavigate();

	const isChunkError =
		error instanceof TypeError &&
		(error.message.includes("Failed to fetch dynamically imported module") ||
			error.message.includes("Importing a module script failed") ||
			error.message.includes("error loading dynamically imported module"));

	// Sin error real: estamos en la ruta catch-all "*" -> es un verdadero 404.
	// Con error real pero sin `status`: es un fallo de render/JS atrapado por el
	// errorElement, no una ruta inexistente -> debe verse como 500, no como 404.
	const errorStatus = isChunkError ? -1 : error ? (error.status ?? 500) : 404;
	const handleGoBack = () => navigate(-1);

	const {
		code,
		type,
		title: errorTitle,
		description: errorDescription,
		showHome,
		image,
		accent,
	} = errorMap[errorStatus] || defaultError;

	const config = useEnvironment();

	// Si no hay error real (ej. ruta catch-all "*"), ya estamos dentro del
	// RootLayout de la ruta ancestro. Si hay error real, ese RootLayout fue
	// reemplazado por errorElement, así que aquí debemos renderizar el propio.
	const needsOwnLayout = Boolean(error);

	const content = (
		<div
			className={clsx(
				"w-full max-w-xl mx-auto flex flex-col items-center gap-4 p-8 text-center",
				"bg-white rounded-2xl shadow-sm dark:bg-ucol_gray_dark-300",
				!needsOwnLayout && "mt-14",
			)}
		>
			<img
				src={image}
				alt=""
				aria-hidden="true"
				className="h-48 w-auto"
				draggable={false}
			/>
			<span
				className="px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide text-white"
				style={{ backgroundColor: accent }}
			>
				{code}
			</span>
			<h1 className="text-lg font-bold text-gray-900 dark:text-white mb-0">
				{errorTitle}
			</h1>
			<p className="text-sm text-gray-500 dark:text-gray-300 mb-0">
				{errorDescription}
			</p>
			{config.isDev && (error?.message || error?.statusText) && (
				<p className="text-xs font-mono text-gray-400 dark:text-gray-400 mb-0 break-words max-w-full">
					{type}: {error?.message || error?.statusText}
				</p>
			)}
			<div className="w-full border-t border-gray-100 dark:border-ucol_gray_dark-200" />
			<div className="flex w-full flex-col sm:flex-row gap-3">
				{isChunkError ? (
					<Button
						onPress={() => window.location.reload()}
						fullWidth
						variant="primary"
					>
						<HugeiconsIcon icon={RefreshIcon} size={18} />
						Recargar página
					</Button>
				) : errorStatus === 401 ? (
					<Button
						onPress={() => handleRedirect()}
						fullWidth
						variant="primary"
					>
						<HugeiconsIcon icon={LoginSquare01Icon} size={18} />
						Iniciar sesión
					</Button>
				) : (
					<>
						{showHome ? (
							<Button
								onPress={() => (window.location.href = BASE_PATH)}
								fullWidth
								variant="secondary"
							>
								<HugeiconsIcon icon={Home01Icon} size={18} />
								Ir a inicio
							</Button>
						) : (
							<Button onPress={handleGoBack} fullWidth variant="secondary">
								<HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
								Volver atrás
							</Button>
						)}

						<Button onPress={() => window.location.reload()} fullWidth>
							<HugeiconsIcon icon={RefreshIcon} size={18} />
							Recargar página
						</Button>
					</>
				)}
			</div>
		</div>
	);

	return needsOwnLayout ? <RootLayout>{content}</RootLayout> : content;
};

export default NotFound;
