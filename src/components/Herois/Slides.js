import { useEffect, useRef, useState } from "react";
import HeroiCard from "./HeroiCard";
import classes from "./slideshow.module.css";

const data = [
  { img: "", alt: "", text: "1", link: "/" },
  { img: "", alt: "", text: "2", link: "/" },
  { img: "", alt: "", text: "3", link: "/" },
  { img: "", alt: "", text: "4", link: "/" },
  { img: "", alt: "", text: "5", link: "/" },
];

const delay = 3500;

//link to will be part of the obj we get from server
//maybe hero id?

const Slides = () => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === data.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );
    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <div>
      <h3>Outros Heróis</h3>
      <div className={classes.slideshow}>
        <div
          className={classes.slideshowSlider}
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
        >
          {data.map((obj, index) => (
            <div key={index} className={classes.slide}>
              <HeroiCard
                img={obj.img}
                alt={obj.alt}
                text={obj.text}
                link={obj.link}
              />
            </div>
          ))}
        </div>
        <div className={classes.slideshowDots}>
          {data.map((_, idx) => (
            <div
              key={idx}
              className={`${classes.slideshowDot}${index === idx ? " active" : ""}`}
              onClick={() => {
                setIndex(idx);
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slides;
