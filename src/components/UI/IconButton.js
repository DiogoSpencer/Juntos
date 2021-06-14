import Icon from './Icon'

const IconButton = (props) => {
    return (
        <button onClick={props.onClick}>
            <span>
                <Icon xmlns="" viewBox="" fill="" d=""/>
            </span>
            <span>{props.text}</span>
        </button>
    )

}

export default IconButton