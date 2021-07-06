import classes from "./SearchBar.module.css";

const SearchBar = (props) => {
  const inputChangeHandler = (event) => {
    props.setInput(event.target.value);
  };

  const searchHandler = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={searchHandler} className={classes.container}>
      <input
        value={props.input}
        placeholder="Procurar..."
        onChange={inputChangeHandler}
        type="text"
        id="search_bar"
        className={classes.searchInput}
      />
      <button
        type="button"
        onClick={searchHandler}
        className={classes.searchButton}
      >
        <img src="" className={classes.searchText}></img>
      </button>
    </form>
  );
};

export default SearchBar;

//TODO: substituir botao com icon
