import classes from "./ImageDisplay.module.css";
import volunteersIcon from "../../img/volunteersdonate.jpg";

const ImageDisplay = (props) => {
  return (
    <div className={classes.container}>
      {props.images && props.images.length > 0 ? (
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
        <div className={classes.emptyImageList}>
          {props.owner ? (
            <span className={classes.imgText}>
              Clica em Editar e insere algumas imagens para tornar o teu pedido
              mais apelativo
            </span>
          ) : (
            <span className={classes.imgText}>Este pedido não tem imagens</span>
          )}
          <img
            src={volunteersIcon}
            alt="sem-imagens"
            className={classes.volunteer}
          />
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
