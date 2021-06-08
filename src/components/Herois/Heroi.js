import { Fragment } from "react";

const Heroi = (props) => {
  return (
    <Fragment>
      <h1>{props.title}</h1>
      <div>
        <p>{props.text}</p>
        <img src={props.img} alt={props.alt} />
      </div>
    </Fragment>
  );
};

export default Heroi;
