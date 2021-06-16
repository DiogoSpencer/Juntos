const HelpAnonimousItem = (props) => {
  return (
    <div>
      <div>
        <img src="" alt="anonimo-foto" />
        <h6>{props.firstName}</h6>
        <img src="" alt="icon-ajudas" />
        <p>{props.helps}</p>
      </div>
      <div>
        <h5>{props.title}</h5>
      </div>
      <div>
        <p>{props.location}</p>
      </div>
      <div>
        <p>{props.date}</p>
        <img src="" alt={props.type} />
      </div>
    </div>
  );
};

export default HelpAnonimousItem;
