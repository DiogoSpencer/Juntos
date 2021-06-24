
import classes from "./SideBarHidden.module.css"

const SideBarHidden = (props) => {
    return (
        <div onClick={props.onClick} className>
            <img src="" alt="sidebar" />
        </div>
    )
}

export default SideBarHidden