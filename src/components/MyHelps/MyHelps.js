import { Fragment, useState } from "react";
import SearchBar from "../UI/SearchBar";
import SideButtons from "../UI/SIdeButtons";
//import SwitchBar from "../UI/SwitchBar";

const MyHelps = () => {
  const [search, setSearch] = useState("");
  //const [switchBar, setSwitchBar] = useState(false);
  const [isActive, setIsActive] = useState(true); //mostrar as ativas
  const [hasActiveData, setHasActiveData] = useState(false); //assumindo que nao ha data de pedidos ativos no inicio - antes de fetch
  const [hasInactiveData, setHasInactiveData] = useState(false); //assumindo que nao ha data de pedidos inativas no inicio - antes de fetch

  const ativasHandler = () => {
    setIsActive(true);
  };

  const inativasHandler = () => {
    setIsActive(false);
  };

  //TODO FETCH DATA

  const noDataActive = (
    <div>
      <img src="" alt="ajudas-aparecem-aqui" />
      <p>As ajudas que criares aparecem aqui!</p>
    </div>
  );

  const noDataInactive = (
    <div>
      <img src="" alt="ajudas-concluidas-aparecem-aqui" />
      <p>As ajudas que concluires aparecem aqui!</p>
    </div>
  );

  //lista de ajudas ativas -> mapear da data que se recebe
  const active = (
    <div>
      <ul>
        <li></li>
      </ul>
    </div>
  );

  //lista de ajudas concluidas (inativas) -> mapear do que se recebe
  const inactive = (
    <div>
      <ul>
        <li></li>
      </ul>
    </div>
  );

  return (
    <Fragment>
      <h1>As Minhas Ajudas</h1>
      <SearchBar
        input={search}
        setInput={setSearch}
        placeholder="Procurar..."
      />
      <div>
        <div>
          <SideButtons
            button1="Ativas"
            button2="Inativas"
            onClick1={ativasHandler}
            onClick2={inativasHandler}
          />
        </div>
        {!hasActiveData && isActive && noDataActive}
        {!hasInactiveData && !isActive && noDataInactive}
        {hasActiveData && isActive && active}
        {hasInactiveData && !isActive && inactive}
      </div>
    </Fragment>
  );
};

export default MyHelps;


/* <SwitchBar
name="helps"
class="minhasajudas"
yes="Ativas"
checked={switchBar}
onChange={setSwitchBar}
/> */

