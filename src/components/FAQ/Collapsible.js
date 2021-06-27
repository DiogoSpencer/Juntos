import { useState } from "react";
import classes from "./Collapsible.module.css"

const Collapsible = (props) => {
  const [show, setShow] = useState(false);

  const toggleHandler = () => {
    setShow(!show);
  };

  return (
    <div onClick={toggleHandler} className={classes.container}>
      <p className={classes.question}>{props.text}</p>
      {show && <p>{props.info}</p>}
    </div>
  );
};

export default Collapsible;
