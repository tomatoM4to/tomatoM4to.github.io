import { useSearchParams } from "react-router";
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@src/ui/pagination";

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number,
  totalPages: number,
}) {
  const [searchParams] = useSearchParams();

  function getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push(-1);
      pages.push(totalPages);
    }
    else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push(-1);
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    }
    else {
      pages.push(1);
      pages.push(-1);
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push(-1);
      pages.push(totalPages);
    }
    return pages;
  };

  function createPageLink(pageNumber: number) {
    const newParams = new URLSearchParams(searchParams);
    if (pageNumber === 1) {
      newParams.delete('page');
    }
    else {
      newParams.set('page', pageNumber.toString());
    }
    return `?${newParams.toString()}`;
  }

  return (
    <ShadcnPagination className="mt-12 mb-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            to={createPageLink(currentPage - 1)}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={`page-${index}`}>
            {page === -1 ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                to={createPageLink(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            to={createPageLink(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
}
