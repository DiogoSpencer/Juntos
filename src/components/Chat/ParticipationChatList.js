import { Link, useRouteMatch } from "react-router-dom";
import ChatItem from "./ChatItem"

const pedidoChat = [
  {
    id: 1,
    title: "passear cao",
    status: "active",
    userEmail: "asd@hotmail.com",
    userFistName: "dan",
    userLastName: "sss",
    ownerEmail: "ddd@hotmail.com",
  },
];

const ParticipationChatList = () => {
  const match = useRouteMatch();

  return (
    <div>
      <ol>
        {pedidoChat.map((request) => (
          <li key={request.id}>
            <Link to={`${match.path}/pedidos/${request.id}`}>
              <ChatItem
                title={request.title}
                status={request.status}
                name={request.userFistName + " " + request.userLastName}
              />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ParticipationChatList;
