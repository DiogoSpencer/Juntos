import React, {ChangeEventHandler, FormEventHandler} from "react";
import "./Login.css";
import {FullLanguageRouterProps, languageToProps} from "../../store/store";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {useState} from "react";

import {login} from "../../services/http";
import {Button, Col, Form, InputGroup } from "react-bootstrap";
import { User } from "../../services/httptypes";
interface Validity{
    emailValid ?: boolean,
    passwordValid ?: boolean,
    cPasswordValid ?: boolean,
    usernameValid ?: boolean,
    phoneNumberValid ?: boolean,
    firstNameValid ?: boolean,
    lastNameValid ?: boolean
    emailError ?: string,
    passwordError ?: string,
    cPasswordError ?: string,
    usernameError ?: string,
    phoneNumberError ?: string,
    firstNameError ?: string,
    lastNameError ?: string
}
function Registration(Props: FullLanguageRouterProps) {
    const [validated, setValidated] = useState<Validity>();
    const [formSubmitValid, setformSubmitValid] =useState<boolean>(false)
    const [profile, setProfile] = useState<User>({
            username: '',
            email: '',
            password: '',
            phoneNumber: 0,
            privacy:'',
            role:'',
            stateAccount:''
        }
    )


    const handleSubmit = (event : any) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        login(profile.email, profile.password).then( response => {
                Props.history.push("/")
            },
            error => {
                    alert("Credentials wrong!")
            });
        Props.history.push("/")
    };

    const checkFormValid = () => {
        if( validated?.passwordValid  && validated?.emailValid)
            setformSubmitValid(true)
    }

    const changeInputHandler = (event : any) => {
        const input = event.currentTarget;
        const value : any = input.value;
        const id = input.id;
        switch (id) {
            case "formEmail":
                setProfile({...profile, username : value})
                if(value.length == 0)
                    setValidated({...validated, emailValid : false, emailError : 'Insert email!'})//Props
                else
                    setValidated(({...validated, emailValid : true}))
                checkFormValid();

                break;
            case "formPasswordId":
                setProfile({...profile, password : value})
                if(value.length == 0)
                    setValidated({...validated, passwordValid : false, passwordError : 'Insert password!'})
                else
                    setValidated(({...validated, passwordValid : true}))
                checkFormValid();
                break;
        }

    }

    return (
        <Form>

            <Form.Group controlId="formEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Insert email"
                              onChange={(event: any) => changeInputHandler(event)}
                              isValid={validated?.emailValid}
                              isInvalid={!validated?.emailValid} />
                <Form.Control.Feedback type="invalid">{validated?.emailValid}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPasswordId">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                    <Form.Control type="password" placeholder="Insert password"
                                  onChange={(event: any) => changeInputHandler(event)}
                                  isValid={validated?.passwordValid}
                                  isInvalid={!validated?.passwordValid} />
                    <Form.Control.Feedback type="invalid">{validated?.passwordError}</Form.Control.Feedback>
                </InputGroup>
            </Form.Group>


            <Button variant="light" style={{ 'padding': ' 1vh 3vw', 'backgroundColor': 'rgba(233, 231, 231, 0.6)' }}
                    disabled={!formSubmitValid} type="submit"
                    onClick={(event: any) => handleSubmit(event)} >Submit</Button>
        </Form>
    );
}
export default connect(languageToProps)(withRouter(Registration))
