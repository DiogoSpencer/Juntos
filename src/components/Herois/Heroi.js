import volunteer1 from "../../img/boxesVolunteer.jpg";
import classes from "./Herois.module.css";

//imagem vem de props
const Heroi = (props) => {
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>{props.title}</h1>
      <p className={classes.info}>{props.text}</p>
      <img src={volunteer1} alt={props.alt} className={classes.image} />
    </div>
  );
};

export default Heroi;
//perguntar como vamos obter esta info
//se calhar operaçao do datastore por isso nao precisamos de receber props -> fazer o pedido a partir
//daqui
