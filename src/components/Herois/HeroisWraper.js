import { useRouteMatch } from "react-router";
import classes from "./HeroisWrapper.module.css";
import volunteer1 from "../../img/boxesVolunteer.jpg";
import Button from "../UI/Button";

//ir buscar todos aqui ou em slides?
//ir buscar o do endereço por id
const dummy = {
  img: "../../img/boxesVolunteer.jpg",
  alt: "heroi-1",
  title: "Heroi",
  id: "heroi1",
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent finibus, leo sed luctus luctus, ante ante mollis justo, et mollis turpis nibh sit amet tortor. Maecenas vel sapien at risus dignissim accumsan. Vestibulum sit amet luctus ipsum. Nam egestas vehicula sem, eu accumsan tellus volutpat et. Pellentesque tempus orci eu nibh lobortis ullamcorper. Nam et magna nec eros efficitur fringilla pretium commodo ipsum. Nam diam urna, gravida a rhoncus facilisis, commodo at lectus. Nam placerat lorem at risus aliquet congue. In hac habitasse platea dictumst. Quisque egestas tristique augue, ac elementum tortor vehicula eget. Aliquam in sapien eu nisi ultricies pharetra a ut ex. Fusce sed condimentum turpis, vitae suscipit dui. Nulla a sollicitudin ex, nec tincidunt orci. In vestibulum, velit ut dictum posuere, purus ipsum efficitur leo, eget condimentum elit tortor id velit. Aenean varius laoreet luctus. Quisque pulvinar, lectus ut consequat malesuada, nisi est placerat urna, nec blandit lectus nisi et ex",
};

const HeroisWraper = () => {
  const match = useRouteMatch();

  //ir buscar data com este id ao server
  const id = match.params.heroidId;

  return (
    <div className={classes.container}>
      <div className={classes.heroiContainer}>
        <h1 className={classes.title}>{dummy.title}</h1>
        <p className={classes.info}>{dummy.text}</p>
        <img src={volunteer1} alt={dummy.alt} className={classes.image} />
      </div>
      <div className={classes.slidesContainer}>
        <Button className={classes.seeOthers} text="Ver Outros Heróis" />
      </div>
    </div>
  );
};

export default HeroisWraper;

//pensar em meter estes props na store ou fazer um Context hook porque estamos a passar varios niveis
