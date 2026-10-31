import { useRouteError } from "react-router";
import { CustomError } from "@/components/errors/CustomError";
import { handleRedirect } from "@/utils/redirect.utils";

interface RouterError {
	message: string;
	status?: number;
}

/**
 * errorElement ligero basado en CustomError. Para el errorElement principal
 * de la app usar `NotFound`, que mapea cada status a su ilustración.
 */
export const ErrorBoundary = () => {
	const error = useRouteError() as RouterError;

	if (error.message === "No hay token") {
		handleRedirect();
		return null;
	}

	if (error.message === "No tienes permisos para acceder a esta ruta") {
		return (
			<CustomError
				title="Error"
				status={error.status?.toString()}
				message={error.message}
				subtitle="No autorizado"
				redirectTo="/app/dashboard"
			/>
		);
	}

	return (
		<CustomError
			title="Error"
			status={error.status?.toString()}
			message={error.message}
			subtitle="Algo salió mal"
			redirectTo="/"
		/>
	);
};
