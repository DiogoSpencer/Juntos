import { Fragment } from "react";
import Agradecimentos from "./Agradecimentos";
import AppHome from "./AppHome";
import HeroisHome from "./HeroisHome";
import Intro from "./Intro";
import Stats from "./Stats";

const Home = () => {
  return (
    <Fragment>
      <Intro/>
      <AppHome/>
      <Stats/>
      <HeroisHome/>
      <Agradecimentos/>
    </Fragment>
  );
};

export default Home;
