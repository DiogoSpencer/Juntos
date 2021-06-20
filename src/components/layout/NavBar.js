import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const isLogged = useSelector((state) => state.auth.isLogged)
  const username = useSelector((state) => state.auth.username)

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
          {!isLogged && (
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          )}
          {isLogged && (
            <li>
              <NavLink to={`/perfil/${username}`}>
                <img src="" alt="user-profile" />
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
