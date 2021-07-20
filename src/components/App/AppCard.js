import classes from "./AppCard.module.css";

const AppCard = (props) => {
  return (
    <div className={classes.AppCard}>
      <img src={props.img} alt={props.alt} className={classes.appImg} />
      <p className={classes.text}>{props.text}</p>
    </div>
  );
};

export default AppCard;
