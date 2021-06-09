import Collapsible from "./Collapsible";

const FaqCard = (props) => {
  return (
    <Collapsible text={props.text}>
      <div>
        <p>{props.info}</p>
      </div>
    </Collapsible>
  );
};

export default FaqCard;
