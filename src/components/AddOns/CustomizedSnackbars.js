import React, { useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { SnackbarContent } from "@material-ui/core";
//import MuiAlert from "@material-ui/lab/Alert";
/*
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
*/
export default function CustomizedSnackbars(props) {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <SnackbarContent message={<>{props.text}</>} />
    </Snackbar>
  );
}

/*
      <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert>

*/
