import android from "../../img/android.png";
import classes from "./IconButton.module.css";

const IconButton = (props) => {
  return (
    <a
      href={
        "https://storage.googleapis.com/juntos-318522.appspot.com/public/juntos.apk"
      }
      target="_blank"
      rel="noopener noreferrer"
      download
    >
      <button onClick={props.onClick} className={classes.iconBtn}>
        <i className="fas fa-download" />

        <img
          src={android}
          alt="download-android-app"
          className={classes.iconImage}
        />
        <p className={classes.iconText}>{props.text}</p>
      </button>
    </a>
  );
};

export default IconButton;