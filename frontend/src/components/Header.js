import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/interview");
  };

  return (
    <header className="header">
      <div className="header-logo">Robyyn</div>

      <button className="header-cta" onClick={handleGetStarted}>
        Get Started
      </button>
    </header>
  );
}

export default Header;