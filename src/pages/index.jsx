import React from "react";
import HeroSection from "../components/Homepage/heroSection/HeroSection";
import InfoSection from "../components/Homepage/infoSection/InfoSection";
import Slider from "../components/slider/Slider";
import {
  aboutObjOne,
  servicesObj,
} from "../components/Homepage/infoSection/data";

const Home = () => {
  return (
    <div className="home" style={{ scrollBehavior: "smooth" }}>
      <HeroSection />
      <InfoSection {...aboutObjOne} />
      <Slider />
      <InfoSection {...servicesObj} />
    </div>
  );
};

export default Home;
