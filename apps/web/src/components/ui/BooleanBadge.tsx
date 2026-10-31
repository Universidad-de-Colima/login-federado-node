import clsx from "clsx";

interface BooleanBadgeProps {
  value: string | number | boolean;
}

export default function BooleanBadge({ value }: BooleanBadgeProps) {
  const normalized = String(value).trim().toLowerCase();
  const isTrue = normalized === "1" || normalized === "true";

  return (
    <div
      className={clsx(
        "inline-block px-2 py-1 rounded-full text-sm font-medium",
        isTrue ? "bg-tea_green-900 text-tea_green-400" : "bg-red-100 text-red-800"
      )}
    >
      {isTrue ? "Sí" : "No"}
    </div>
  );
}
