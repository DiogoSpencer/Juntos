import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import PartcipantItem from "./ParticipantItem";
import classes from "./ParticipantsList.module.css";

const ParticipantsList = () => {
  const [responseData, setResponseData] = useState([]);

  const match = useRouteMatch();
  const requestId = match.path.requestId;

  useEffect(() => {
    //get Participants data
  }, []);

  return (
    <div className={classes.container}>
      <ul className={classes.list}>
        {responseData.map((participant) => (
          <li key={participant.username} className={classes.listItem}>
            <PartcipantItem
              profileImg={participant.profileImg}
              firstName={participant.firstName}
              lastName={participant.lastname}
              username={participant.username}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantsList;
