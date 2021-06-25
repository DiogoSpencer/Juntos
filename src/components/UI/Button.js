import classes from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={`${classes.buttonCustom} ${classes.buttonGradient}`}
    >
      <span className={classes.buttonText}>{props.text}</span>
    </button>
  );
};

export default Button;
