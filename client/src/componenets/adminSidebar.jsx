import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "assets/ImpactFundLogo.png";
import image from "assets/panel-background.png";
import useAuth from "hooks/useAuth";
import "./AdminSidebar.css"; // custom CSS file for additional styling

const AdminSidebar = () => {
  const navigate = useNavigate();
  const role = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  // If the admin tokens expire immediately re-route to login
  if (role.role === null) {
    navigate("/login");
  }

  return (
    <div
      className="admin-sidebar d-flex flex-column"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="sidebar-logo">
        <Link to="/landingPage" className="nav-link">
          <img src={logo} alt="Impact Fund Logo" />
        </Link>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link
            to="/admin/addDonation"
            className={`nav-link ${
              location.pathname === "/admin/addDonation" ? "active" : ""
            }`}
          >
            <i className="fas fa-plus sidebar-icon"></i>
            <span className="sidebar-text">Add Donation</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/admin/manageDonations"
            className={`nav-link ${
              location.pathname === "/admin/manageDonations" ? "active" : ""
            }`}
          >
            <i className="fas fa-tasks sidebar-icon"></i>
            <span className="sidebar-text">Manage Donations</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/admin/adminFeedback"
            className={`nav-link ${
              location.pathname === "/admin/adminFeedback" ? "active" : ""
            }`}
          >
            <i className="fas fa-comments sidebar-icon"></i>
            <span className="sidebar-text">Feedback</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/admin/adminContacts"
            className={`nav-link ${
              location.pathname === "/admin/adminContacts" ? "active" : ""
            }`}
          >
            <i className="fas fa-address-book sidebar-icon"></i>
            <span className="sidebar-text">Contacts</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/admin/transactionLogs"
            className={`nav-link ${
              location.pathname === "/admin/transactionLogs" ? "active" : ""
            }`}
          >
            <i className="fas fa-clipboard-list sidebar-icon"></i>
            <span className="sidebar-text">Transaction Logs</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/admin/userLogs"
            className={`nav-link ${
              location.pathname === "/admin/userLogs" ? "active" : ""
            }`}
          >
            <i className="fas fa-user sidebar-icon"></i>
            <span className="sidebar-text">User Logs</span>
          </Link>
        </li>
        <li className="nav-item mt-auto">
          <div
            onClick={handleLogout}
            className="nav-link"
            style={{ cursor: "pointer" }}
          >
            <i className="fas fa-sign-out-alt sidebar-icon"></i>
            <span className="sidebar-text">Sign-out</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
