import "./Homepage.css";
import Heropage from "./Heropage";
import HowItWorks from "./HowItWorks";
import Footer from "./Footer";

const Homepage = () => {
  return (
    <div className="homepage-container">
      <Heropage />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Homepage;
