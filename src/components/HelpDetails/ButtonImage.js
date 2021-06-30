const ButtonImage = (props) => {
    return(
        <div>
            <div>
                <label htmlFor="single"></label>
                <input type="file" id="single" onChange={props.onChange} />
            </div>

            <div>
                <label htmlFor="multi"></label>
                <input type="file" id="multi" onChange={props.onChange} multiple />
            </div>
        </div>
    )
}

export default ButtonImage