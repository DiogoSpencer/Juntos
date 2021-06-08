//import classes from './slideshow.module.css'

const HeroiCard = (props) => {
    return (
        <div id={props.id}>
            <img src={props.img} alt={props.alt}/>
            <p>
                {props.text}
            </p>
        </div>
    )
}

export default HeroiCard