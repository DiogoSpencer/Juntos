import { useState } from "react";
import Modal from "../UI/Modal";
import Login from "./LoginJS";
import Register from "../Registration/Register";
import closeIcon from "../../img/closered.png";
import classes from "./ModalAuth.module.css";
import { Fragment } from "react";

const ModalAuth = (props) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const changeToLoginHandler = () => {
    setIsLogin(true);
  };

  const changeToRegisterHandler = () => {
    setIsLogin(false);
  };

  //close modal when clicking link
  const onClickLinkHandler = () => {
    props.onClose();
  };

  //dont allow to close modal if isLoading
  const closeModal = () => (isLoading ? "" : props.onClose());

  const renderLogin = (
    <div className={classes.authForm}>
      <Login isLoading={isLoading} setIsLoading={setIsLoading} onClickLink={onClickLinkHandler} />
    </div>
  );

  const renderRegister = (
    <div className={classes.authForm}>
      <Register isLoading={isLoading} setIsLoading={setIsLoading} />
    </div>
  );

  return (
    <Modal onClose={closeModal}>
      <div className={classes.container}>
        {!isLoading && (
          <Fragment>
            <img
              src={closeIcon}
              alt="close"
              onClick={closeModal}
              className={classes.closeIcon}
            />
            <div className={classes.buttonDiv}>
              <button
                onClick={changeToLoginHandler}
                className={
                  isLogin ? classes.modalButtonActive : classes.modalButton
                }
              >
                Começa a Ajudar
              </button>
              <button
                onClick={changeToRegisterHandler}
                className={
                  isLogin ? classes.modalButton : classes.modalButtonActive
                }
              >
                Junta-te a Nós
              </button>
            </div>
          </Fragment>
        )}
        {isLogin && renderLogin}
        {!isLogin && renderRegister}
      </div>
    </Modal>
  );
};

export default ModalAuth;
