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
//perguntar como vamos obter esta info
//se calhar operaçao do datastore por isso nao precisamos de receber props -> fazer o pedido a partir
//daqui