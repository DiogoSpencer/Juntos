import {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {withRouter} from "react-router";
import "./Profile.css";
import {mapDispatchToProps, FullRouteProps, mapStateToProps} from "../../store/store";
import {getUser, register} from "../../services/http";
import {User} from "../../services/httptypes";
import {Button, Col, Row, Form, InputGroup} from "react-bootstrap";
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

function Profile(Props: FullRouteProps) {
    const [validated, setValidated] = useState<Validity>();
    const [formSubmitValid, setformSubmitValid] = useState<boolean>(false)
    const data = new FormData()
    const [profile, setProfile] = useState<User>({
            username: '',
            email: '',
            password: '',
            phoneNumber: 0,
            privacy: '',
            role: '',
            stateAccount: ''
        }
    )

    const userId: string = Props.match.params.userId
    //const [user, setUser] = useState<User | undefined>()
    useEffect(() => {

        if(Props.isLogged) {
            getUser(userId).then(
                response => {
                    setProfile(response.data)
                },
                error => {
                    console.log(error.statusCode)
                }
            )
        }
    }, [Props.isLogged, userId])

    const changePic = (event: any) => {
        data.append('file', event.target.files[0])
    }
    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        register(profile, data).then(response => {
                Props.history.push("/")
            },
            error => {
                if (error.statusCode === 409)
                    alert("Email already has an account")
            });
    };

    const changeInputHandler = (event: any) => {
        const input = event.currentTarget;
        const value: any = input.value;
        const id = input.id;
        switch (id) {
            case "formUsername":
                setProfile({...profile, username: value})
                if (value.length < 6)
                    setValidated({...validated, usernameValid: false, usernameError: 'Must have 6 characters'})//Props
                else
                    setValidated(({...validated, usernameValid: true}))

                break;
            case "formPasswordId":
                setProfile({...profile, password: value})
                if (value.length < 4 || value.length > 10)
                    setValidated({
                        ...validated,
                        passwordValid: false,
                        passwordError: 'Must have between 4 and 10 characters'
                    })
                else if (false)//[A-Z]) && [a-z] && [1-9]
                    setValidated({
                        ...validated, passwordValid: false, passwordError: 'Must include at least one upper' +
                            ' case letter,one lower case letter, and one digit.'
                    })
                else
                    setValidated(({...validated, passwordValid: true}))
                break;
            case "formConfirmPassword":
                if (value !== profile.password)
                    setValidated({...validated, cPasswordValid: false, cPasswordError: 'Passwords dont match!'})//Props
                else
                    setValidated(({...validated, cPasswordValid: true}))
                break;

            case "formPhoneNumber":
                setProfile({...profile, phoneNumber: value})
                if (value.length !== 9)
                    setValidated({
                        ...validated,
                        phoneNumberValid: false,
                        phoneNumberError: 'Phone number must have 9 digits'
                    })//Props
                else
                    setValidated(({...validated, phoneNumberValid: true}))
                break;
            case "formFirstName":
                if (value.length === 0)
                    setValidated({...validated, firstNameValid: false, firstNameError: 'First name is required!'})//Props
                else
                    setValidated({...validated, firstNameValid: true})
                break;
            case "formLastName":
                if (value.length === 0)
                    setValidated({...validated, lastNameValid: false, lastNameError: 'Last name is required!'})//Props
                else
                    setValidated(({...validated, lastNameValid: true}))
                break;
            case "formEmail":
                if (value.length === 0)
                    setValidated({...validated, emailValid: false, emailError: 'Email is required!'})//Props
                else
                    setValidated({...validated, emailValid: true})
                break;
        }
    }


        return (
            <Form>
                <Form.Row>
                    <Form.Group as={Col} controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control required type="text" placeholder="First name"
                                      onChange={(event: any) => changeInputHandler(event)}
                                      isValid={validated?.firstNameValid}
                                      isInvalid={!validated?.firstNameValid}/>
                        <Form.Control.Feedback type="invalid">{validated?.firstNameError}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Last name"
                                      onChange={(event: any) => changeInputHandler(event)}
                                      isValid={validated?.lastNameValid}
                                      isInvalid={!validated?.lastNameValid}/>
                        <Form.Control.Feedback type="invalid">{validated?.lastNameError}</Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Insert username"
                                  onChange={(event: any) => changeInputHandler(event)}
                                  isValid={validated?.usernameValid}
                                  isInvalid={!validated?.usernameValid}/>
                    <Form.Control.Feedback type="invalid">{validated?.usernameError}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextEmail">
                    <Form.Label column sm="2">
                        Email
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control plaintext readOnly defaultValue="email@example.com" />
                    </Col>
                </Form.Group>
                <Form.Group controlId="formPasswordId">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                        <Form.Control type="password" placeholder="Insert password"
                                      onChange={(event: any) => changeInputHandler(event)}
                                      isValid={validated?.passwordValid}
                                      isInvalid={!validated?.passwordValid}/>
                        <Form.Control.Feedback type="invalid">{validated?.passwordError}</Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Insert password"
                                  onChange={(event: any) => changeInputHandler(event)}
                                  isValid={validated?.cPasswordValid}
                                  isInvalid={!validated?.cPasswordValid}/>
                    <Form.Control.Feedback type="invalid">{validated?.cPasswordError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPhoneNumber">
                    <Form.Label>Cellphone</Form.Label>
                    <Form.Control type="tel" placeholder="What's your cellphone number"
                                  onChange={(event: any) => changeInputHandler(event)}
                                  isValid={validated?.phoneNumberValid}
                                  isInvalid={!validated?.phoneNumberValid}/>
                    <Form.Control.Feedback type="invalid">{validated?.phoneNumberError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPrivacy">
                    <Form.Label>Privacy</Form.Label>
                    <Form.Control as="select" defaultValue="Public">
                        <option>Public</option>
                        <option>Private</option>
                    </Form.Control>
                </Form.Group>
                <Form>
                    <Form.Group>
                        <Form.File id="insertPhoto" label="Insert your photo"
                                   onChange={(event: any) => changePic(event)}/>
                    </Form.Group>
                </Form>
                <Button variant="light" style={{'padding': ' 1vh 3vw', 'backgroundColor': 'rgba(233, 231, 231, 0.6)'}}
                        disabled={!formSubmitValid} type="submit"
                        onClick={(event: any) => handleSubmit(event)}>Submit</Button>
            </Form>
        );
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile))

;
