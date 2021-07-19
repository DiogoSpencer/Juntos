import classes from "./Comment.module.css";
import userIcon from "../../img/userblue.png";

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
      <p className={classes.comment}>{props.text}</p>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={classes.reportFlag} onClick={props.reportHandler}>
        <g data-name="Layer 2">
          <g data-name="flag">
            <polyline points="24 24 0 24 0 0" opacity="0" />
            <path d="M19.27 4.68a1.79 1.79 0 0 0-1.6-.25 7.53 7.53 0 0 1-2.17.28 8.54 8.54 0 0 1-3.13-.78A10.15 10.15 0 0 0 8.5 3c-2.89 0-4 1-4.2 1.14a1 1 0 0 0-.3.72V20a1 1 0 0 0 2 0v-4.3a6.28 6.28 0 0 1 2.5-.41 8.54 8.54 0 0 1 3.13.78 10.15 10.15 0 0 0 3.87.93 7.66 7.66 0 0 0 3.5-.7 1.74 1.74 0 0 0 1-1.55V6.11a1.77 1.77 0 0 0-.73-1.43z" />
          </g>
        </g>
      </svg>
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
