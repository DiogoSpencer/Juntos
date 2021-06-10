import classes from "./SwitchBar.module.scss";

const SwitchBar = (props) => {

    const switchChangeHandler = (event) => {
        props.onChange(event.target.checked)
    }


  return (
    <div className={classes['toggle-switch']}>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={switchChangeHandler}
        className={classes['toggle-switch-checkbox']}
        name={props.name}
        id={props.name}
        disabled={props.disabled}
      />
      <label className={classes['toggle-switch-label']} htmlFor={props.name}>
        <span className={classes["toggle-switch-label-span"]} data-no={props.no} data-yes={props.yes}>{props.yes}</span>
      </label>
    </div>
  );
};

export default SwitchBar;
