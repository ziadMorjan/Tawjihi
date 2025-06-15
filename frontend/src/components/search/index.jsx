//react
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

//style
import { WrapperSearch, InputBar, SvgICon } from "./style";

//context
import { SearchContext } from "../../context/SearchContext";

//Path
import { PATH } from "../../routes";

const SearchBar = () => {
  const navigate = useNavigate();
  const { search, setSearch } = useContext(SearchContext);

  const handleChange = (e) => {
    setSearch(e.target.value);
    console.log(search);
  };

  const handleSearch = () => {
    navigate(`/${PATH.Courses}`);
  };
  return (
    <WrapperSearch>
      <InputBar
        type="text"
        placeholder="ابحث عن الدورات ....."
        onChange={handleChange}
      />
      <SvgICon
        className="iconBar"
        focusable="false"
        viewBox="0 0 24 24"
        tabIndex="-1"
        title="Search"
        onClick={handleSearch}
      >
        <path
          fill="var(--color-primary)"
          d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 
          16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 
          5.91 16 9.5 16c1.61 0 3.09-.59 
          4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 
          5 11.99 5 9.5S7.01 5 9.5 5 
          14 7.01 14 9.5 11.99 14 9.5 14"
        />
      </SvgICon>
    </WrapperSearch>
  );
};

export default SearchBar;
