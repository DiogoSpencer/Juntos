import { Fragment, useState } from "react";
import SearchBar from "../UI/SearchBar";
import SwitchBar from "../UI/SwitchBar";

const MyHelps = () => {
  const [search, setSearch] = useState("");
  const [switchBar, setSwitchBar] = useState(false);

  console.log(switchBar);
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
          <SwitchBar
            name="helps"
            class="minhasajudas"
            yes="Ativas"
            checked={switchBar}
            onChange={setSwitchBar}
          />
        </div>
        <img src="" alt="ajudas-aparecem-aqui" />
        <p>As ajudas que criares aparecem aqui!</p>
      </div>
    </Fragment>
  );
};

export default MyHelps;
