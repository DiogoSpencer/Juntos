import { useEffect, useRef, useState } from "react";
import classes from "./MultipleUpload.module.css";

const MultipleUpload = (props) => {
  const [preview, setPreview] = useState(props.images);
  const fileInputRef = useRef();

  const fileChanger = props.fileChangeHandler;

  useEffect(() => {
    if (props.images.length > 0) {
      setPreview([]);
      for (const image of props.images) {
        if (image.type) {
          fileChanger(props.images);
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview((prevState) => prevState.concat(reader.result));
          };

          reader.readAsDataURL(image);
        } else {
          setPreview((prevState) => prevState.concat(image));
        }
      }
    } else if (props.images === null) {
      fileChanger(props.images);

      setPreview(null);
    }
  }, [props.images, fileChanger]);

  const handleImageChange = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      console.log(filesArray);
      if (filesArray.length + props.images.length > 5) {
        alert("Máximo 5 imagens");
      } else {
        filesArray.forEach((file) => {
          if (file && file.type.substring(0, 5) === "image") {
            fileChanger((prevState) => {
              console.log(prevState);
              return prevState.concat(file);
            });
          }
        });
      }
    }
  };

  const onRemoveHandler = (event) => {
    fileChanger((prevState) => {
      let currentState = [...props.images];
      currentState.splice(event.target.id, 1);
      return currentState;
    });
  };

  const renderImages = preview.map((photo, index) => {
    return (
      <li key={index} className={classes.imageItem}>
        <img
          src={photo}
          alt={`foto-${index}`}
          onClick={onRemoveHandler}
          className={classes.imgPreview}
          id={index}
        />
      </li>
    );
  });

  const textClass = props.images.length > 0 ? classes.addImageTextInactive : classes.addImageText;

  return (
    <div className={classes.container}>
      <h5
        className={`${textClass}`}
      >
        Adiciona imagens e torna o teu pedido mais apelativo!
      </h5>
      <button
        className={classes.imageButton}
        disabled={props.images.length >= 5}
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current.click();
        }}
      ></button>
      {preview.length >= 0 && (
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
