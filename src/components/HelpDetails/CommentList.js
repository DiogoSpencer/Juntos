import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../UI/Button";
import Comment from "./Comment";
import NewComment from "./NewComment";
import classes from "./CommentList.module.css";
import refreshIcon from "../../img/refresh.png";
import {
  deleteComment,
  listComments,
  reportComment,
} from "../../services/http";
import { useHistory, useRouteMatch } from "react-router";
import LoadingSpinner from "../UI/LoadingSpinner";
import EditComment from "./EditComment";
import { snackActions } from "../../store/snackBar/snack";

const DESC = "DESC";
const DATE = "creationDate";
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_MINUTE = 1000 * 60;
const COMMENT = "markerId";
const CHAT = "chat";
const pageSize = 5;
const dirParam = DESC;
const orderParam = DATE;

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
      return `< ${roundedHours} ${roundedHours === 1 ? "hora" : "horas"} atrás`;
    } else if (roundedHours < hours) {
      return `> ${roundedHours} ${roundedHours === 1 ? "hora" : "horas"} atrás`;
    } else {
      return `${roundedHours} ${roundedHours === 1 ? "hora" : "horas"} atrás`;
    }
  } else {
    return `${diffInDays} dias atrás`;
  }
};

const reverseItems = (items) => {
  return items.map((item) => item).reverse();
};

