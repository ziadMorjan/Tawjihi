//style
import { PaginationsWraper } from "./style";
//MUI Library
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Paginations({ setCurrentPage, currentPage, totalPages }) {
  return (
    <PaginationsWraper>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={index + 1 === currentPage ? "active-page" : ""}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </button>
      </div>
    </PaginationsWraper>
  );
}

export default Paginations;
