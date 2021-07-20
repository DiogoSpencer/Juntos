import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import {
  changeComment,
  createComment,
  deleteComment,
  listComments,
  reportComment,
} from "../../services/http";
import useInput from "../hooks/use-input";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./Conversation.module.css";
import refreshIcon from "../../img/refresh.png";
import NewComment from "../HelpDetails/NewComment";
import Comment from "../HelpDetails/Comment";

const ASC = "ASC";
const DATE = "creationDate";
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_MINUTE = 1000 * 60;
const byParam = "markerId";
const pageSize = 10;
const dirParam = ASC;
const orderParam = DATE;
let initialPhotos = [];
let initialText = "";

const isNotEmpty = (value) => value.trim() !== "";

const Conversation = () => {
  //vai buscar id e se e oferta ou pedido atraves do endereço... -> fazer pedido as servidor com esse id
  //falta ir buscar info da conversa ao server, estabelecer websocket... etc
  const match = useRouteMatch();
  const requestId = match.params.requestId;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editSelectedFiles, setEditSelectedFiles] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (refresh) {
      setIsLoading(true);
      listComments(
        `?by=${byParam}&order=${orderParam}&dir=${dirParam}&number=${pageNumber}&size=${pageSize}&value=${requestId}`
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
  }, [pageNumber, requestId, refresh]);

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

  const {
    value: enteredEditComment,
    isValid: editCommentIsValid,
    hasError: EditCommentHasError,
    valueChangeHandler: editCommentChangeHandler,
    setValueHandler: setEditCommentValueHandler,
    reset: resetEditCommentInput,
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

  const reportHandler = (commentId) => {
    setIsLoading(true);

    reportComment(commentId).then(
      (response) => {
        setRefresh(true);
      },
      (error) => {
        setIsLoading(false);
        console.log(error);
      }
    );
  };

  const onRefreshHandler = () => {
    setRefresh(true);
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

  const startEditingHandler = (commentId, images, text) => {
    setIsEditing(commentId);
    setEditSelectedFiles(images);
    initialPhotos = images;
    setEditCommentValueHandler(text);
    initialText = text;
  };

  const closeEditHandler = () => {
    setIsEditing("");
  };

  let formIsValid = false;

  if (enteredNewCommentIsValid) {
    formIsValid = true;
  }

  let editIsValid = false;

  if (
    editCommentIsValid &&
    (JSON.stringify(initialPhotos) !== JSON.stringify(editSelectedFiles) ||
      initialText !== enteredEditComment)
  ) {
    editIsValid = true;
  }

  const editCommentHandler = (event) => {
    event.preventDefault();

    if (!editIsValid) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    if (
      editSelectedFiles.length > 0 &&
      JSON.stringify(initialPhotos) !== JSON.stringify(editSelectedFiles)
    ) {
      for (const image of editSelectedFiles) {
        if (image.type) {
          formData.append("img", image);
        }
      }
    }

    let toRemove = initialPhotos.filter(
      (photo) => !editSelectedFiles.includes(photo)
    );

    const formInfo = {
      text: enteredEditComment,
      fromChat: false,
      markerId: requestId,
      imgsToDelete: toRemove,
    };

    formData.append(
      "comment",
      new Blob([JSON.stringify(formInfo)], { type: "application/json" })
    );

    changeComment(formData).then(
      (response) => {
        setIsLoading(false);
        console.log(response);
        setIsEditing("");
        setRefresh(true);
      },
      (error) => {
        setIsLoading(false);
        console.log(error);
        setErrorMsg(error);
      }
    );
  };

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
        setIsLoading(false);
        setErrorMsg(error);
      }
    );
  };

  const deleteCommentHandler = (commentId) => {
    setIsLoading(true);
    deleteComment(commentId).then(
      (response) => {
        setRefresh(true);
      },
      (error) => {
        setIsLoading(false);
        console.log(error);
      }
    );
  };

  return (
    <div className={classes.mainContainer}>
      <h6 className={classes.title}>{responseData && responseData.title}</h6>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}

      <div className={classes.subContainer}>
        <ul className={classes.commentList}>
          {responseData &&
            responseData.content.length > 0 &&
            responseData.content.map((comment, index) => (
              <li key={index} className={classes.comment}>
                <Comment
                  commentId={comment.id}
                  owner={comment.owner}
                  ownerPicture={comment.profileImg}
                  ownerFirstName={comment.firstName}
                  ownerLastName={comment.lastName}
                  text={comment.text}
                  date={formatDate(comment.creationDate)}
                  images={comment.photos}
                  reportHandler={reportHandler}
                  onDeleteComment={deleteCommentHandler}
                  isOwner={""}
                  authRole={""}
                  editCommentHandler={startEditingHandler}
                />
              </li>
            ))}
        </ul>

        <img
          src={refreshIcon}
          alt="atualizar-comentarios"
          className={classes.refresh}
          onClick={onRefreshHandler}
        />
        <div className={classes.newComment}>
          <NewComment
            newCommentHandler={newCommentHandler}
            enteredDescription={enteredNewComment}
            onChange={newCommentChangeHandler}
            isValid={enteredNewCommentIsValid}
            images={selectedFiles}
            fileChangeHandler={setSelectedFiles}
            buttonText="Comentar"
          />
          {NewCommentHasError && <p>Por favor insira um comentário válido</p>}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
