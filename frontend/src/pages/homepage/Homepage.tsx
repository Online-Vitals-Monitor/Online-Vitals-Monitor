import "./Homepage.css";
// import Heropage from "./Heropage";
import BlenderHeroPage from "./BlenderHeroPage";
import HowItWorks from "./HowItWorks";
import Footer from "./Footer";

const Homepage = () => {
  return (
    <div className="homepage-container">
      <BlenderHeroPage />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Homepage;
