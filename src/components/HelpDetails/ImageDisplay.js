const ImageDisplay = (props) => {

    return (
        <div>
            {props.images.map((image, index) => (
                <img src={image} alt={image.name} key={index} />
            ))}
        </div>
    )
}
//TODO: pensar em quantas imagens max

export default ImageDisplay