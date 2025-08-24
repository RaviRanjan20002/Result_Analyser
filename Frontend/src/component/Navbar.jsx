
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // Adjust the path as necessary
import logo from "../assets/dott.png"; // Adjust the path as necessary

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <img src={logo} alt="DOT Logo" />
      </div>

      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      {/* Navigation Links */}
      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={toggleMenu}>Add Result</Link>
        <Link to="/result" onClick={toggleMenu}>View Result</Link>
        <Link to="/registerStudent" onClick={toggleMenu}>Register Student</Link>
        <Link to="/resultdashboard" onClick={toggleMenu}>Batch Analysis</Link>
        <Link to="/quizanalysis" onClick={toggleMenu}>Quiz Analysis</Link>
        <Link to="/comparision" onClick={toggleMenu}>Analysed With Topper</Link>
      </div>
    </nav>
  );
};

export default Navbar;
