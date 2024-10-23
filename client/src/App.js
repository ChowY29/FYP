import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Login from "./scenes/login";
import Register from "./scenes/register";
import LandingPage from "./scenes/landingPage";
import Layout from "./scenes/layout";
import AddDonation from "./scenes/addDonation";
import ManageDonations from "./scenes/manageDonations";
import TransactionLogs from "./scenes/transactionLogs";
import UserLogs from "./scenes/userLogs";
import useAuth from "./hooks/useAuth";
import Feedback from "scenes/feedback";
import AboutUsPage from "scenes/about";
import ContactUs from "scenes/contactUs";
import DonationDetails from "./scenes/donationDetails";
import AdminFeedbackPage from "scenes/adminfeedback";
import AdminContactPage from 'scenes/adminContactUs';
import CheckOut from "./scenes/checkOut";
import Error from 'scenes/error';
import ViewHistory from 'scenes/viewHistory';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const ProtectedRoute = ({ children, requiredRole }) => {
  const { role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/landingPage" replace />;
  }

  return children;
};

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/landingPage" replace />} />
          <Route path="/login/*" element={<LoginLayout />} />
          <Route path="/register/*" element={<Register />} />
          <Route path="/landingPage/*" element={<LandingPage />} />
          <Route path="/donation/:id" element={<DonationDetails />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="about" element={<AboutUsPage />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="error" element={<Error />} />
          <Route path="viewHistory" element={<ViewHistory />} />
          <Route path="/payment/:id" element={
            <Elements stripe={stripePromise}>
              <CheckOut />
            </Elements>
          } />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          />

          {/* Donor Routes */}
          <Route
            path="/donor/*"
            element={
              <ProtectedRoute requiredRole="donor">
                <DonorRoutes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const LoginLayout = () => (
  <Routes>
    <Route index element={<Login />} />
    <Route path="register" element={<Register />} />
  </Routes>
);

const AdminLayout = () => (
  <Routes>
    <Route path="/" element={<Navigate to="addDonation" replace />} />
    <Route element={<Layout />}>
      <Route path="addDonation" element={<AddDonation />} />
      <Route path="manageDonations" element={<ManageDonations />} />
      <Route path="transactionLogs" element={<TransactionLogs />} />
      <Route path="userLogs" element={<UserLogs />} />
      <Route path="adminFeedback" element={<AdminFeedbackPage />} />
      <Route path="adminContacts" element={<AdminContactPage />} />
    </Route>
  </Routes>
);

const DonorRoutes = () => (
  <Routes>
    <Route path="landingPage" element={<LandingPage />} />
    <Route path="feedback" element={<Feedback />} />
  </Routes>
);

export default App;
