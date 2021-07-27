import classes from "./SearchBar.module.css";
import searchIcon from "../../img/search.png";
import { useEffect, useState } from "react";

const SearchBar = (props) => {
  const [inputSearch, setInputSearch] = useState("");

  useEffect(() => {
    if (props.input !== inputSearch) {
      setInputSearch(props.input);
    }
  }, [props.input]);

  const inputChangeHandler = (event) => {
    setInputSearch(event.target.value);
  };

  const searchHandler = (event) => {
    event.preventDefault();
    inputSearch.trim().length >= 2 && props.setInput(inputSearch);
  };

  return (
    <form onSubmit={searchHandler} className={classes.search}>
      <div className={classes.searchInputs}>
        <input
          value={inputSearch}
          placeholder="Procurar..."
          onChange={inputChangeHandler}
          type="text"
          id="search_bar"
          className={classes.searchInput}
        />
        <div className={classes.searchIcon} onClick={searchHandler}>
          <img src={searchIcon} alt="Procurar" />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
