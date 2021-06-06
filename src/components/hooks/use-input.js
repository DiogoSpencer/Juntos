import { useReducer } from "react";

const initialInputState = {
  value: "",
  isTouched: false,
};

//reducer - args: prev state and action dispatched
const inputStateReducer = (state, action) => {
  switch (action.type) {
    case "INPUT":
      //user started typing but hasn't finished
      return { value: action.value, isTouched: state.isTouched };
    case "BLUR":
      //user clicked out
      return { value: state.value, isTouched: true };
    case "RESET":
      return { value: "", isTouched: false };
    default:
      //default
      return initialInputState;
  }
};

const useInput = (validateValue) => {
  //returns: state managed by reducer and dispatch - returns current state paired with dispatch
  const [inputState, dispatch] = useReducer(
    //reducer, initialArg
    inputStateReducer,
    initialInputState
  );

  const valueIsValid = validateValue(inputState.value);

  const hasError = !valueIsValid && inputState.isTouched;

  const valueChangeHandler = (event) => {
    dispatch({
      type: "INPUT",
      value: event.target.value, //value user has written
    });
  };

  const inputBlurHandler = (event) => {
    dispatch({
      type: "BLUR",
    });
  };

  const reset = () => {
    dispatch({
      type: "RESET",
    });
  };

  return {
    value: inputState.value,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };
};

export default useInput;
