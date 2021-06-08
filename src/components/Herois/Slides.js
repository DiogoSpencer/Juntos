import { Link } from "react-router-dom";
import HeroiCard from "./HeroiCard";
//import classes from "./slideshow.module.css";

const Slides = () => {
  return (
    <div>
      <h3>Outros Heróis</h3>
      <div id="slides">
        <Link to="/">
          <HeroiCard id="slide-1" img="" alt="" text="1" />
        </Link>
        <Link to="/">
          <HeroiCard id="slide-2" img="" alt="" text="2" />
        </Link>
        <Link to="/">
          <HeroiCard id="slide-3" img="" alt="" text="3" />
        </Link>
        <Link to="/">
          <HeroiCard id="slide-4" img="" alt="" text="4" />
        </Link>
        <Link to="/">
          <HeroiCard id="slide-5" img="" alt="" text="5" />
        </Link>
      </div>
    </div>
  );
};

export default Slides;
