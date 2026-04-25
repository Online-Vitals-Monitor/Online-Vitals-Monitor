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
        {/* Problem + Solution */}
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
                  vitals monitor that can adapt to a wide range of training scenarios. It allows for multiple concurrent 
                  users and sessions and requires no setup to access or use.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Features */}
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
            
            <div className="usage-flow-grid">
              {/* Step 1 */}
              <div className="usage-step">
                <h3 className="step-title">1. Create/Join Session</h3>
                <p className="step-description">
                  Create a new session or join an existing one.
                </p>
                <figure className="screenshot-figure">
                  <img 
                    src="images/session_mgmt.png" 
                    alt="create or join existing session capture from the home page"
                    className="screenshot-image"
                  />
                </figure>
              </div>

              {/* Step 2 */}
              <div className="usage-step">
                <h3 className="step-title">2. Edit and View Vitals</h3>
                <p className="step-description">
                  Use the monitor page to view vitals and the controller page to edit them. Changes will sync in near real-time across all users in the session.
                </p>
                <figure className="screenshot-figure">
                  <img 
                    src="images/monitor_controller_sidebyside.png" 
                    alt="side by side of controller and monitor pages"
                    className="screenshot-image"
                  />
                </figure>
              </div>
            </div>
            {/* Try-it utton for the call to action requirement */}
            <div className="after-howto-cta">
              <a
                href="/"
                className="inline-button"
                aria-label="Go to the homepage to manage or join a simulation session"
              >
                Open the homepage to get started!
              </a>
            </div>
          </div>
        </section>
      
        {/* Tech Stack + Team Side-by-Side */}
        <section className="tech-team-section">
          <div className="content-max-width">
            <div className="tech-team-grid">

              {/* Team */}
              <div className="team-column">
                <h2 className="section-title">Team</h2>
                <div className="team-list">
                  <div className="team-item">
                    <span className="team-name">Chi Chan</span>
                    <span className="team-role">Frontend Development</span>
                    <div className="team-links">
                      <a href="mailto:chanc4@oregonstate.edu">Email</a>
                      <a href="https://github.com/ChiChan17">GitHub</a>
                    </div>
                  </div>
                  
                  <div className="team-item">
                    <span className="team-name">Bryce Khut</span>
                    <span className="team-role">Frontend Development</span>
                    <div className="team-links">
                      <a href="mailto:khutb@oregonstate.edu">Email</a>
                      <a href="https://github.com/khut-bryce">GitHub</a>
                    </div>
                  </div>
                  
                  <div className="team-item">
                    <span className="team-name">Khoi Le</span>
                    <span className="team-role">Frontend & Waveform Development</span>
                    <div className="team-links">
                      <a href="mailto:lekhoi@oregonstate.edu">Email</a>
                      <a href="https://github.com/khozii">GitHub</a>
                    </div>
                  </div>
                  
                  <div className="team-item">
                    <span className="team-name">Jamie Liu</span>
                    <span className="team-role">Backend Development</span>
                    <div className="team-links">
                      <a href="mailto:ljliu01417@gmail.com">Email</a>
                      <a href="https://github.com/jmliu1417">GitHub</a>
                    </div>
                  </div>
                  
                  <div className="team-item">
                    <span className="team-name">Lyle McCaffrey</span>
                    <span className="team-role">Frontend Development</span>
                    <div className="team-links">
                      <a href="mailto:lylemccaffrey@gmail.com">Email</a>
                      <a href="https://github.com/LyleMcCaffrey">GitHub</a>
                    </div>
                  </div>
                  
                  <div className="team-item">
                    <span className="team-name">Madelyn Sadler</span>
                    <span className="team-role">Backend Development, Waveforms</span>
                    <div className="team-links">
                      <a href="mailto:maddiemsadler@gmail.com">Email</a>
                      <a href="https://github.com/MadelynSadler">GitHub</a>
                    </div>
                  </div>
                  
                  <div className="partner-header">
                    <h4 className="partner-title">Project Partner</h4>
                  </div>
                  
                  <div className="team-item">
                    <span className="team-name">Dean Akin</span>
                    <span className="team-role">Simulation Operations Technician<br/>Western Oregon University of Health Sciences</span>
                    <div className="team-links">
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="tech-column">
                <h2 className="section-title right-alligned-title">Tech Stack</h2>
                <ul className="tech-list">
                  <li>React Frontend</li>
                  <li>Express + Node.js Backend</li>
                  <li>Supabase Database</li>
                  <li>Vercel Deployment</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Contact footer */}
      <footer className="contact-footer">
        <div className="content-max-width">
          <p>Questions? <a href="mailto:lylemccaffrey@gmail.com" className="footer-link">Email Lyle</a></p> 
        </div>
      </footer>
    </div>
  );
};

export default About;