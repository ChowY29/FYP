import React, { useState, useEffect, useRef } from "react";
import { Grid, TextField, Button, Rating } from "@mui/material";
import { Toast } from "bootstrap";
import AltNavbar from "componenets/altNavbar";
import { useGetUserInfoQuery } from "state/api";
import { useAddFeedbackMutation } from "state/api";
import useAuth from "hooks/useAuth";

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const toastRef = useRef(null);

  const role = useAuth();
  const {
    data: userInfo,
    error: userInfoError,
    isLoading,
  } = useGetUserInfoQuery(undefined, { skip: !role.role });

  const [addFeedback] = useAddFeedbackMutation();

  const handleRatingChange = (newValue) => {
    setRating(newValue);
  };

  const handleFeedbackChange = (e) => {
    const newFeedback = e.target.value;
    if (newFeedback.length <= 200) {
      setFeedback(newFeedback);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0 || feedback.trim() === "") {
      setError("Please provide a rating and feedback.");
      setShowToast(true);
      setIsError(true);
      return;
    }

    if (!role.loading && !role.role) {
      setError("Please log in to submit feedback.");
      setShowToast(true);
      setIsError(true);
      return;
    }

    try {
      await addFeedback({ userId: userInfo._id, rating, feedback }).unwrap();
      setSuccessMessage("Feedback has been sent successfully!");
      setShowToast(true);
      setIsError(false);
      setRating(0);
      setFeedback("");
    } catch (error) {
      setError("Failed to send feedback. Please try again.");
      setShowToast(true);
      setIsError(true);
    }
  };

  useEffect(() => {
    if (showToast) {
      const toastEl = toastRef.current;
      if (toastEl) {
        const toast = new Toast(toastEl, { delay: 10000 });
        toast.show();
        toastEl.addEventListener('hidden.bs.toast', () => {
          setShowToast(false); // Reset showToast after it is hidden
        });
      }
    }
  }, [showToast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AltNavbar />
      <div className="text-center">
        <h1>Feedback</h1>
      </div>

      <Grid container justifyContent="center">
        <Grid item md={8}>
          <div
            style={{
              border: "2px solid black",
              borderRadius: "5px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <div className="mb-3 text-center">
              <Rating
                name="rating"
                value={rating}
                onChange={(event, newValue) => {
                  handleRatingChange(newValue);
                }}
                precision={1}
                style={{ marginLeft: "10px", fontSize: "3rem" }}
              />
            </div>
            <div className="mb-3">
              <TextField
                label="Your feedback"
                multiline
                rows={4}
                value={feedback}
                onChange={handleFeedbackChange}
                required
                fullWidth
                helperText={`${feedback.length}/200`}
                inputProps={{ maxLength: 200 }}
              />
            </div>
          </div>
          <div className="d-flex justify-content-center my-3">
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              className="btn-lg"
            >
              Submit Feedback
            </Button>
          </div>
        </Grid>
      </Grid>
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div
          ref={toastRef}
          className="toast hide"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">{isError ? "Error" : "Success"}</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
          <div className="toast-body">{error || successMessage}</div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
