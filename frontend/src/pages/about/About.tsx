import "./About.css";

const About = () => {
  return (
    <div className="about-page-container">
      <section className="about-hero-section">
        <div className="about-hero-copy">
          <div className="about-hero-tag">About (monitor name) </div>
          <h1 className="about-hero-title">very professional title</h1>
          <p className="about-hero-description">
            About page
          </p>
        </div>
      </section>

      <section className="about-content-grid">
        <div className="about-card">
          <h2>Subtitle 1</h2>
          <p>
            Sample
          </p>
        </div>
        <div className="about-card">
          <h2>Subtitle 2</h2>
          <p>
            Text
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
