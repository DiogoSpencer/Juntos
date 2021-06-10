const SearchBar = (props) => {
    
  const inputChangeHandler = (event) => {
    props.setInput(event.target.value);
  };

  return (
    <div>
      <input
        value={props.input}
        placeholder={props.placeholder}
        onChange={inputChangeHandler}
        type="text"
        id="search_bar"
      />
      <button type="submit">Procurar</button>
    </div>
  );
};

export default SearchBar;

//TODO: substituir botao com icon 