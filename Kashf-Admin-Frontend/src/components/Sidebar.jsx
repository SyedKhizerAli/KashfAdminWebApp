import React from "react";
import "../css/Sidebar.css";
import kashfLogo from "../assets/images/kashf-logo.png";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <img src={kashfLogo} alt="Kashf Logo" />
        <hr />
      </div>
      <div className="sidebar-menu">
        <Link to="/dashboard">
          <p>Dashboard</p>
        </Link>
        <hr />
        <Link to="/loanRequests">
          <p>Loan Requests</p>
        </Link>
        <hr />
        <Link to="/complaints">
          <p>Complaints</p>
        </Link>
        <hr />
        <Link to="/promotions">
          <p>Promotions</p>
        </Link>
        <hr />
      </div>
    </div>
  );
};

export default Sidebar;
