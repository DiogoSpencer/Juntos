import classes from "./SwitchBar.module.scss";

const SwitchBar = (props) => {
  return (
    <div className={classes.switchButton}>
      <input type="checkbox" className={classes.switchButtonCheckbox} name={props.name} />
      <label className={classes.switchButtonLabel} htmlFor={props.name}>
        <span className={classes.switchButtonLabelSpan}>{props.text}</span>
      </label>
    </div>
  );
};

export default SwitchBar;
