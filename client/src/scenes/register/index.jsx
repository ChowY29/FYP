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
import { useRegisterMutation } from "state/api";
import { useNavigate } from "react-router-dom";
import { Toast } from "bootstrap";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const toastRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    setError(""); // Reset error state before every registration attempt
    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      const response = await registerUser({
        firstName,
        lastName,
        email,
        password,
      }).unwrap(); // Unwrap the response to handle it directly

      if (response.message === "Registration successful") {
        navigate("/login");
      } else {
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError(error.data?.message || "Registration failed. Please try again.");
    }
  };

  useEffect(() => {
    if (error) {
      const toastEl = toastRef.current;
      if (toastEl) {
        const toast = new Toast(toastEl); // Initialize the Toast
        toast.show(); // Show the Toast
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
              Register
            </h3>

            <MDBInput
              wrapperClass="mb-4 mx-5 w-100"
              label="First name"
              id="formControlFirstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              size="lg"
            />
            <MDBInput
              wrapperClass="mb-4 mx-5 w-100"
              label="Last name"
              id="formControlLastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              size="lg"
            />
            <MDBInput
              wrapperClass="mb-4 mx-5 w-100"
              label="Email address"
              id="formControlEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="lg"
            />
            <div className="position-relative mb-4 mx-5 w-100">
              <MDBInput
                wrapperClass="w-100"
                label="Password"
                id="formControlPassword"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                size="lg"
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
              onClick={handleRegister}
              className="mb-4 px-5 mx-5 w-100"
              color="primary"
              size="lg"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? "Registering..." : "Register"}
            </MDBBtn>
            <p className="small mb-5 pb-lg-3 ms-5">
              <a className="text-muted" href="#!">
                Forgot password?
              </a>
            </p>
            <p className="ms-5">
              Already have an account?{" "}
              <a href="/login" className="link-info">
                Sign-in here
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
            backgroundPosition: "right 45%",
            bottom: "20%",
            height: "120vh",
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

export default Register;
