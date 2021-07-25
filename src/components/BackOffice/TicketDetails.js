import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import { getTicket } from "../../services/http";
import useInput from "../hooks/use-input";
import classes from "../Contacts/Contacts.module.css";
import { useDispatch } from "react-redux";
import { snackActions } from "../../store/snackBar/snack";

const PARTNERSHIP = "PARTNERSHIP";
const SUGGESTIONS = "SUGGESTIONS";
const PROBLEMS = "PROBLEMS";

const isNotEmpty = (value) => value.trim() !== "";

const TicketDetails = () => {
  const match = useRouteMatch();
  const ticketId = match.params.ticketId;
  const dispatch = useDispatch();

  const [subject, setSubject] = useState(SUGGESTIONS);

  useEffect(() => {
    getTicket(ticketId).then(
      (response) => {
        setNameValue(response.data.title);
        setDescriptionValue(response.data.text);
        setEmailValue(response.data.email);
        setSubject(response.data.type);
      },
      (error) => {
        if (error && error.status === 404) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage: "Contacto não encontrado!",
            })
          );
        } else if (error && error.status !== 401) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage:
                "Algo inesperado aconteceu, por favor tenta novamente. Se o error persistir contacta-nos",
            })
          );
        }
      }
    );
  }, [ticketId]);

  const {
    value: enteredName,
    valueChangeHandler: nameChangeHandler,
    setValueHandler: setNameValue,
  } = useInput(isNotEmpty);

  const {
    value: enteredEmail,
    valueChangeHandler: emailChangeHandler,
    setValueHandler: setEmailValue,
  } = useInput(isNotEmpty);

  const {
    value: enteredDescription,
    valueChangeHandler: descriptionChangeHandler,
    setValueHandler: setDescriptionValue,
  } = useInput(isNotEmpty);

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Detalhes de Contacto</h1>
      <div className={classes.subContainer}>
        <div className={classes.subject}>
          <label htmlFor="subject">Assunto</label>
          <select
            id="subject"
            value={subject}
            className={classes.selectSub}
            disabled={true}
          >
            <option value={SUGGESTIONS}>Sugestões</option>
            <option value={PARTNERSHIP}>Parcerias</option>
            <option value={PROBLEMS}>Problemas</option>
          </select>
        </div>
        <div className={classes.name}>
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            value={enteredName}
            onChange={nameChangeHandler}
            disabled={true}
          />
        </div>
        <div className={classes.email}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={enteredEmail}
            onChange={emailChangeHandler}
            disabled={true}
          />
        </div>
        <div className={classes.help}>
          <label htmlFor="help">Como podemos ajudar?</label>
          <textarea
            id="help"
            value={enteredDescription}
            onChange={descriptionChangeHandler}
            disabled={true}
          >
            Descrição...
          </textarea>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
