import { Link } from "react-router-dom";
import Button from "../UI/Button";
import classes from "./Faq.module.css";
import Collapsible from "./Collapsible";

const text = "Não encontras o que procuras?";

//esta data vai vir do servidor?
const data = [
  {
    text: "Como Instalar?",
    info: "Para instalar a app basta descarregar para o seu telemóvel",
  },
  {
    text: "Quem Somos?",
    info: "Somos um grupo de estudantes da Faculdade de Ciências e Tecnologias da Universidade Nova de Lisboa, que se juntaram para desenvolver este projeto no âmbito da cadeira de APDC.",
  },
  {
    text: "Como posso obter uma conta verificada?",
    info: "Utilizadores verificados destinam-se apenas a entidades fidedignas. Para se tornar uma conta verificada, basta criar uma conta no site como organização e os nossos moderadores tratarão da sua verificação. Com o processo concluído irá receber um e-mail de confirmação.",
  },
  {
    text: "Como vos posso contactar?",
    info: "Atualmente, para nos contactar basta enviar uma mensagem através do formulário de dúvidas.",
  },
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
      <Link to="/contactos" className={classes.linkContacts}>
        <Button text={text} />
      </Link>
    </div>
  );
};

export default FAQ;
