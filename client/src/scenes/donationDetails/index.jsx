import React, { useEffect, useRef } from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";
import AltNavbar from "componenets/altNavbar";
import DonationSidebar from "./donationSidebar";
import { useGetDonationByIdQuery } from "state/api";
import moment from "moment"; // Import moment for time formatting

const DonationDetails = () => {
  const { id } = useParams();
  const { data: donation, error, isLoading } = useGetDonationByIdQuery(id);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const sidebar = sidebarRef.current;
      if (sidebar) { // Check if sidebarRef.current is not null
        if (window.scrollY > sidebar.offsetTop - 10) {
          sidebar.classList.add("fixed-sidebar");
        } else {
          sidebar.classList.remove("fixed-sidebar");
        }
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading donation details.</div>;

  const imageStyle = {
    width: "100%",
    height: "30rem", // Adjusted height
    objectFit: "cover", // Ensure the image covers the container
    borderRadius: "16px",
    marginBottom: "20px",
  };

  return (
    <div>
      <AltNavbar />
      <Container className="mt-4">
        <Row>
          <Col>
            <h1>{donation.title}</h1>
          </Col>
        </Row>
        <Row>
          <Col md={8}>
            {donation.images && donation.images.length > 0 ? (
              <Carousel>
                {donation.images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={image}
                      alt={`Slide ${index}`}
                      style={imageStyle}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <img
                src="https://via.placeholder.com/800x400"
                alt={donation.title}
                style={imageStyle}
              />
            )}
          </Col>
          <Col md={4} ref={sidebarRef}>
            <DonationSidebar donation={donation} />
          </Col>
        </Row>
        <h2 className="text-md">Donation News</h2>
        <Row>
          <Col md={8}>
            <hr className="pb-3" />
            <p style={{ whiteSpace: 'pre-wrap' }}>{donation.description}</p>
            <hr className="pt-3 pb-0" />
            <h2 className="text-md">Words of Support</h2>
            <p>Please donate to share words of support</p>
            {(donation.donors.length !== 0 ) ? (
              <div>
              {donation.donors.map((donor, index) => (
                <div key={index} className="mb-4">
                  <strong>{donor.name}</strong>
                  <br />
                  <em>
                    RM {donor.amount} •{" "}
                    {moment(donor.timestamp).fromNow()}
                  </em>
                  <p>{donor.comment}</p>
                </div>
              ))}
            </div>
            ) : (
              <div className="p-4">No donors yet. Be the first to make a difference</div>
            )}
            <hr />
            <p>Created {new Date(donation.createdAt).toLocaleDateString()}</p>
            <hr className="pb-5" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DonationDetails;
