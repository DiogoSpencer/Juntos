//Layout
const ChatItem = (props) => {
  return (
    <div>
      <h6>{props.title}</h6>
      <p>{props.status}</p>
      <p>{props.name}</p>
    </div>
  );
};

export default ChatItem;
