import { Link } from "react-router-dom";
import Button from "../UI/Button";
import FaqCard from "./FaqCard";
import classes from "./Faq.module.css";

const text = "Não encontras o que procuras?";

//esta data vai vir do servidor?
const data = [
  { text: "Como instalar?", info: "Para instalar a app basta descarregar" },
  { text: "Como instalar?", info: "Para instalar a app basta descarregar" },
  { text: "Como instalar?", info: "Para instalar a app basta descarregar" },
  { text: "Como instalar?", info: "Para instalar a app basta descarregar" },
  { text: "Como instalar?", info: "Para instalar a app basta descarregar" },
];

const FAQ = () => {
  return (
    <div className={classes.container}>
      <h1 className={classes.mainTitle}>FAQ</h1>
      <div className={classes.questionContainer}>
        {data.map((faqQuestion, index) => {
          return <FaqCard key={index} text={faqQuestion.text} info={faqQuestion.info} />;
        })}
      </div>
      <Link to="/Contactos" className={classes.linkContacts}>
        <Button text={text} />
      </Link>
    </div>
  );
};

export default FAQ;
