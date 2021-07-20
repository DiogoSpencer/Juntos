import { Fragment, useEffect, useState } from "react";
import { homeData } from "../../services/http";
import Agradecimentos from "./Agradecimentos";
import AppHome from "./AppHome";
import HeroisHome from "./HeroisHome";
import Intro from "./Intro";
import Stats from "./Stats";

const Home = () => {
  const [responseData, setResponseData] = useState([]);

  useEffect(() => {
    homeData().then(
      (response) => {
        console.log(response.data);
        setResponseData(response.data);
      },
      (error) => {}
    );
  }, []);

  return (
    <Fragment>
      <Intro />
      <AppHome />
      <Stats />
      <HeroisHome />
      <Agradecimentos />
    </Fragment>
  );
};

export default Home;
