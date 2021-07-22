import { useEffect, useRef, useState } from "react";
import classes from "./MultipleUpload.module.css";

const MultipleUpload = (props) => {
  const [preview, setPreview] = useState(props.images);
  const fileInputRef = useRef();

  const fileChanger = props.fileChangeHandler;

  const textClass = props.images.length > 0 ? classes.addImageTextInactive : "";
  const text = props.comment
    ? "Inserir Imagens"
    : "Adiciona imagens e torna o teu pedido mais apelativo!";
  const buttonClass = props.comment ? classes.smallButton : classes.imageButton;
  const imageClass = props.comment
    ? classes.imgPreviewSmall
    : classes.imgPreview;
  const textSmallClass = props.comment ? classes.addText : classes.addImageText;
  const containerClass = props.comment
    ? classes.containerSmall
    : classes.container;

  useEffect(() => {
    if (props.images && props.images.length > 0) {
      setPreview([]);

      let toLoad = props.images.length;
      let loadedImages = [];

      const synchronizedPreview = (ordinal, image) => {
        loadedImages[ordinal] = image;
        if (--toLoad > 0) return;
        for (const loadedImage of loadedImages) {
          setPreview((prevState) => prevState.concat(loadedImage));
        }
      };

      for (let i = 0; i < props.images.length; i++) {
        if (props.images[i].type) {
          //fileChanger(props.images);
          const reader = new FileReader();
          reader.onloadend = () => {
            synchronizedPreview(i, reader.result);
          };

          reader.readAsDataURL(props.images[i]);
        } else {
          synchronizedPreview(i, props.images[i]);
        }
      }
    } else if (!props.images || props.images.length <= 0) {
      //fileChanger(props.images);

      setPreview(null);
    }
  }, [props.images, fileChanger]);

  const handleImageChange = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      if (filesArray.length + props.images.length > 5) {
        alert("Máximo 5 imagens");
      } else {
        filesArray.forEach((file) => {
          if (
            file &&
            file.type.substring(0, 5) === "image" &&
            file.size <= 10485760
          ) {
            fileChanger((prevState) => {
              return prevState.concat(file);
            });
          } else if (file && file.size > 10485760) {
            alert("Só imagens com menos de 10MB");
          }
        });
      }
    }
  };

  const onRemoveHandler = (event) => {
    fileChanger(() => {
      let currentState = [...props.images];
      currentState.splice(event.target.id, 1);
      return currentState;
    });
  };

  const renderImages =
    preview &&
    preview.map((photo, index) => {
      return (
        <li key={index} className={classes.imageItem}>
          <img
            src={photo}
            alt={`foto-${index}`}
            onClick={onRemoveHandler}
            className={imageClass}
            id={index}
          />
        </li>
      );
    });

  return (
    <div className={containerClass}>
      <h5 className={`${textClass} ${textSmallClass}`}>{text}</h5>
      <button
        className={buttonClass}
        disabled={props.images && props.images.length >= 5}
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current.click();
        }}
      ></button>
      {preview && preview.length >= 0 && (
        <ul className={classes.imageList}>{renderImages}</ul>
      )}

      <input
        type="file"
        name="image"
        accept="image/*"
        multiple
        onClick={(event) => (event.target.value = null)}
        onChange={handleImageChange}
        ref={fileInputRef}
        className={classes.imageInput}
      />
    </div>
  );
};

export default MultipleUpload;
