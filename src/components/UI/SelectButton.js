import classes from "./SelectButton.module.css";

const SelectButton = (props) => {
  return (
    <button onClick={props.onClick} className={classes.iconBtn}>
      <img
        src={props.icon}
        alt={props.alt}
        className={classes.iconImage}
      />
      <p className={classes.iconText}>{props.text}</p>
    </button>
  );
};

export default SelectButton;
