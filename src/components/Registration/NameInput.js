import { Fragment } from "react";

const NameInput = () => {
  return (
    <Fragment>
      <div>
        <label htmlFor="name">Nome</label>
        <input
          type="text"
          id="firstName"
          value={enteredFirstName}
          onChange={firstNameChangeHandler}
          onBlur={firstNameBlurHandler}
        />
        {firstNameHasError && <p>Por favor insira um nome.</p>}
      </div>
      <div>
        <label htmlFor="name">Apelido</label>
        <input
          type="text"
          id="lastName"
          value={enteredLastName}
          onChange={lastNameChangeHandler}
          onBlur={lastNameBlurHandler}
        />
        {lastNameHasError && <p>Por favor insira um apelido.</p>}
      </div>
    </Fragment>
  );
};

export default NameInput;
