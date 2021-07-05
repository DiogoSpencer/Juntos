const SearchBar = (props) => {
  const inputChangeHandler = (event) => {
    props.setInput(event.target.value);
  };

  const searchHandler = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={searchHandler}>
      <input
        value={props.input}
        placeholder={props.placeholder}
        onChange={inputChangeHandler}
        type="text"
        id="search_bar"
      />
      <button type="button" onClick={searchHandler}>
        Procurar
      </button>
    </form>
  );
};

export default SearchBar;

//TODO: substituir botao com icon
