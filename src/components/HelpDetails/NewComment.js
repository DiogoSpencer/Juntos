//get AuthedUser so that we can create a new comment
import { useState } from "react";
import { connect } from "react-redux";
import { mapStateToProps } from "../../store/store";

//set the text of the new comment
const NewComment = (props) => {
  //const [commentText, setCommentText] = useState("");

  const commentTextHandler = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <form onSubmit={props.newCommentHandler}>
      <img src="" alt="user-profile-picture" />
      <p>{props.user}</p>
      <label htmlFor="new-comment" />
      <textarea
        id="new-comment"
        name="newComment"
        placeholder="Escrever comentário..."
        value={props.text}
        onChange={commentTextHandler}
      />
      <button>Comentar</button>
    </form>
  );
};

export default connect(mapStateToProps)(NewComment);

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
