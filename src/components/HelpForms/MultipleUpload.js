import { useEffect, useRef, useState } from "react";
import classes from "./MultipleUpload.module.css";

const MultipleUpload = (props) => {
  const [preview, setPreview] = useState([]);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    setPreview([]);
    props.fileChangeHandler(images);
    if (images.length > 0) {
      images.forEach((image) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          setPreview((prevState) => prevState.concat(reader.result));
        };

        reader.readAsDataURL(image);
      });
    }
  }, [images]);

  const handleImageChange = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      if (filesArray.length + images.length > 5) {
        alert("Máximo 5 imagens");
      } else {
        filesArray.forEach((file) => {
          if (file && file.type.substring(0, 5) === "image") {
            setImages((prevState) => prevState.concat(file));
          }
        });
      }
    }
  };

  const onRemoveHandler = (event) => {
    console.log(event.target.id);
    setImages((prevState) => {
      let currentState = [...images];
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

  return (
    <div className={classes.container}>
      <button
        className={classes.imageButton}
        disabled={images.length >= 5}
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
/*

      {preview.length <= 0 && (
        <button
          className={classes.initialButton}
          disabled={images.length >= 5}
          onClick={(event) => {
            event.preventDefault();
            fileInputRef.current.click();
          }}
        ></button>
      )}
*/
