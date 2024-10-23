import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "assets/ImpactFundLogo.png";
import useAuth from "../hooks/useAuth";
import { useGetUserInfoQuery } from "../state/api";
import ChangePasswordModal from "./changePasswordModal";

const AltNavbar = () => {
  const [active, setActive] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();
  const role = useAuth();
  const {
    data: userInfo,
    error,
    isLoading,
  } = useGetUserInfoQuery(undefined, { skip: !role });

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.reload();
  };

  const handleCloseChangePasswordModal = () =>
    setShowChangePasswordModal(false);

  const handleOpenChangePasswordModal = () => setShowChangePasswordModal(true);

  if (isLoading) {
    return (
      <header>
        <div className="container-fluid d-flex justify-content-center align-items-center py-3 px-5">
          <div>Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header>
      <div className="container-fluid d-flex justify-content-between align-items-center py-3 px-5">
        <div className="d-flex">
          <Link to="/" className="nav-link" onClick={() => setActive("home")}>
            Home
          </Link>
          <Link
            to="/feedback"
            className="nav-link"
            onClick={() => setActive("feedback")}
          >
            Feedback
          </Link>
          <Link
            to="/about"
            className="nav-link"
            onClick={() => setActive("about")}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="nav-link"
            onClick={() => setActive("contact")}
          >
            Contact
          </Link>
        </div>

        <Link
          to="/"
          className="d-flex align-items-center"
          style={{ marginLeft: "-230px" }}
        >
          <img
            src={logo}
            alt="Impact Fund Logo"
            style={{ width: "7rem", height: "6rem" }}
            className="me-2"
          />
        </Link>

        {/* Conditional Login/User Info/Admin */}
        {role.role !== null && userInfo ? (
          role.role === "admin" ? (
            <div className="dropdown">
              <span
                className="dropdown-toggle d-flex align-items-center"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-user me-2"></i>
                <span>{`${userInfo.firstName} ${userInfo.lastName}`}</span>
              </span>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/admin/addDonation")}
                  >
                    <i className="fa fa-crown"></i> Admin Menu
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={handleOpenChangePasswordModal}
                  >
                    Change Password
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="dropdown">
              <span
                className="dropdown-toggle d-flex align-items-center"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-user me-2"></i>
                <span>{`${userInfo.firstName} ${userInfo.lastName}`}</span>
              </span>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <button className="dropdown-item" onClick={() => navigate("/viewHistory")}>
                    <i className="fa-solid fa-scroll"></i> View History
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={handleOpenChangePasswordModal}
                  >
                    Change Password
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )
        ) : (
          <div className="d-flex">
            <Link
              to="/register"
              className="btn btn-warning mx-2 rounded-pill"
              style={{ backgroundColor: "orange", padding: "10px 20px" }}
            >
              Register
            </Link>
            <Link
              to="/login"
              className="btn btn-outline-secondary mx-2 rounded-pill"
              style={{ padding: "10px 20px" }}
              state={{ from: location }}
            >
              Login
            </Link>
          </div>
        )}
      </div>
      <ChangePasswordModal
        show={showChangePasswordModal}
        handleClose={handleCloseChangePasswordModal}
      />
    </header>
  );
};

export default AltNavbar;
