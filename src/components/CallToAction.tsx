import { Link } from "react-router-dom";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa6";
import { config } from "../config";
import "./styles/CallToAction.css";

const whatsappUrl = `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(
  config.contact.whatsappMessage
)}`;

const CallToAction = () => {
  return (
    <div className="cta-section">
      <div className="cta-buttons">
        <Link to="/play" className="cta-btn cta-btn-play" data-cursor="disable">
          Play With Me →
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn cta-btn-hire"
          data-cursor="disable"
        >
          <FaWhatsapp className="cta-btn-icon" />
          WhatsApp →
        </a>

        <a
          href={`mailto:${config.contact.email}`}
          className="cta-btn cta-btn-mail"
          data-cursor="disable"
        >
          <FaEnvelope className="cta-btn-icon" />
          Email
        </a>
      </div>
    </div>
  );
};

export default CallToAction;
