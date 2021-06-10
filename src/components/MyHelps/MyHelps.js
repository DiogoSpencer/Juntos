import { Fragment, useState } from "react"
import SearchBar from "../UI/SearchBar"
import SwitchBar from "../UI/SwitchBar";

const MyHelps = () => {
    const [search, setSearch] = useState("");

    return(
        <Fragment>
            <h1>As Minhas Ajudas</h1>
            <SearchBar input={search} setInput={setSearch} placeholder="Procurar..." />
            <div>
                <SwitchBar name="helps" class="minhasajudas" text="Ativas" />
            </div>
        </Fragment>
    )
}

export default MyHelps