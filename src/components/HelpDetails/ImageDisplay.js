import classes from "./ImageDisplay.module.css";
import volunteersIcon from "../../img/volunteersdonate.jpg";

const ImageDisplay = (props) => {
  return (
    <div className={classes.container}>
      {props.images.length > 0 ? (
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
      ) : (
        <div className={classes.imageList}>
          <img src={volunteersIcon} alt="sem-imagens" className={classes.volunteer} />
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
