import classes from "./Comment.module.css";
import userIcon from "../../img/userblue.png";
import { Fragment } from "react";

//get comment from list of comments
//get the user currently logged in (authed user) so that we can toggle likes on comments
//get the authed user to enable reply to comment

const Comment = (props) => {
  return (
    <div className={classes.container}>
      {props.ownerPicture ? (
        <img
          src={props.ownerPicture}
          alt="foto-perfil"
          className={classes.profileImg}
        />
      ) : (
        <img src={userIcon} alt="sem-foto" className={classes.profileImg} />
      )}
      <h6 className={classes.name}>
        {props.ownerFirstName + " " + props.ownerLastName}
      </h6>
      <p className={classes.date}>{props.date}</p>
      <div className={classes.commentIcons}>
        {(props.isOwner ||
          props.authRole === "ADMIN" ||
          props.authRole === "MOD") && (
          <Fragment>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              className={classes.editPencil}
              onClick={() =>
                props.editCommentHandler(
                  props.commentId,
                  props.images,
                  props.text
                )
              }
            >
              <path d="M17.864 3.60051C17.4735 3.20999 16.8403 3.20999 16.4498 3.60051L15.0356 5.01472 19.2782 9.25736 20.6924 7.84315C21.0829 7.45263 21.0829 6.81946 20.6924 6.42894L17.864 3.60051zM17.864 10.6716L13.6213 6.42894 4.72185 15.3284C4.53431 15.516 4.42896 15.7703 4.42896 16.0355L4.42896 18.864C4.42895 19.4163 4.87667 19.864 5.42896 19.864H8.25738C8.5226 19.864 8.77695 19.7586 8.96449 19.5711L17.864 10.6716z" />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              className={classes.reportFlag}
              onClick={() => props.onDeleteComment(props.commentId)}
            >
              <path d="M15 3C15.5523 3 16 3.44772 16 4L18 4C18.5523 4 19 4.44772 19 5C19 5.55229 18.5523 6 18 6L6 6C5.44772 6 5 5.55228 5 5C5 4.44772 5.44772 4 6 4L8 4C8 3.44772 8.44772 3 9 3H15Z" />
              <path
                fillRule="evenodd"
                d="M6 7H18V19C18 20.1046 17.1046 21 16 21H8C6.89543 21 6 20.1046 6 19V7ZM9.5 9C9.22386 9 9 9.22386 9 9.5V18.5C9 18.7761 9.22386 19 9.5 19C9.77614 19 10 18.7761 10 18.5V9.5C10 9.22386 9.77614 9 9.5 9ZM14.5 9C14.2239 9 14 9.22386 14 9.5V18.5C14 18.7761 14.2239 19 14.5 19C14.7761 19 15 18.7761 15 18.5V9.5C15 9.22386 14.7761 9 14.5 9Z"
                clipRule="evenodd"
              />
            </svg>
          </Fragment>
        )}

        {!(
          props.isOwner ||
          props.authRole === "ADMIN" ||
          props.authRole === "MOD"
        ) && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={classes.reportFlag}
            onClick={() => props.reportHandler(props.commentId)}
          >
            <g data-name="Layer 2">
              <g data-name="flag">
                <polyline points="24 24 0 24 0 0" opacity="0" />
                <path d="M19.27 4.68a1.79 1.79 0 0 0-1.6-.25 7.53 7.53 0 0 1-2.17.28 8.54 8.54 0 0 1-3.13-.78A10.15 10.15 0 0 0 8.5 3c-2.89 0-4 1-4.2 1.14a1 1 0 0 0-.3.72V20a1 1 0 0 0 2 0v-4.3a6.28 6.28 0 0 1 2.5-.41 8.54 8.54 0 0 1 3.13.78 10.15 10.15 0 0 0 3.87.93 7.66 7.66 0 0 0 3.5-.7 1.74 1.74 0 0 0 1-1.55V6.11a1.77 1.77 0 0 0-.73-1.43z" />
              </g>
            </g>
          </svg>
        )}
      </div>
      <p className={classes.comment}>{props.text}</p>

      {props.images && (
        <ul className={classes.imageList}>
          {props.images.map((image, index) => (
            <li key={index}>
              <img
                src={image}
                alt="imagem-comentario"
                className={classes.imageComment}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comment;

/*
In the comment Component, we need to pick out a tweet with a specific id from the current list of comments.

That means that we can store the comments in the store and make the comment Page Component, the Dashboard Component, and the comment Component 
into containers (components that have access to the store via the connect function).

As soon as that data changes — if someone likes the tweet, for example — all of the components that use that data will update.

{
  tweets: {
    tweetId: { tweetId, authorId, timestamp, text, likes, replies, replyingTo},
    tweetId: { tweetId, authorId, timestamp, text, likes, replies, replyingTo}
  },
  users: {
    userId: {userId, userName, avatar, tweetsArray},
    userId: {userId, userName, avatar, tweetsArray}
  }
}
*/
