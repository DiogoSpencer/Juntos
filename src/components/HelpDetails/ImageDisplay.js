import classes from "./ImageDisplay.module.css"

const ImageDisplay = (props) => {
  return (
    <div>
      {props.images && (
        <ul className={classes.imageList}>
          {props.images.map((image, index) => (
            <li key={index} className={classes.imageItem}>
              <img
                src={image}
                alt={image.name}
                className={classes.imgPreview}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ImageDisplay;
