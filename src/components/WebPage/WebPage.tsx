import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {withRouter} from "react-router";
import "./WebPage.css";
import {
    dispatchToProps,
    FullLanguageRouterProps,
    FullRouteProps,
    languageToProps,
    stateToProps
} from "../../store/store";
import {User} from "../../services/httptypes";
import {Button, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";

function WebPage(Props: FullLanguageRouterProps) {
    const [timeout, changeTimeout] = useState<boolean>(false)
    const [users, setUsers] = useState<User[]>([])
    useEffect(() => {
        setUsers(require("./../../assets/users.json"))
    }, [])
    const clickMe = () => {
        changeTimeout(true);
        setTimeout(()=> changeTimeout(false), 2000)
        let este: User[] = require("./../../assets/users.json")
        let temp = [...users]
        for (let i = 0; i < este.length; i++) {
            temp.push(este[i])
        }
        setUsers(temp)
    }
    useEffect(() => {
        console.log(users.length)
    }, [users])
    const clickYou = () => {
        Props.history.push("/register/")
    }
    const loginButton = () => {
        Props.history.push("/login/")
    }
    const registerButton = () => {
        Props.history.push("/register/")
    }


    return (
        <div className="webPage-wrapper">
            <Button onClick={clickMe} disabled={timeout}>
                Click me!
            </Button>
            <Button onClick={clickYou}>
                Click you!
            </Button>
            <Button onClick={loginButton}>
                Login
            </Button>
            <Button onClick={registerButton}>
                Register
            </Button>
            <p>
                Lista de users
            </p>
            <Table>
                <TableHead className="table-header">
                    <TableRow>
                        <TableCell>{Props.language.webPage.username}</TableCell>
                        <TableCell>{Props.language.webPage.email}</TableCell>
                        <TableCell>{Props.language.webPage.password}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user: User) => (
                        <TableRow>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.password}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default connect(languageToProps)(withRouter(WebPage))
