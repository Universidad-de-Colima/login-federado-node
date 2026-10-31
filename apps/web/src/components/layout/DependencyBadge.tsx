interface DependencyBadgeProps {
  dependency?: string;
}

/**
 * Badge que muestra la dependencia actual
 */
export const DependencyBadge = ({ dependency }: DependencyBadgeProps) => {
  if (!dependency) return null;

  return (
    <span className="bg-apple_green-400 text-white text-sm font-medium px-3 py-1 rounded-xl shadow-sm">
      <span className="font-extrabold ml-1 uppercase">
        {dependency}
      </span>
    </span>
  );
};