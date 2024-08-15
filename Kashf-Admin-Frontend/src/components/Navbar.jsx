import React from 'react';
import '../css/Navbar.css'; 
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
      <div className="navbar">
        <Link to="/">
          <span className="power-icon"><i className="fas fa-power-off"></i></span>
        </Link>
        <Link to="/changePassword">
          <span className="change-password-icon"><i className="fas fa-unlock-alt"></i></span>
        </Link>
      </div>
    );
  };

export default Navbar;
