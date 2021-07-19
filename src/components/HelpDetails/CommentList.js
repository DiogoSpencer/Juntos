import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "../UI/Button";
import Comment from "./Comment";
import NewComment from "./NewComment";
import useInput from "../hooks/use-input";
import classes from "./CommentList.module.css";
import refreshIcon from "../../img/refresh.png";
import { createComment, listComments } from "../../services/http";
import { useRouteMatch } from "react-router";
import LoadingSpinner from "../UI/LoadingSpinner";

const ASC = "ASC";
const DESC = "DESC";
const DATE = "creationDate";
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_MINUTE = 1000 * 60;
const ALL = "markerId";

const isNotEmpty = (value) => value.trim() !== "";

//get List of comments
const CommentsList = (props) => {
  const match = useRouteMatch();
  const requestId = match.params.requestId;

  const authRole = useSelector((state) => state.auth.role);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [byParam, setByParam] = useState(ALL);
  const [orderParam, setOrderParam] = useState(DATE); //neste momento so suporta creationDate
  const [dirParam, setDirParam] = useState(DESC);
  const [pageNumber, setPageNumber] = useState(0);
  const [value, setValue] = useState(requestId);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [refresh, setRefresh] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    if (refresh) {
      setIsLoading(true);
      listComments(
        `?by=${byParam}&order=${orderParam}&dir=${dirParam}&number=${pageNumber}&size=${pageSize}&value=${value}`
      ).then(
        (response) => {
          console.log(response.data);
          setResponseData(response.data);
        },
        (error) => {
          setErrorMsg(error);
          console.log(error);
        }
      );
    }
  }, [byParam, orderParam, dirParam, pageNumber, pageSize, value, refresh]);

  useEffect(() => {
    setIsLoading(false);
    setRefresh(false);
  }, [responseData, errorMsg]);

  const {
    value: enteredNewComment,
    isValid: enteredNewCommentIsValid,
    hasError: NewCommentHasError,
    valueChangeHandler: newCommentChangeHandler,
    reset: resetNewCommentInput,
  } = useInput(isNotEmpty);

  const loadNextPageHandler = () => {
    setPageNumber((prevState) => {
      if (responseData.length === pageSize) {
        setRefresh(true);
        return prevState + 1;
      } else {
        setDisableButton(true);
        return prevState;
      }
    });
  };

  const reportHandler = () => {
    console.log("reportado")
    //gerir reporte, enviar pedido etc..
  }

  const onRefreshHandler = () => {
    setRefresh(true);
  };

  let formIsValid = false;

  if (enteredNewCommentIsValid) {
    formIsValid = true;
  }

  const newCommentHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    if (selectedFiles.length > 0) {
      for (const image of selectedFiles) {
        formData.append("img", image);
      }
    }

    const formInfo = {
      text: enteredNewComment,
      fromChat: false,
      markerId: requestId,
    };

    formData.append(
      "comment",
      new Blob([JSON.stringify(formInfo)], { type: "application/json" })
    );

    createComment(formData).then(
      (response) => {
        console.log(response);
        resetNewCommentInput();
        setSelectedFiles([]);
        setRefresh(true);
      },
      (error) => {
        console.log(error);
        setErrorMsg(error);
      }
    );
  };

  const formatDate = (longDate) => {
    const now = new Date(Date.now());
    const date = new Date(longDate);

    const nowDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const serverDate = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const diffInDays = Math.floor((nowDate - serverDate) / MS_PER_DAY);
    if (diffInDays < 1) {
      const hours = Math.abs(now - date) / MS_PER_HOUR;
      const minutes = Math.abs(now - date) / MS_PER_MINUTE;
      const roundedHours = Math.round(hours);
      const roundedMinutes = Math.round(minutes);

      if (roundedHours === 24) {
        return `${diffInDays} dia atrás`;
      } else if (hours < 1) {
        return `${minutes < 1 ? 1 : roundedMinutes} ${
          roundedMinutes <= 1 ? "minuto" : "minutos"
        } atrás`;
      } else if (roundedHours > hours) {
        return `< ${roundedHours} ${
          roundedHours === 1 ? "hora" : "horas"
        } atrás`;
      } else if (roundedHours < hours) {
        return `> ${roundedHours} ${
          roundedHours === 1 ? "hora" : "horas"
        } atrás`;
      } else {
        return `${roundedHours} ${roundedHours === 1 ? "hora" : "horas"} atrás`;
      }
    } else {
      return `${diffInDays} dias atrás`;
    }
  };

  return (
    <div className={classes.mainContainer}>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.subContainer}>
        {(props.isOwner || authRole === "ADMIN" || authRole === "MOD") && (
          <div className={classes.newComment}>
            <NewComment
              newCommentHandler={newCommentHandler}
              enteredDescription={enteredNewComment}
              onChange={newCommentChangeHandler}
              isValid={enteredNewCommentIsValid}
              images={selectedFiles}
              fileChangeHandler={setSelectedFiles}
            />
            {NewCommentHasError && <p>{errorMsg}</p>}
          </div>
        )}
        <img
          src={refreshIcon}
          alt="atualizar-comentarios"
          className={classes.refresh}
          onClick={onRefreshHandler}
        />
        <ul className={classes.commentList}>
          {responseData &&
            responseData.content.length > 0 &&
            responseData.content.map((comment, index) => (
              <li key={index} className={classes.comment}>
                <Comment
                  owner={comment.owner}
                  ownerPicture={comment.profileImg}
                  ownerFirstName={comment.firstName}
                  ownerLastName={comment.lastName}
                  text={comment.text}
                  date={formatDate(comment.creationDate)}
                  images={comment.photos}
                  reportHandler={reportHandler}
                />
              </li>
            ))}
        </ul>
        <div className={classes.buttonContainer}>
          <Button
            text="Carregar Mais"
            onClick={loadNextPageHandler}
            disable={disableButton}
          />
        </div>
      </div>
    </div>
  );
};

export default CommentsList;
