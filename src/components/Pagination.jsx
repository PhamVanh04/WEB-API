import './Pagination.css';

// Component phân trang
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  // Tạo mảng số trang
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        className="btn btn-page"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          className={`btn btn-page ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      <button
        className="btn btn-page"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
