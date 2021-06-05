const Icon = (props) =>{
    return (
        <svg
        xmlns={props.xmlns}
        viewBox={props.viewBox}
        fill={props.fill}
        >
            <path d={props.d}/>
        </svg>
    )
}

export default Icon