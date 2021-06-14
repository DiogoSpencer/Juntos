const HelpTitle = (props) => {
    <div>
        <h3>{props.title}</h3>
        <p>{props.helpType}</p>
        <p>{props.creationDate}</p>
        <Icon />
    </div>
}

export default HelpTitle