import { useState } from "react";

const Collapsible = (props) => {
  const [show, setShow] = useState(false);

  const toggleHandler = () => {
    setShow(!show);
  };

  return (
    <div onClick={toggleHandler}>
      <p>{props.text}</p>
      {show && props.children}
    </div>
  );
};

export default Collapsible;
