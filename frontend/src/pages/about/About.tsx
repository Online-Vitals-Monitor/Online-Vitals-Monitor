import "./About.css";

const About = () => {
  return (
    <div className="about-page-container">
      <section className="about-hero-section">
        <div className="about-hero-copy">
          <h1 className="about-hero-title">Simluated Vitals Monitor</h1>
          <p className="about-hero-description">
            A browser-based patient vitals monitor designed for use in medical instruction and simulation
          </p>
        </div>
      </section>

      <section className="about-content-grid">
        <div className="about-card">
          <h2>Subtitle</h2>
          <p>
            - What the app does <br /> - How to use the app <br /> - Tech stack (may move below these sections)
          </p>
        </div>
        <div className="about-card">
          <h2>Team</h2>
          <p>
            Chi Chan <br /> Bryce Khut <br /> Madelyn Sadler <br /> Khoi Le <br /> Lyle McCaffrey <br /> Jamie Liu <br /><br /> <b>Sponsor:</b> Dean Akin <br />
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
