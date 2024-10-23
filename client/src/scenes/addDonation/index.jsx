// src/scenes/addDonation/AddDonation.jsx
import React, { useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBTextArea,
} from "mdb-react-ui-kit";
import ToastComponent from "componenets/ToastComponent";
import { useAddDonationMutation } from "state/api";

const AddDonation = () => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [images, setImages] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("danger");
  const [showToast, setShowToast] = useState(false);
  const [addDonation, { isLoading }] = useAddDonationMutation(); // Initialize the mutation hook

  const validateForm = () => {
    let isValid = true;
    if (targetAmount <= 0 || isNaN(targetAmount)) {
      isValid = false;
      setToastMessage("Target amount must be a number greater than 0");
      setToastType("danger");
      setShowToast(true);
    }
    if (images.length === 0) {
      isValid = false;
      setToastMessage("Please select at least one image");
      setToastType("danger");
      setShowToast(true);
    }
    for (const file of images) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        isValid = false;
        setToastMessage("Only JPG and PNG images are allowed");
        setToastType("danger");
        setShowToast(true);
        break;
      }
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form data:", title, details, targetAmount, images);
      const donationData = {
        title,
        details,
        targetAmount,
        images: [],
      };

      // Convert images to Base64 and append to donationData.images
      const imagePromises = Array.from(images).map(async (image) => {
        const base64Image = await convertToBase64(image);
        donationData.images.push(base64Image);
      });

      try {
        await Promise.all(imagePromises);
        console.log("Donation data:", donationData);
        await addDonation(donationData).unwrap(); // Ensure addDonation is adapted to handle JSON
        // Reset form fields if needed
        setTitle("");
        setDetails("");
        setTargetAmount(0);
        setImages([]);
        setToastMessage("Donation added successfully");
        setToastType("success");
        setShowToast(true);
      } catch (error) {
        setToastMessage("Failed to add donation");
        setToastType("danger");
        setShowToast(true);
      }
    }
  };

  // Utility function to convert file to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  return (
    <MDBContainer className="my-5">
      <ToastComponent
        message={toastMessage}
        type={toastType}
        show={showToast}
        setShow={setShowToast}
      />
      <MDBRow className="justify-content-center">
        <MDBCol md="8">
          <h1 className="text-center mb-4">Add new donation</h1>
          <form onSubmit={handleSubmit}>
            <MDBInput
              label="Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4"
              style={{ width: "100%", height: "71px" }}
              required
            />
            <MDBTextArea
              label="Donation details"
              type="textarea"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mb-4"
              style={{ width: "100%", height: "200px", whiteSpace: 'pre-wrap'}}  //ensures that the "/n" are parsed as new lines
              rows={4}
              required
            />
            <MDBInput
              label="Target amount"
              type="number"
              value={targetAmount === 0 ? "" : targetAmount}
              onChange={(e) => setTargetAmount(parseFloat(e.target.value))}
              className="mb-4"
              style={{ width: "100%", height: "71px" }}
              required
            />
            <div className="mb-4">
              <label className="form-label" htmlFor="images">
                Image(s)
              </label>
              <MDBInput
                type="file"
                id="images"
                accept="image/jpeg, image/png"
                onChange={(e) => setImages(e.target.files)}
                multiple
                className="custom-file-input"
                style={{ width: "100%" }}
              />
            </div>
            <MDBBtn
              color="warning"
              className="btn-block mb-4"
              style={{ fontWeight: "bold", height: "71px", width: "100%" }}
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? "Submitting..." : "Add Donation"}
            </MDBBtn>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default AddDonation;
