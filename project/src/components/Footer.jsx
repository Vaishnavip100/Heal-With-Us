import React from 'react';
import '../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <footer className="app-footer">
      <p>
        © {currentYear} Heal With Us. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;