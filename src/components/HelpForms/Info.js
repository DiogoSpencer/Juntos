const Info = (props) => {
  return (
    <div>
      <div>
        <h1>{props.selected}</h1>
        <div>
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            value={props.enteredTitle}
            onChange={props.titleChangeHandler}
            onBlur={props.titleBlurHandler}
          />
          {titleHasError && <p>Por favor insira um título.</p>}
        </div>
        <div>
          <label htmlFor="description">Descrição</label>
          <input
            type="text"
            id="description"
            value={props.enteredDescription}
            onChange={props.descriptionChangeHandler}
            onBlur={props.descriptionBlurHandler}
          />
          {descriptionHasError && <p>Por favor insira uma descrição.</p>}
        </div>
        {/* multi image upload */}
      </div>
    </div>
  );
};

export default Info;
