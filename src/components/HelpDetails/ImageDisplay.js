const ImageDisplay = (props) => {

    return (
        <div>
            {props.images.map((image, index) => (
                <img src={image} alt={`image-${index}`} key={index} />
            ))}
        </div>
    )
}
//TODO: pensar em quantas imagens max

export default ImageDisplay