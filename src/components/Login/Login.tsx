import React from 'react'
import { Grid,Paper, Avatar, TextField, Button, Typography,Link } from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {connect} from "react-redux";
import {
    dispatchToProps,
    FullLanguageRouterProps,
    FullRouteProps,
    languageToProps,
    stateToProps
} from "../../store/store";
import {withRouter} from "react-router";
function Login(Props: FullLanguageRouterProps){

    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}

        const loginButton = () => {
            Props.history.push("/")
        }


    return(
        <Grid>
            <Paper elevation={20} style={paperStyle}>
                <Grid>
                    <Avatar style={avatarStyle}></Avatar>
                    <h2>Sign In</h2>
                </Grid>
                <TextField label='Email' placeholder='Enter email' fullWidth required/>
                <TextField label='Password' placeholder='Enter password' type='password' fullWidth required/>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="checkedB"
                            color="primary"
                        />
                    }
                    label="Remember me"
                />
                <Button type='submit' color='primary' variant="contained"
                        style={btnstyle} fullWidth onClick={loginButton}>Sign in</Button>
                <Typography >
                    <Link href="#" >
                        Forgot password?
                    </Link>
                </Typography>
                <Typography > You don't have an account?
                    <Link href="#" >
                        Register
                    </Link>
                </Typography>
            </Paper>
        </Grid>
    )
}

export default connect(languageToProps)(withRouter(Login))