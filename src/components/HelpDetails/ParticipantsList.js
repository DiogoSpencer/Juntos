import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/http";
import LoadingSpinner from "../UI/LoadingSpinner";
import PartcipantItem from "./ParticipantItem";
import classes from "./ParticipantsList.module.css";
import Button from "../UI/Button";

const pageSize = 10;

const ParticipantsList = (props) => {
  const [responseData, setResponseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [moreComments, setMoreComments] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const [responseSize, setResponseSize] = useState(0);

  useEffect(() => {
    if (moreComments) {
      setIsLoading(true);
      getAllUsers(
        `?by=${"helpers"}&value=${
          props.requestId
        }&order=${"creationDate"}&dir=${"DESC"}&number=${pageNumber}&size=${pageSize}`
      ).then(
        (response) => {
          setMoreComments(false);
          setIsLoading(false);
          setResponseSize(response.data.content.length);
          setResponseData((prevState) =>
            prevState.concat(response.data.content)
          );
        },
        (error) => {
          setIsLoading(false);
          console.log(error);
        }
      );
    }
  }, [pageNumber, props.requestId, moreComments]);

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

  return (
    <div className={classes.container}>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <ul className={classes.list}>
        {responseData &&
          responseData.length > 0 &&
          responseData.map((participant) => (
            <li key={participant.username} className={classes.listItem}>
              <PartcipantItem
                profileImg={participant.profileImg}
                firstName={participant.firstName}
                lastName={participant.lastname}
                username={participant.username}
                numHelps={participant.numHelps}
              />
            </li>
          ))}
      </ul>
      <div className={classes.buttonContainer}>
        <button
          onClick={loadNextPageHandler}
          disabled={disableButton}
          className={classes.seeMore}
        >
          Ver Mais
        </button>
      </div>
    </div>
  );
};

export default ParticipantsList;
