export function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void;
}) {
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

  return (
    <nav className="pagination">
      <button
        className="pagination-btn pagination-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ←
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => (
          page === -1 ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              . . .
            </span>
          ) : (
            <button
              key={page}
              className={`pagination-btn pagination-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        className="pagination-btn pagination-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        →
      </button>
    </nav>
  );
}
