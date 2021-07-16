import { Link } from "react-router-dom"

const HeroiCard = (props) => {
    return (
        <Link to={props.link}>
            <img src={props.img} alt={props.alt}/>
            <p>
                {props.text}
            </p>
        </Link>
    )
}

export default HeroiCard