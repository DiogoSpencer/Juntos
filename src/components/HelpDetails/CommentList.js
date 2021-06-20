import { useState } from "react";
import { useSelector } from "react-redux";
import { mapStateToProps } from "../../store/store";
import Button from "../UI/Button";
import Comment from "./Comment";
import NewComment from "./NewComment";

const dummy_data = [
  {
    "ownerPicture": "",
    "ownerFirstName": "Daniel",
    "ownerLastName": "Silva",
    "text": "Adoraria Poder Ajudar..",
    "date": "15-05-2020",
  },
  {
    "ownerPicture": "",
    "ownerFirstName": "Maria",
    "ownerLastName": "Gaspar",
    "text": "Boa ação..",
    "date": "15-04-2020",
  },
];

//get List of comments
const CommentsList = () => {
  const authUsername = useSelector((state) => state.auth.username)
  const [commentText, setCommentText] = useState("");

  const newCommentHandler = (event) => {
    event.preventDefault();

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    
    today = dd + '-' + mm + '-' + yyyy;

    dummy_data.unshift({
      "ownerPicture": "",
      "ownerFirstName": authUsername,
      "ownerLastName": "SSS",
      "text" : commentText,
      "date" : today
    })
    setCommentText("");
  }

  return (
    <div>
      <NewComment newCommentHandler={newCommentHandler} text={commentText} onChange={setCommentText}/>
      <ol>
        {dummy_data.map((comment, index) => (
          <li key={index}>
            <Comment
              ownerPicture={comment.ownerPicture}
              ownerFirstName={comment.ownerFirstName}
              ownerLastName={comment.ownerLastName}
              text={comment.text}
              date={comment.date}
            />
          </li>
        ))}
      </ol>
      <Button text="Carregar Mais" />
    </div>
  );
};

export default CommentsList;
