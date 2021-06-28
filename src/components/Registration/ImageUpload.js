import { Fragment, useEffect, useRef, useState } from "react";
import classes from "./ImageUpload.module.css";

//component that uses this should have image state
//and passes the setImage via props and the value of the image
//via props aswell
const ImageUpload = (props) => {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, [selectedFile]);

  return (
    <Fragment>
      <div className={classes.container}>
        <div>
          {preview && (
            <img
              alt={props.alt}
              src={preview}
              className={props.isProfile? classes.imgPreview : classes.imgPreviewRegist}
              onClick={() => {
                props.fileChangeHandler(null);
                setSelectedFile(null);
              }}
            />
          )}
          {!preview && (
            <button
              onClick={(event) => {
                event.preventDefault();
                fileInputRef.current.click();
              }}
              className={props.isProfile? classes.imageButton : classes.imageButtonRegist}
            ></button>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files[0];
              if (file && file.type.substring(0, 5) === "image") {
                props.fileChangeHandler(file);
                setSelectedFile(file);
              } else {
                props.fileChangeHandler(null);
                setSelectedFile(null);
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

/*
<span className={classes.imageButton}></span>
<button className={classes.imageButton}></button>

{ //3º arg no axios
        onUploadProgress = progressEvent => {
            console.log(Math.round(progressEvent.loaded / progressEvent.total * 100) + "%")
        }
*/
