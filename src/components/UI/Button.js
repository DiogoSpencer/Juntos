const Button = (props) => {
    return (
        <button onClick={props.onClick} disabled={props.disabled}>
            <span>{props.text}</span>
        </button>
    )
}

export default Button