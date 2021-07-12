import { useEffect, useState } from "react";
import HeroiCard from "./HeroiCard";
import classes from "./HeroiGallery.module.css";

const HeroGallery = () => {
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    //fetch data dos herois
  }, []);

  return (
    <div className={classes.container}>
      <h1 className={classes.tittle}>Nem Todos os Heróis Vestem Capas</h1>
      <div className={classes.subContainer}>
        {responseData && (
          <ul className={classes.heroList}>
            {responseData.heroes.map((hero, index) => {
              <li key={index}>
                <HeroiCard hero={hero} />
              </li>;
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HeroGallery;