//get List of comments
const CommentList = (props) => {
  const match = useRouteMatch();
  const requestId = match.params.requestId;
  const authRole = useSelector((state) => state.auth.role);
  const authUsername = useSelector((state) => state.auth.username);
  const history = useHistory();
  const dispatch = useDispatch();

  const messagesEndRef = useRef(null);

  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [moreComments, setMoreComments] = useState(false);
  const [responseSize, setResponseSize] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (refresh || moreComments) {
      setIsLoading(true);
      listComments(
        `?by=${
          match.path.includes("comentarios") ? COMMENT : CHAT
        }&order=${orderParam}&dir=${dirParam}&number=${pageNumber}&size=${pageSize}&value=${requestId}`
      ).then(
        (response) => {
          setResponseSize(response.data.content.length);
          if (match.path.includes("comentarios")) {
            //comentarios
            moreComments //carregar mais
              ? setResponseData((prevState) =>
                  prevState.concat(response.data.content)
                )
              : setResponseData(response.data.content); //editar, comentar, reportar, apagar
          } else {
            //chat
            if (moreComments) {
              //carregar mais
              setResponseData((prevState) => {
                if (response.data.content && response.data.content.length > 0) {
                  return reverseItems(response.data.content).concat(prevState);
                } else {
                  return prevState;
                }
              });
            } else {
              //editar, comentar, reportar, apagar
              if (response.data.content && response.data.content.length > 0) {
                setResponseData(reverseItems(response.data.content));
              }
              scrollToBottom();
            }
          }

          setIsLoading(false);
          setDisableButton(false);
          setRefresh(false);
          setMoreComments(false);
          setIsEditing(false);
        },
        (error) => {
          setIsLoading(false);
          setRefresh(false);
          setMoreComments(false);

          //se houver erro da para fazer pedido outra vez?
          if (error && error.status === 403) {
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "warning",
                snackBarMessage: "Não estás inscrito neste chat.",
              })
            );
            history.replace("/juntos/conversas");
          } else if (error && error.status === 401) {
          } else if (error && error.status === 404) {
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "error",
                snackBarMessage: "Pedido não encontrado.",
              })
            );
          } else {
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
    }
  }, [pageNumber, requestId, refresh, moreComments, match.path]);

  const onRefreshHandler = () => {
    setPageNumber(0);
    setRefresh(true);
  };

  const loadNextPageHandler = () => {
    setPageNumber((prevState) => {
      if (responseSize === pageSize) {
        setMoreComments(true);
        return prevState + 1;
      } else {
        setDisableButton(true);
        return prevState;
      }
    });
  };

  const startEditingHandler = (commentId) => {
    setIsEditing(commentId);
  };

  const closeEditHandler = () => {
    setIsEditing("");
  };

  const reportHandler = (commentId) => {
    setIsLoading(true);

    reportComment(commentId).then(
      (response) => {
        onRefreshHandler();
        dispatch(
          snackActions.setSnackbar({
            snackBarOpen: true,
            snackBarType: "success",
            snackBarMessage: "Comentário reportado com sucesso!",
          })
        );
      },
      (error) => {
        setIsLoading(false);
        if (error && error.status === 404) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage: "Comentário não encontrado!",
            })
          );
        } else if (error && error.status === 401) {
        } else if (error && error.status === 409) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "warning",
              snackBarMessage:
                "Não podes reportar o mesmo comentário múltiplas vezes",
            })
          );
        } else if (error) {
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
  };

  const deleteCommentHandler = (commentId) => {
    setIsLoading(true);
    deleteComment(commentId).then(
      (response) => {
        onRefreshHandler();
        dispatch(
          snackActions.setSnackbar({
            snackBarOpen: true,
            snackBarType: "success",
            snackBarMessage: "Comentário apagado com sucesso!",
          })
        );
      },
      (error) => {
        setIsLoading(false);
        if (error && error.status === 400) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "warning",
              snackBarMessage: "Não podes apagar comentários de outras pessoas",
            })
          );
        } else if (error && error.status === 404) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage: "Comentário não encontrado!",
            })
          );
        } else if (error && error.status === 401) {
        } else if (error) {
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
  };

  const comments = (
    <div className={classes.subContainer}>
      {(props.isOwner ||
        authRole === "ADMIN" ||
        authRole === "MOD" ||
        (responseData && responseData.wasAHelper)) && (
        <div className={classes.newComment}>
          <NewComment
            buttonText="Comentar"
            requestId={requestId}
            setRefresh={onRefreshHandler}
            isChat={false}
          />
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
          responseData.length > 0 &&
          responseData.map((comment) => (
            <li key={comment.id} className={classes.comment}>
              {isEditing !== comment.id ? (
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
                  isOwner={comment.owner === authUsername}
                  authRole={authRole}
                  editCommentHandler={startEditingHandler}
                  isChat={false}
                />
              ) : (
                <Fragment>
                  <EditComment
                    text={comment.text}
                    images={comment.photos}
                    buttonText="Alterar"
                    closeEditHandler={closeEditHandler}
                    commentId={comment.id}
                    setRefresh={onRefreshHandler}
                    isChat={false}
                  />
                </Fragment>
              )}
            </li>
          ))}
      </ul>
      <div className={classes.buttonContainer}>
        <Button
          text="Carregar Mais"
          onClick={loadNextPageHandler}
          disabled={disableButton}
        />
      </div>
    </div>
  );

  const conversation = (
    <div className={classes.subContainerConversation}>
      <div className={classes.buttonContainer}>
        <Button
          text="Mensagens Antigas"
          onClick={loadNextPageHandler}
          disabled={disableButton}
        />
      </div>
      <ul className={classes.commentList}>
        {responseData &&
          responseData.length > 0 &&
          responseData.map((comment) => (
            <li key={comment.id} className={classes.comment}>
              {isEditing !== comment.id ? (
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
                  isOwner={comment.owner === authUsername}
                  authRole={authRole}
                  editCommentHandler={startEditingHandler}
                  isChat={true}
                />
              ) : (
                <Fragment>
                  <EditComment
                    text={comment.text}
                    images={comment.photos}
                    buttonText="Alterar"
                    closeEditHandler={closeEditHandler}
                    commentId={comment.id}
                    setRefresh={onRefreshHandler}
                    isChat={true}
                  />
                </Fragment>
              )}
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
          buttonText="Comentar"
          requestId={requestId}
          setRefresh={onRefreshHandler}
          isChat={true}
        />
      </div>
      <div ref={messagesEndRef} />
    </div>
  );

  return (
    <div
      className={
        match.path.includes("conversas")
          ? classes.mainContainerConversation
          : classes.mainContainer
      }
    >
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      {match.path.includes("comentarios") && comments}
      {match.path.includes("conversas") && conversation}
    </div>
  );
};

export default CommentList;
