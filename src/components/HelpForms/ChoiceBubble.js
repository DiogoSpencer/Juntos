import Icon from "../UI/Icon"

const ChoiceBubble = (props) => {
    return (
        <div onClick={props.onClick}>
            <Icon xmnls={props.xmnls} viewBox={props.viewBox} fill={props.fill} d={props.d}/>
            <p>{props.text}</p>
        </div>
    )
}

export default ChoiceBubble