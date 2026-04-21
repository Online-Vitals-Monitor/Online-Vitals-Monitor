import "./About.css";

const About = () => {
  return (
    <div className="about-page-container">
      {/* Banner header */}
      <section className="about-hero-banner">
        <div className="about-hero-copy">
          <h1 className="about-hero-title">Simluated Vitals Monitor</h1>
          <p className="about-hero-description">
            A browser-based patient vitals monitor designed for use in medical instruction and simulation
          </p>
        </div>
      </section>

      <main className="about-main">
        {/* Problem + Solution - SIDE-BY-SIDE desktop */}
        <section className="problem-solution-section">
          <div className="content-max-width">
            <div className="hero-grid">
              <article className="problem-card offset-left">
                <h2 className="section-title">The Problem</h2>
                <p>
                  Nursing education sees a need for simulated training to prepare students for the field. 
                  Current online simulated monitors possess too many system constraints, have limited customization, 
                  require payment or extensive setup, and aren't mobile.
                </p>
              </article>
              <article className="solution-card offset-right">
                <h2 className="section-title">Our Solution</h2>
                <p>
                  Our app aims to provide educators and learners with a more versatile, reliable, and customizable 
                  vitals monitor that can adapt to a wide range of training scenarios. Allows for multiple concurrent 
                  users and sessions and requires no setup to access or use.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Features - 2x2 grid */}
        <section className="features-section">
          <div className="content-max-width">
            <h2 className="section-title centered-title">Key Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Session Sync</h3>
                <p>Session based system manages vitals across devices connected via session IDs.</p>
              </div>
              <div className="feature-card">
                <h3>Real-time</h3>
                <p>Near-real-time sync between multiple users in the same session.</p>
              </div>
              <div className="feature-card">
                <h3>Monitor</h3>
                <p>Trainees work with accurate simulated vital waveforms on the monitor page.</p>
              </div>
              <div className="feature-card">
                <h3>Controller</h3>
                <p>Facilitators change vitals values using the control page, with access to preset configurations and multiple methods of adjustment.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="usage-section">
          <div className="content-max-width">
            <h2 className="section-title centered-title">How to Use</h2>
          </div>
        </section>
      
        {/* Tech Stack - Inline badges */}
        <section className="tech-section">
          <div className="content-max-width">
            <h2 className="section-title">Tech Stack</h2>
            <div className="tech-grid">

            </div>
          </div>
        </section>

        {/* Team */}
        <section className="team-section">
          <div className="content-max-width">
            <h2 className="section-title centered-title">Team</h2>

          </div>
        </section>
      </main>

      {/* Contact footer */}
      <footer className="contact-footer">
        <div className="content-max-width">
          <p>Questions? <a href="mailto:mccaffrl@oregonstate.edu">Email Lyle</a></p>
        </div>
      </footer>
    </div>
  );
};

export default About;