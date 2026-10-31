/** Layout de pantalla completa sin AppHeader — para la página de bienvenida */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-200">
      {children}
    </div>
  );
}
