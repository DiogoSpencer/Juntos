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
        setResponseData(response.data);
      },
      (error) => {}
    );
  }, []);

  return (
    <Fragment>
      <Intro />
      <AppHome />
      <Stats
        numHeroes={responseData.numHeroes}
        numPartner={responseData.numPartner}
        totalNumHelps={responseData.totalNumHelps}
      />
      <HeroisHome heroes={responseData.heroes} />
      <Agradecimentos partnerImgs={responseData.partnerImgs} />
    </Fragment>
  );
};

export default Home;
