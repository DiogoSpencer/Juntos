import { Fragment } from "react";

const ImageUpload = (props) => {
  return (
    <Fragment>
      {props.fileUpload && (
        <div>
          <div onClick={props.removeImageHandler}>
            <img src="" alt="X" />
          </div>
          <img src={props.selectedFile} alt="profilePicture" />
        </div>
      )}
      {!props.fileUpload && (
        <div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={props.fileChangeHandler}
          />
        </div>
      )}
    </Fragment>
  );
};

export default ImageUpload;

/*
{ //3º arg no axios
        onUploadProgress = progressEvent => {
            console.log(Math.round(progressEvent.loaded / progressEvent.total * 100) + "%")
        }
*/