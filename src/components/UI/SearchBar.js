import classes from "./SearchBar.module.css";
import searchIcon from "../../img/search.png";
import { useState } from "react";

const SearchBar = (props) => {
  const [inputSearch, setInputSearch] = useState("");

  const inputChangeHandler = (event) => {
    setInputSearch(event.target.value);
  };

  const searchHandler = (event) => {
    event.preventDefault();
    props.setInput(inputSearch);
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
