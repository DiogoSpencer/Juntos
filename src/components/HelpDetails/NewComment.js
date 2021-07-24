import classes from "./NewComment.module.css";
import { useSelector } from "react-redux";
import MultipleUpload from "../HelpForms/MultipleUpload";
import donateIcon from "../../img/volunteersdonate.jpg";
import userIcon from "../../img/userblue.png";
import { useState } from "react";
import useInput from "../hooks/use-input";
import { createComment } from "../../services/http";
import LoadingSpinner from "../UI/LoadingSpinner";

const isComment = (value) => value.trim().length >= 3 && value.trim().length <= 600;

//set the text of the new comment
const NewComment = (props) => {
  const authFirstName = useSelector((state) => state.auth.firstName);
  const authLastName = useSelector((state) => state.auth.lastName);
  const authImg = useSelector((state) => state.auth.profileImg);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const {
    value: enteredNewComment,
    isValid: enteredNewCommentIsValid,
    hasError: NewCommentHasError,
    valueChangeHandler: newCommentChangeHandler,
    reset: resetNewCommentInput,
  } = useInput(isComment);

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
      fromChat: props.isChat,
      markerId: props.requestId,
    };

    formData.append(
      "comment",
      new Blob([JSON.stringify(formInfo)], { type: "application/json" })
    );

    createComment(formData).then(
      (response) => {
        console.log(response);
        setSelectedFiles([]);
        props.setRefresh();
        resetNewCommentInput();
        setIsLoading(false);
      },
      (error) => {
        console.log(error);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className={classes.mainContainer}>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <form onSubmit={newCommentHandler} className={classes.container}>
        {authImg && authImg !== "" ? (
          <img src={authImg} alt="foto-perfil" className={classes.profileImg} />
        ) : (
          <img
            src={userIcon}
            alt="foto-perfil"
            className={classes.profileImg}
          />
        )}
        <p className={classes.name}>
          {authFirstName} {authLastName}
        </p>
        <label htmlFor="new-comment" />
        <textarea
          id="new-comment"
          name="newComment"
          placeholder="Escrever comentário..."
          value={enteredNewComment}
          onChange={newCommentChangeHandler}
          className={classes.newComment}
          rows="3"
          minLength="3"
          maxLength="600"
        />
        {props.buttonText === "Alterar" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            className={classes.closeEdit}
            onClick={props.closeEditHandler}
          >
            <path d="M7.05022 7.05028C6.65969 7.4408 6.65969 8.07397 7.05022 8.46449L10.5858 12L7.05023 15.5356C6.6597 15.9261 6.6597 16.5593 7.05023 16.9498C7.44075 17.3403 8.07392 17.3403 8.46444 16.9498L12 13.4142L15.5355 16.9498C15.926 17.3403 16.5592 17.3403 16.9497 16.9498C17.3402 16.5592 17.3402 15.9261 16.9497 15.5356L13.4142 12L16.9497 8.46449C17.3402 8.07397 17.3402 7.4408 16.9497 7.05028C16.5592 6.65976 15.926 6.65976 15.5355 7.05028L12 10.5858L8.46443 7.05028C8.07391 6.65975 7.44074 6.65975 7.05022 7.05028Z" />
          </svg>
        )}
        <div className={classes.imageUpload}>
          <div className={classes.multiUpload}>
            <MultipleUpload
              fileChangeHandler={setSelectedFiles}
              images={selectedFiles}
              comment={true}
            />
          </div>
          {selectedFiles.length <= 0 && (
            <img
              src={donateIcon}
              alt="Adicionar-Imagens"
              className={classes.donateImage}
            />
          )}
        </div>
        <button
          disabled={!formIsValid}
          onClick={newCommentHandler}
          className={classes.commentButton}
        >
          {props.buttonText}
        </button>
        {NewCommentHasError && <p>Por favor insira um comentário válido</p>}
      </form>
    </div>
  );
};

export default NewComment;

//To get the reply comments, we can get the comment with a specific id from the list of all of the comments and access its replies property.
