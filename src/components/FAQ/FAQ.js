import { Fragment } from "react";
import { Link } from "react-router-dom";
import Button from "../UI/Button";
import Collapsible from "./Collapsible";

const text = "Não encontras o que procuras?"

const FAQ = () => {
  return (
    <Fragment>
      <h1>FAQ</h1>
      <Collapsible text="Como instalar?">
        <div>
            <p>Para instalar a app basta descarregar</p>
        </div>
      </Collapsible>
      <Link to="/Contactos">
        <Button text={text}/>
      </Link>
    </Fragment>
  );
};

export default FAQ;
