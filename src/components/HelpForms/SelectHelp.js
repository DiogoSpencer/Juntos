import SelectButton from "../UI/SelectButton";
import helpIcon from "../../img/helpIcon.png";
import requestIcon from "../../img/hand.png";
import donateIcon from "../../img/box.png";
import actionIcon from "../../img/walk.png";
import classes from "./SelectHelp.module.css";

const AJUDAR = "Oferecer Ajuda";
const PEDIR = "Pedir Ajuda";
const DOAR = "Doar";
const ACOES = "Ações";

const SelectHelp = (props) => {
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>
        <span className={classes.number}>1</span> Escolhe Uma Categoria
      </h1>
      <div className={classes.help}>
        <SelectButton
          icon={helpIcon}
          alt="oferecer-ajuda"
          text={AJUDAR}
          onClick={() => props.onSelect(AJUDAR)}
        />
      </div>
      <div className={classes.request}>
        <SelectButton
          icon={requestIcon}
          alt="pedir-ajuda"
          text={PEDIR}
          onClick={() => props.onSelect(PEDIR)}
        />
      </div>
      <div className={classes.donate}>
        <SelectButton
          icon={donateIcon}
          alt="doar"
          text={DOAR}
          onClick={() => props.onSelect(DOAR)}
        />
      </div>
      <div className={classes.action}>
        <SelectButton
          icon={actionIcon}
          alt="ação"
          text={ACOES}
          onClick={() => props.onSelect(ACOES)}
        />
      </div>
    </div>
  );
};

export default SelectHelp;
