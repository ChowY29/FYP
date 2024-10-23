import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditDonationModal = ({ open, donation, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [images, setImages] = useState([]);
  const [showImageWarning, setShowImageWarning] = useState(false);

  useEffect(() => {
    if (donation) {
      setTitle(donation.title || "");
      setDetails(donation.description || "");
      setTargetAmount(donation.fundsTarget || 0);
    }
  }, [donation]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert images to Base64 before sending data
    const base64Images = await Promise.all(
      Array.from(images).map(async (image) => {
        const base64Image = await convertToBase64(image);
        return base64Image;
      })
    );

    const updatedDonationData = {
      id: donation._id,
      title,
      description: details,
      fundsTarget: targetAmount,
      images: base64Images, // Include Base64 encoded images in the data
    };

    onSubmit(updatedDonationData);
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setImages(selectedFiles);
    setShowImageWarning(selectedFiles.length > 0); // Show warning if new images are selected
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
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Donation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Target Amount</Form.Label>
            <Form.Control
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(parseFloat(e.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Images
              {showImageWarning && (
                <span className="text-muted">
                  {" (Editing images will overwrite existing ones)"}
                </span>
              )}
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/jpeg, image/png"
              multiple
              onChange={handleFileChange}
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="primary" type="submit" className="me-2">
              Save Changes
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditDonationModal;
