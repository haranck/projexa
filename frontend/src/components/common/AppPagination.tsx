import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (page < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="h-9 w-9 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-100 disabled:opacity-20 transition-all duration-300"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1.5">
        {getPageNumbers().map((p, idx) => (
          p === "..." ? (
            <div key={`ellipsis-${idx}`} className="flex h-9 w-9 items-center justify-center text-zinc-600">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <Button
              key={p}
              variant={page === p ? "default" : "outline"}
              onClick={() => onPageChange(p as number)}
              className={`h-9 w-9 rounded-xl text-xs font-bold transition-all duration-300 ${page === p
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border-none scale-105"
                  : "border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-100"
                }`}
            >
              {p}
            </Button>
          )
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="h-9 w-9 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-100 disabled:opacity-20 transition-all duration-300"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
