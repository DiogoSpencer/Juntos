import classes from "./SearchBar.module.css";
import searchIcon from "../../img/search.png";
import { useEffect, useState } from "react";
import { snackActions } from "../../store/snackBar/snack";
import { useDispatch } from "react-redux";

const SearchBar = (props) => {
  const [inputSearch, setInputSearch] = useState("");
  const dispatch = useDispatch();

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
    inputSearch.trim().match("^[A-Za-z0-9 _]{3,}$")
      ? props.setInput(inputSearch)
      : dispatch(
          snackActions.setSnackbar({
            snackBarOpen: true,
            snackBarType: "info",
            snackBarMessage: "Insere pelo menos 3 caracteres válidos.",
          })
        );
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
