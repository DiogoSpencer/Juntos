import { Fragment, useEffect, useRef, useState } from "react";
import classes from "./HeroiUpload.module.css";

//component that uses this should have image state
//and passes the setImage via props and the value of the image
const ImageUpload = (props) => {
  const [preview, setPreview] = useState(props.selectedFile);
  const fileInputRef = useRef();

  const fileChanger = props.fileChangeHandler;

  useEffect(() => {
    if (props.selectedFile && props.selectedFile.type) {
      fileChanger(props.selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(props.selectedFile);
    } else if (props.selectedFile) {
      setPreview(props.selectedFile);
    } else if (props.selectedFile === null) {
      fileChanger(props.selectedFile);

      setPreview(null);
    }
  }, [props.selectedFile, fileChanger]);

  return (
    <Fragment>
      <div className={classes.container}>
        <div>
          {preview && (
            <img
              alt={props.alt}
              src={preview}
              className={classes.imgPreview}
              onClick={() => {
                props.fileChangeHandler(null);
              }}
            />
          )}
          {!preview && (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                fileInputRef.current.click();
              }}
              className={classes.imageButton}
            ><span className={classes.insert}>Insere Aqui uma Imagem</span></button>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files[0];
              if (file && file.type.substring(0, 5) === "image") {
                props.fileChangeHandler(file);
              } else {
                props.fileChangeHandler(null);
              }
            }}
            className={classes.imageInput}
            ref={fileInputRef}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default ImageUpload;
