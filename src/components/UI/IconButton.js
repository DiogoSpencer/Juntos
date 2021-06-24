import android from "../../img/android.png";
import classes from "./IconButton.module.css";

const IconButton = (props) => {
  return (
    <button onClick={props.onClick} className={classes.iconBtn}>
      <img
        src={android}
        alt="download-android-app"
        className={classes.iconImage}
      />
      <p className={classes.iconText}>{props.text}</p>
    </button>
  );
};

export default IconButton;
