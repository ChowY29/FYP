import React, { useState, useEffect, useRef } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import image from "assets/panel-background.png";
import logo from "assets/ImpactFundLogo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { Toast } from "bootstrap";
import { useLoginMutation } from "state/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation(); // Get the location state
  const toastRef = useRef(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const response = await login({ email, password }).unwrap();
      const { accessToken, refreshToken, role } = response;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const from = location.state?.from?.pathname || "/"; // Get the previous location or default to home

      // Navigate based on role
      if (role === "admin") {
        navigate("/admin/addDonation");
      } else {
        navigate(from, { replace: true }); // Navigate to the previous page or home
      }
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    const from = location.state?.from?.pathname || "/"; // Get the previous location or default to home
    navigate(from); // Navigate back to the previous page
    window.location.reload(); // Reload the page to reset the state
  };

  useEffect(() => {
    if (error) {
      const toastEl = toastRef.current;
      if (toastEl) {
        const toast = new Toast(toastEl);
        toast.show();
      }
    }
  }, [error]);

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol sm="6">
          <div className="d-flex flex-row align-items-center ps-5 pt-5">
            <img
              src={logo}
              alt="Impact Fund Logo"
              className="logo-image me-3"
              style={{ width: "8rem", height: "7rem", color: "#709085" }}
              //since users don't need to login to view the homepage, we can add a link to the homepage
              //doesn't look great having the navbar in the login page
              onClick={() => { navigate("/"); }}  
            />
            <span className="h1 fw-bold mb-0 font-paytone-one">
              Impact Fund
            </span>
          </div>

          <div className="d-flex flex-column justify-content-center h-custom-2 w-75 pt-4">
            <h3
              className="fw-bold mb-3 ps-5 pb-3"
              style={{ letterSpacing: "1px" }}
            >
              Log in
            </h3>

            <MDBInput
              wrapperClass="mb-4 mx-5 w-100"
              label="Email address"
              type="email"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="position-relative mb-4 mx-5 w-100">
              <MDBInput
                wrapperClass="w-100"
                label="Password"
                type={showPassword ? "text" : "password"}
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`fa ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } position-absolute end-0 top-0 mt-3 me-3`}
                style={{ cursor: "pointer" }}
                onClick={togglePasswordVisibility}
              />
            </div>

            <MDBBtn
              className="mb-4 px-5 mx-5 w-100"
              color="primary"
              size="lg"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </MDBBtn>
            <p className="small mb-5 pb-lg-3 ms-5">
              <a className="text-muted" href="#!">
                Forgot password?
              </a>
            </p>
            <p className="ms-5">
              Don't have an account?{" "}
              <a href="/register" className="link-info">
                Register here
              </a>
            </p>
          </div>
        </MDBCol>

        <MDBCol
          sm="6"
          className="d-none d-sm-block px-0"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "right 45% bottom 20%",
            height: "100vh",
          }}
        />
      </MDBRow>
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div
          ref={toastRef}
          id="errorToast"
          className="toast hide"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">Error</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => setError("")}
            ></button>
          </div>
          <div className="toast-body">{error}</div>
        </div>
      </div>
    </MDBContainer>
  );
};

export default Login;
