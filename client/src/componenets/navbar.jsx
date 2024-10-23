import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "assets/ImpactFundLogo.png";
import useAuth from "../hooks/useAuth";
import { useGetUserInfoQuery } from "../state/api";
import ChangePasswordModal from "./changePasswordModal"; // Assuming ChangePasswordModal is correctly imported
import { Button, ButtonGroup } from "@mui/material";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false); // State for showing/hiding modal
  const navigate = useNavigate();
  const role = useAuth();
  const {
    data: userInfo,
    error,
    isLoading,
  } = useGetUserInfoQuery(undefined, { skip: !role.role });


  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/landingPage");
    window.location.reload(); // Reload the page to reset the state
  };

  
  const handleShowModal = () => setShowModal(true); // Show modal
  const handleCloseModal = () => setShowModal(false);

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
        {/* Logo */}
        <div className="d-none d-md-block">
          {/* Hide logo on small screens. Looks janky otherwise */}
          <Link to="/" className="d-flex align-items-center">
            <img
              src={logo}
              alt="Impact Fund Logo"
              style={{ width: "7rem", height: "6rem" }}
              className="me-2"
            />
          </Link>
        </div>

        {/* Button Group */}
        <div className="d-flex justify-content-center flex-grow-1 mx-4">
          <ButtonGroup
            variant="outlined"
            aria-label="button group"
            className="btn-group shadow-none custom-button-group"
          >
            <Button
              className="rounded-start-custom btn-sm active"
              component={Link}
              to="/"
              style={{ background: "#DB8015" , color: "white"}}
            >
              Home
            </Button>
            <Button
              className="btn-sm"
              component={Link}
              to="/feedback"
              sx={{ color: "black" }}
            >
              Feedback
            </Button>
            <Button
              className="btn-sm"
              component={Link}
              to="/about"
              sx={{ color: "black" }}
            >
              About
            </Button>
            <Button
              className="rounded-end-custom btn-sm"
              component={Link}
              to="/contact"
              sx={{ color: "black" }}
            >
              Contact
            </Button>
          </ButtonGroup>
        </div>

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
                <i className="fa fa-crown"> </i>
                <span> {`${userInfo.firstName} ${userInfo.lastName}`}</span>
              </span>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <button className="dropdown-item" onClick={() => navigate("/admin/addDonation")}>
                     Admin Menu
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleShowModal}>
                    Change Password
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      handleLogout();
                      navigate("/landingPage");
                    }}
                  >
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
                  <button className="dropdown-item" onClick={handleShowModal}>
                    Change Password
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      handleLogout();
                      navigate("/landingPage");
                    }}
                  >
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
            >
              Login
            </Link>
          </div>
        )}
      </div>
      <ChangePasswordModal
        show={showModal}
        handleClose={handleCloseModal}
        userInfo={userInfo} // Pass userInfo to ChangePasswordModal
      />
    </header>
  );
};

export default Navbar;
