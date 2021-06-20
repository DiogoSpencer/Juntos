import { NavLink } from "react-router-dom";
import { mapStateToProps } from "../../store/store";
import { connect } from "react-redux";

const NavBar = (props) => {
  return (
    <header>
      <div>
        <img src="" alt="logo" />
      </div>
      <nav>
        <ul>
          <li>
            <NavLink exact to="/home">
              juntos
            </NavLink>
          </li>
          <li>
            <NavLink to="/home#herois">Heróis</NavLink>
          </li>
          <li>
            <NavLink to="/home#parceiros">Parceiros</NavLink>
          </li>
          <li>
            <NavLink to="/home#app">App</NavLink>
          </li>
          <li>
            <NavLink to="/faq">FAQ</NavLink>
          </li>
          {!props.isLogged && (
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          )}
          {props.isLogged && (
            <li>
              <NavLink to={`/perfil/${props.user}`}>
                <img src="" alt="user-profile" />
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default connect(mapStateToProps)(NavBar);
