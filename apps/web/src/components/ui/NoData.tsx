import { EmptyState } from "@heroui/react";
import { FaCalendar } from "react-icons/fa";

interface NoDataProps {
  icon?: React.ReactNode;
  title?: string;
}

export default function NoData({ icon, title }: NoDataProps) {
  return (
    <EmptyState className="py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="text-6xl text-apple_green-500">
          {icon ?? <FaCalendar />}
        </div>
        <p className="text-lg font-bold text-gray-700">
          {title ?? "No hay datos disponibles"}
        </p>
      </div>
    </EmptyState>
  );
}
