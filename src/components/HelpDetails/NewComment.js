import classes from "./NewComment.module.css";
import { useSelector } from "react-redux";
import MultipleUpload from "../HelpForms/MultipleUpload";
import donateIcon from "../../img/volunteersdonate.jpg";

//set the text of the new comment
const NewComment = (props) => {
  const authFirstName = useSelector((state) => state.auth.firstName);
  const authLastName = useSelector((state) => state.auth.lastName);
  const authImg = useSelector((state) => state.auth.profileImg);

  return (
    <form onSubmit={props.newCommentHandler} className={classes.container}>
      <img src={authImg} alt="foto-perfil" className={classes.profileImg} />
      <p className={classes.name}>
        {authFirstName} {authLastName}
      </p>
      <label htmlFor="new-comment" />
      <textarea
        id="new-comment"
        name="newComment"
        placeholder="Escrever comentário..."
        value={props.enteredDescription}
        onChange={props.onChange}
        className={classes.newComment}
        rows="3"
        minLength="10"
        maxLength="1000"
      />
      <div className={classes.imageUpload}>
        <div className={classes.multiUpload}>
          <MultipleUpload
            fileChangeHandler={props.fileChangeHandler}
            images={props.images}
            comment={true}
          />
        </div>
        {props.images.length <= 0 && (
          <img
            src={donateIcon}
            alt="Adicionar-Imagens"
            className={classes.donateImage}
          />
        )}
      </div>
      <button
        disabled={!props.isValid}
        onClick={props.newCommentHandler}
        className={classes.commentButton}
      >
        Comentar
      </button>
    </form>
  );
};

export default NewComment;

/*
Comment in DB:

let comment = {
  commentId: {
    id: commentId,
    text: commentText,
    author: userId,
    timestamp: timestamp,
    likes: [userId1, userId2],
    replies: [commentd1, commentId2],
    replyingTo: commentId_OR_null
  }
};
*/

//To get the reply comments, we can get the comment with a specific id from the list of all of the comments and access its replies property.
