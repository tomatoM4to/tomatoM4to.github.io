import { Link, useSearchParams } from "react-router";

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

    // 전체 페이지 수가 적으면 전체 표시
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // 현재 페이지가 3페이지 이하
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push(-1);
      pages.push(totalPages);
    }
    // 현재 페이지가 끝에서 두번째 이상
    else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push(-1);
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    }
    // 중간 페이지
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
    <nav className="pagination">
      <Link
        to={createPageLink(currentPage - 1)}
        className={`pagination-btn pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
        aria-label="Previous page"
        aria-disabled={currentPage === 1}
      >
        ←
      </Link>

      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => (
          page === -1 ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              . . .
            </span>
          ) : (
            <Link
              key={page}
              to={createPageLink(page)}
              className={`pagination-btn pagination-number ${currentPage === page ? 'active' : ''}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </Link>
          )
        ))}
      </div>

      <Link
        to={createPageLink(currentPage + 1)}
        className={`pagination-btn pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
        aria-label="Next page"
        aria-disabled={currentPage === totalPages}
      >
        →
      </Link>
    </nav>
  );
}
