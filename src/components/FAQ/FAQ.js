import { Link } from "react-router-dom";
import Button from "../UI/Button";
import classes from "./Faq.module.css";
import Collapsible from "./Collapsible";

const text = "Não encontras o que procuras?";

//esta data vai vir do servidor?
const data = [
  { text: "Como instalar?", info: "Para instalar a app basta descarregar" },
  { text: "Como instalar?", info: "Para instalar a app basta descarregar" },
  { text: "Como instalar?", info: "Para instalar a app basta descarregar" },
  { text: "Como instalar?", info: "Para instalar a app basta descarregar" },
];

const FAQ = () => {
  return (
    <div className={classes.container}>
      <h1 className={classes.mainTitle}>Dúvidas mais Frequentes</h1>
      <div className={classes.questionContainer}>
        {data.map((faqQuestion, index) => {
          return (
            <Collapsible
              key={index}
              text={faqQuestion.text}
              info={faqQuestion.info}
            />
          );
        })}
      </div>
      <Link to="/Contactos" className={classes.linkContacts}>
        <Button text={text} />
      </Link>
    </div>
  );
};

export default FAQ;
