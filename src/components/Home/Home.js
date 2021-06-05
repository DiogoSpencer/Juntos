import { Fragment } from "react";
import Footer from "../layout/Footer";
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
      <Footer/>
    </Fragment>
  );
};

export default Home;
