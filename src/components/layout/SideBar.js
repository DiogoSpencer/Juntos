import { useState } from "react";
import { Link } from "react-router-dom";
import SideBarHidden from "../UI/SideBarHidden";
import SideBarIcon from "../UI/SideBarIcon";

const SideBar = () => {
  const [show, setShow] = useState(false);

  
  const hideSideBarHandler = () => {
    setShow(prevState => !prevState);
  }

  const sideBar = (
    <div>
      <Link to="/home">
        <SideBarIcon src="" alt="nova-ajuda-pedido" />
      </Link>
      <Link to="/home">
        <SideBarIcon src="" alt="mensagens" />
      </Link>
      <Link to="/minhasajudas">
        <SideBarIcon src="" alt="minhas-ajudas" />
      </Link>
      <Link to="/home">
        <SideBarIcon src="" alt="mapa" />
      </Link>
      <Link to="/home">
        <SideBarIcon src="" alt="lista" />
      </Link>
    </div>
  );


  return (
    <div>
      <SideBarHidden onClick={hideSideBarHandler}/>
      {show && sideBar}
    </div>
  );
};

export default SideBar;
