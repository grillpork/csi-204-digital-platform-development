import { ArrowLeft, ArrowRight } from "lucide-react";

function getPageNumbers(totalPages) {
  if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
  return [1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages];
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = getPageNumbers(totalPages);
  return (
    <div className="flex items-center justify-between mt-10">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2.5 text-sm text-gray-700 hover:border-black transition-colors"
      >
        <ArrowLeft size={16} />
        ก่อนหน้า
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-sm text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
                p === currentPage
                  ? "bg-gray-200 text-gray-900 font-medium"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2.5 text-sm text-gray-700 hover:border-black transition-colors"
      >
        ถัดไป
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
