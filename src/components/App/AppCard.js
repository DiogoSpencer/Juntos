const AppCard = (props) => {
    return (
        <div>
            <img src={props.img} alt={props.alt}/>
            <p>{props.text}</p>
        </div>
    )
}

export default AppCard