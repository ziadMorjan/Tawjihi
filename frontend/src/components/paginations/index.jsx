import { PaginationButton, PaginationContainer, PaginationWrapper } from "./style"

function Pagination({ setCurrentPage, currentPage, totalPages }) {
  return (
    <PaginationWrapper>
      <PaginationContainer>
        <PaginationButton
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
<<<<<<< HEAD
          <ArrowForwardIosIcon fontSize="small" />
          السابق
        </button>
=======
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </PaginationButton>
>>>>>>> frontend

        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationButton
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            $active={index + 1 === currentPage}
          >
            {index + 1}
          </PaginationButton>
        ))}

        <PaginationButton
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
<<<<<<< HEAD
          التالي
          <ArrowBackIosNewIcon fontSize="small" />
        </button>
      </div>
    </PaginationsWraper>
  );
=======
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </PaginationButton>
      </PaginationContainer>
    </PaginationWrapper>
  )
>>>>>>> frontend
}

export default Pagination

