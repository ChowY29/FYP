import React, { useState } from "react";
import {
  Row,
  Col,
  Button,
  ProgressBar,
  Card,
  ListGroup,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import DonorListModal from "./donorListModal"; // Import the new modal component
import ToastComponent from "componenets/ToastComponent"; // Import ToastComponent

const DonationSidebar = ({ donation }) => {
  const { _id, fundsRaised, fundsTarget, donors } = donation;
  const [showPopover, setShowPopover] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sortedDonors, setSortedDonors] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("danger");
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDonateClick = () => {
    console.log("Donation clicked: role: ", role);
    if (!role || role !== "donor") {
      setToastMessage("You must be logged in as a donor to donate.");
      setToastType("danger");
      setShowToast(true);
    } else {
      navigate(`/payment/${_id}`, { state: { donation } });
    }
  };

  const handleShowAll = () => {
    setSortedDonors(donors);
    setModalTitle("All Donations");
    setShowModal(true);
  };

  const handleShowTop = () => {
    const sorted = [...donors].sort((a, b) => b.amount - a.amount);
    setSortedDonors(sorted);
    setModalTitle("Top Donations");
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px",
            gap: "1px", // Adds space between elements
          }}
        >
          <input
            type="text"
            value={window.location.href}
            readOnly
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ced4da", // Bootstrap-like input border
              borderRadius: "4px", // Rounded corners for the input
              marginRight: "10px",
              color: "#495057", // Bootstrap-like input text color
              backgroundColor: "#e9ecef", // Light background for readonly input
            }}
          />
          <CopyToClipboard text={window.location.href} onCopy={handleCopy}>
            <Button
              variant="outline-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px", // Fixed width for the button
                height: "40px", // Fixed height to make it square
                padding: "0",
              }}
            >
              <ContentCopyIcon />
            </Button>
          </CopyToClipboard>
        </div>
        {copied && (
          <span
            style={{
              display: "block",
              color: "green",
              marginTop: "8px",
              textAlign: "center",
            }}
          >
            Copied!
          </span>
        )}
      </Popover.Body>
    </Popover>
  );

  const totalDonations = donors.length;

  // Initialize variables here
  const topDonation = donors.length
    ? donors.reduce(
        (max, donor) => (donor.amount > max.amount ? donor : max),
        donors[0]
      )
    : { userId: { name: "No donations yet" }, amount: 0 };

  const recentDonation = donors.length
    ? donors.reduce((latest, donor) =>
        new Date(donor.timestamp) > new Date(latest.timestamp) ? donor : latest
      )
    : { userId: { name: "No donations yet" }, amount: 0 };

  const firstDonation = donors.length
    ? donors.reduce((earliest, donor) =>
        new Date(donor.timestamp) < new Date(earliest.timestamp)
          ? donor
          : earliest
      )
    : { userId: { name: "No donations yet" }, amount: 0 };

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <span>RM {fundsRaised}</span>
          <span> raised of {fundsTarget}</span>
        </Card.Title>
        <ProgressBar
          now={(fundsRaised / fundsTarget) * 100}
          variant="success"
        />
        <Card.Text className="mt-2">{totalDonations} donations</Card.Text>
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={popover}
          show={showPopover}
          onToggle={() => setShowPopover(!showPopover)}
        >
          <Button variant="warning" className="w-100 mb-2">
            Share
          </Button>
        </OverlayTrigger>
        <Button
          variant="warning"
          className="w-100 mb-2"
          style={{ backgroundColor: "orange" }}
          onClick={handleDonateClick}
        >
          Donate Now
        </Button>

        <Card.Text className="font-weight-bold mt-4">Top donation</Card.Text>
        <ListGroup variant="flush">
          <ListGroup.Item>
            {topDonation.name ? (
              <div className="d-flex align-items-center">
                <i className="fa fa-user mr-2" />
                <span>{topDonation.name}</span>
                <br />
                
                <i className="fa fa-dollar-sign ml-3 mr-1" />
                <span>RM {topDonation.amount}</span>

                
              </div>
            ) : (
              "No donations yet"
            )}
          </ListGroup.Item>
        </ListGroup>

        <Card.Text className="font-weight-bold mt-4">Recent Donation</Card.Text>
        <ListGroup variant="flush">
          <ListGroup.Item>
            {recentDonation.name ? (
              <div className="d-flex align-items-center">
                <i className="fa fa-user mr-2" />
                <span>{recentDonation.name}</span>
                <i className="fa fa-dollar-sign ml-3 mr-1" />
                <span>RM {recentDonation.amount}</span>
              </div>
            ) : (
              "No donations yet"
            )}
          </ListGroup.Item>
        </ListGroup>

        <Card.Text className="font-weight-bold mt-4">
          <i className="bi bi-heart-fill" style={{ marginRight: "5px" }}></i>
          First donation
        </Card.Text>
        <ListGroup variant="flush">
          <ListGroup.Item>
            {firstDonation.name ? (
              <div className="d-flex align-items-center">
                <i className="fa fa-user mr-2" />
                <span>{firstDonation.name}</span>
                <i className="fa fa-dollar-sign ml-3 mr-1" />
                <span>RM {firstDonation.amount}</span>
              </div>
            ) : (
              "No donations yet"
            )}
          </ListGroup.Item>
        </ListGroup>

        <Row className="mt-4">
          <Col>
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={handleShowAll}
            >
              See All
            </Button>
          </Col>
          <Col>
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={handleShowTop}
            >
              See Top
            </Button>
          </Col>
        </Row>

        {/* Include the modal component */}
        <DonorListModal
          show={showModal}
          handleClose={handleCloseModal}
          donors={sortedDonors}
          title={modalTitle}
        />

        {/* Include the Toast component */}
        <ToastComponent
          message={toastMessage}
          type={toastType}
          show={showToast}
          setShow={setShowToast}
        />
      </Card.Body>
    </Card>
  );
};

export default DonationSidebar;
