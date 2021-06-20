import {useEffect, useState} from 'react';
import "./WebPage.css";
import {User} from "../../services/httptypes";
import {Button, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import { useHistory } from 'react-router';

function WebPage() {
    const history = useHistory();
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
        history.push("/register/")
    }
    const loginButton = () => {
        history.push("/login/")
    }
    const registerButton = () => {
        history.push("/register/")
    }
    const profileButton = () => {
        history.push("/profile/")
    }


    return (
        <div className="webPage-wrapper">

            <Button onClick={loginButton}>
                Login
            </Button>
            <Button onClick={registerButton}>
                Register
            </Button>
            <Button onClick={profileButton}>
                Profile
            </Button>

        </div>
    );
}

/*
<Button onClick={clickMe} disabled={timeout}>
                Click me!
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

 */

export default WebPage
