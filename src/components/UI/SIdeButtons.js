import { useState } from "react";
import classes from "./SideButtons.module.css";

const SideButtons = (props) => {
  const [isButton1, setIsButton1] = useState(true);

  const onClickBtn1 = () => {
    setIsButton1(true);
  };

  const onClickBtn2 = () => {
    setIsButton1(false);
  };

  const classBtn1 = isButton1 ? classes.buttonActive : classes.buttonDisable;

  const classBtn2 = isButton1 ? classes.buttonDisable : classes.buttonActive;

  return (
    <div className={classes.container}>
      <button
        type="button"
        className={`${classBtn1} ${classes.btn1}`}
        onClick={() => {
          props.onClick1();
          onClickBtn1();
        }}
      >
        {props.button1}
      </button>
      <button
        type="button"
        className={`${classBtn2} ${classes.btn2}`}
        onClick={() => {
          props.onClick2();
          onClickBtn2();
        }}
      >
        {props.button2}
      </button>
    </div>
  );
};

export default SideButtons;
