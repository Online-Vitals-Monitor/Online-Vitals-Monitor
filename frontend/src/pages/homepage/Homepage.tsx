import "./Homepage.css";
// import Heropage from "./Heropage";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import Footer from "./Footer";

const Homepage = () => {
  return (
    <div className="homepage-container">
      <HeroSection />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Homepage;
