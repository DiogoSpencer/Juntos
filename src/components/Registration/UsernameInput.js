const UsernameInput = (props) => {
  return (
    <div>
      <label htmlFor="name">Nome de Utilizador</label>
      <input
        type="text"
        id="username"
        value={props.enteredUsername}
        onChange={props.usernameChangeHandler}
        onBlur={props.usernameBlurHandler}
      />
      {props.usernameHasError && <p>Por favor insira um nome de utilizador.</p>}
    </div>
  );
};

export default UsernameInput;
