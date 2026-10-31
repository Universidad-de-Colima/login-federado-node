import img400 from "@/assets/errors/400.svg";
import img401 from "@/assets/errors/401.svg";
import img403 from "@/assets/errors/403.svg";
import img404 from "@/assets/errors/404.svg";
import img500 from "@/assets/errors/500.svg";
import img501 from "@/assets/errors/501.svg";
import img502 from "@/assets/errors/502.svg";
import img503 from "@/assets/errors/503.svg";
import img504 from "@/assets/errors/504.svg";
import imgSinConexion from "@/assets/errors/sin-conexion.svg";

export interface ErrorInfo {
	code: string;
	type: string;
	title: string;
	description: string;
	showHome?: boolean;
	image: string;
	accent: string;
}

/** Catálogo de errores por status HTTP (-1 = fallo al cargar un módulo/chunk). */
export const errorMap: Record<number, ErrorInfo> = {
	[-1]: {
		code: "MOD-ERR",
		type: "Error al cargar",
		title: "¡No se pudo cargar la página!",
		description:
			"Hubo un problema al cargar este módulo. Recarga la página para intentarlo de nuevo.",
		image: imgSinConexion,
		accent: "#F59E0B",
	},
	400: {
		code: "REQ-400",
		type: "Solicitud inválida",
		title: "¡Solicitud incorrecta!",
		description: "La solicitud no pudo ser entendida por el servidor.",
		image: img400,
		accent: "#3B82F6",
	},
	401: {
		code: "AUTH-401",
		type: "No autenticado",
		title: "¡No autorizado!",
		description: "Debes iniciar sesión para acceder a esta sección.",
		showHome: true,
		image: img401,
		accent: "#6D28D9",
	},
	403: {
		code: "AUTH-403",
		type: "Sin permisos",
		title: "¡Acceso denegado!",
		description: "No tienes permisos para acceder a esta sección.",
		showHome: true,
		image: img403,
		accent: "#EA580C",
	},
	404: {
		code: "NAV-404",
		type: "Ruta no encontrada",
		title: "¡Página no encontrada!",
		description: "La página que buscas no existe o ha sido movida.",
		image: img404,
		accent: "#64748B",
	},
	500: {
		code: "SRV-500",
		type: "Error del servidor",
		title: "¡Error interno del servidor!",
		description: "Ha ocurrido un error inesperado. Intenta nuevamente.",
		image: img500,
		accent: "#DC2626",
	},
	501: {
		code: "SRV-501",
		type: "No implementado",
		title: "¡Función no disponible!",
		description: "El servidor no soporta esta funcionalidad.",
		image: img501,
		accent: "#DC2626",
	},
	502: {
		code: "SRV-502",
		type: "Puerta de enlace incorrecta",
		title: "¡Respuesta inválida del servidor!",
		description:
			"El servidor recibió una respuesta inválida. Intenta nuevamente.",
		image: img502,
		accent: "#DC2626",
	},
	503: {
		code: "SRV-503",
		type: "Servicio no disponible",
		title: "¡Servicio no disponible!",
		description: "El servidor no está disponible temporalmente.",
		image: img503,
		accent: "#DC2626",
	},
	504: {
		code: "SRV-504",
		type: "Tiempo de espera agotado",
		title: "¡El servidor tardó demasiado!",
		description: "El servidor no respondió a tiempo. Intenta nuevamente.",
		image: img504,
		accent: "#DC2626",
	},
};


export const defaultError: ErrorInfo = {
	code: "UNK-000",
	type: "Error desconocido",
	title: "¡Error desconocido!",
	description: "Ocurrió un problema inesperado.",
	image: img500,
	accent: "#64748B",
};
