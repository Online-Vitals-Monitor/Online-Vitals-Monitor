import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container-grid">
        <div className="footer-left-section">
          <div className="footer-logo-container">
            <img
              className="logo"
              src="/images/vm-logo.png"
              alt="vitals-monitor"
            />
          </div>
          <p className="footer-description">
            Developed as part of the Senior Capstone Project at Oregon State
            University. <br></br>Built for the purposes of medical practice and
            training.
          </p>
        </div>
      </div>
      <div className="copyright-section">
        <p>&copy; 2026 Vitals Monitor. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
