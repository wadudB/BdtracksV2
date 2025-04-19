import { Button } from "./ui/button";

// Pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pages = [];

  // Add first page
  pages.push(1);

  // Add current page and surrounding pages
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (pages[pages.length - 1] !== i - 1) {
      pages.push(-1); // Indicator for ellipsis
    }
    pages.push(i);
  }

  // Add last page if needed
  if (totalPages > 1) {
    if (pages[pages.length - 1] !== totalPages - 1) {
      pages.push(-1); // Indicator for ellipsis
    }
    if (pages[pages.length - 1] !== totalPages) {
      pages.push(totalPages);
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      {pages.map((page, index) =>
        page === -1 ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="w-10"
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};
