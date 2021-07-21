import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
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
import { useRouteMatch } from "react-router";
import LoadingSpinner from "../UI/LoadingSpinner";
import EditComment from "./EditComment";

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

  const messagesEndRef = useRef(null);

  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
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
          console.log(response.data);
          if (match.path.includes("comentarios")) {
            moreComments
              ? setResponseData((prevState) =>
                  prevState.concat(response.data.content)
                )
              : setResponseData(response.data.content);
          } else {
            if (moreComments) {
              setResponseData(
                (prevState) =>
                  response.data.content &&
                  response.data.content.length > 0 &&
                  reverseItems(response.data.content).concat(prevState)
              );
            } else {
              response.data.content &&
                response.data.content.length > 0 &&
                setResponseData(reverseItems(response.data.content));
              scrollToBottom();
            }
          }
        },
        (error) => {
          setErrorMsg(error);
          console.log(error);
        }
      );
    }
  }, [pageNumber, requestId, refresh, moreComments, match.path]);

  useEffect(() => {
    isLoading && setIsLoading(false);
    refresh && setRefresh(false);
    moreComments && setMoreComments(false);
  }, [responseData, errorMsg]);

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
    setPageNumber(0);
    setRefresh(true);
  };

  const startEditingHandler = (commentId) => {
    setIsEditing(commentId);
  };

  const closeEditHandler = () => {
    setIsEditing("");
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
                  isOwner={props.isOwner}
                  authRole={authRole}
                  editCommentHandler={startEditingHandler}
                />
              ) : (
                <Fragment>
                  <EditComment
                    text={comment.text}
                    images={comment.images}
                    buttonText="Alterar"
                    closeEditHandler={closeEditHandler}
                    commentId={comment.id}
                    setRefresh={onRefreshHandler}
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
                  isOwner={props.isOwner}
                  authRole={authRole}
                  editCommentHandler={startEditingHandler}
                />
              ) : (
                <Fragment>
                  <EditComment
                    text={comment.text}
                    images={comment.images}
                    buttonText="Alterar"
                    closeEditHandler={closeEditHandler}
                    commentId={comment.id}
                    setRefresh={onRefreshHandler}
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
