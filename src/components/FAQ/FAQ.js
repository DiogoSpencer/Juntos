import { Fragment } from "react";
import { Link } from "react-router-dom";
import Button from "../UI/Button";
import FaqCard from "./FaqCard";

const text = "Não encontras o que procuras?";

//esta data vai ver do servidor?
const data = [
  { text: "Como instalar?", info: "Para instalar a app basta descarregar" },
  { text: "Como instalar?", info: "Para instalar a app basta descarregar" },
  { text: "Como instalar?", info: "Para instalar a app basta descarregar" },
  { text: "Como instalar?", info: "Para instalar a app basta descarregar" },
  { text: "Como instalar?", info: "Para instalar a app basta descarregar" },
];

const FAQ = () => {
  return (
    <Fragment>
      <h1>FAQ</h1>
      <div>
        {data.map((faqQuestion, index) => {
          return (
            <div key={index}>
              <FaqCard text={faqQuestion.text} info={faqQuestion.info} />
            </div>
          );
        })}
      </div>
      <div>
        <Link to="/Contactos">
          <Button text={text} />
        </Link>
      </div>
    </Fragment>
  );
};

export default FAQ;
