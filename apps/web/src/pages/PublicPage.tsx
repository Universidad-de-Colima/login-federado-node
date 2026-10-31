import { motion } from "framer-motion";
import CardExp from "@/components/ui/CardExp";
import {
	UniversityIcon,
	GraduationCapIcon,
	MicroscopeIcon,
	Calendar03Icon,
	News01Icon,
} from "@hugeicons/core-free-icons";
import { hugeIcon } from "@/utils/hugeIcon";

const UniversityLogo = hugeIcon(UniversityIcon);

const CARDS = [
	{
		icon: hugeIcon(GraduationCapIcon),
		title: "Oferta Educativa",
		description: "Licenciaturas, maestrías y doctorados disponibles.",
		gradient: "#64B32E",
		color: "#64B32E",
		to: "#",
	},
	{
		icon: hugeIcon(MicroscopeIcon),
		title: "Investigación",
		description: "Proyectos y líneas de investigación activas.",
		gradient: "#00A4E4",
		color: "#00A4E4",
		to: "#",
	},
	{
		icon: hugeIcon(Calendar03Icon),
		title: "Eventos",
		description: "Agenda de eventos académicos y culturales.",
		gradient: "#f49700",
		color: "#f49700",
		to: "#",
	},
	{
		icon: hugeIcon(News01Icon),
		title: "Noticias",
		description: "Últimas noticias de la Universidad de Colima.",
		gradient: "#7539b5",
		color: "#7539b5",
		to: "#",
	},
];

export default function PublicPage() {
	return (
		<>
			<section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-7xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					<div className="flex items-center gap-3 mb-3">
						<UniversityLogo className="text-tea_green-500 text-2xl" />
						<h1 className="text-tea_green-300">Información Pública</h1>
					</div>
					<p className="text-dim_gray mb-12 max-w-xl">
						Accede a la información institucional disponible para toda la
						comunidad.
					</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
						{CARDS.map((card) => (
							<CardExp key={card.title} {...card} />
						))}
					</div>
				</motion.div>

				{/* Sección de acceso */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="mt-14 p-6 sm:p-8 rounded-2xl bg-tea_green-900/30 border border-tea_green-800 flex flex-col sm:flex-row items-center justify-between gap-4"
				>
					<div>
						<h2 className="dark:text-tea_green-500 mb-1">
							¿Eres parte de la comunidad?
						</h2>
						<p className="text-dim_gray text-sm dark:text-white">
							Inicia sesión para acceder al sistema institucional.
						</p>
					</div>
				</motion.div>
			</section>
		</>
	);
}
