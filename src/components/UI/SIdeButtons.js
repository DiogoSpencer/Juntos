const SideButtons = (props) => {
    return (
        <div>
            <button onClick={props.onClick1}>{props.button1}</button>
            <button onClick={props.onClick2}>{props.button2}</button>
        </div>
    )
}

export default SideButtons