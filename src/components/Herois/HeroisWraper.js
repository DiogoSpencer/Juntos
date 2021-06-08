import { Fragment } from "react"
import Heroi from "./Heroi"
import Slides from "./Slides"

const HeroisWraper = (props) => {
    return (
        <Fragment>
            <Heroi img={props.img} alt={props.alt} title={props.title} text={props.text}/>
            <Slides />
        </Fragment>
    )
}

export default HeroisWraper

//pensar em meter estes props na store ou fazer um Context hook porque estamos a passar varios niveis