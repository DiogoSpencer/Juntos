import { Fragment, useState } from "react";
import Modal from "../UI/Modal";
import closeIcon from "../../img/closered.png";
import classes from "./PassModal.module.css";
import ChangeProfilePassword from "./ChangeProfilePassword";
import LoadingSpinner from "../UI/LoadingSpinner";

const PassModal = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const onCloseModal = () => {
    props.onClose();
  };

  //dont allow to close modal if isLoading
  const closeModal = () => (isLoading ? "" : props.onClose());

  return (
    <Modal onClose={closeModal}>
      <div className={classes.container}>
        {!isLoading && (
          <img
            src={closeIcon}
            alt="close"
            onClick={closeModal}
            className={classes.closeIcon}
          />
        )}
        <Fragment>
          {isLoading && (
            <div className={classes.spinner}>
              <LoadingSpinner />
            </div>
          )}
          <div className={classes.passForm}>
            <ChangeProfilePassword
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onCloseModal={onCloseModal}
            />
          </div>
        </Fragment>
      </div>
    </Modal>
  );
};

export default PassModal;
