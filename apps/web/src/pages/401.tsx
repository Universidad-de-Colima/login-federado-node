import { CustomError } from "@/components/errors/CustomError";

export default function Unauthorized401() {
	return (
		<CustomError
			status="401"
			title="Acceso no autorizado"
			subtitle="No tienes los permisos necesarios para ver esta página."
			showHomeButton
		/>
	);
}
