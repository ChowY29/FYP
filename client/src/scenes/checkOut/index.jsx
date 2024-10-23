import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Container, Row, Col, Form, Button, OverlayTrigger, Tooltip, Card, Alert } from 'react-bootstrap';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  useCreatePaymentIntentMutation,
  useGetUserInfoQuery,
  useAddDonorToDonationMutation,
  useLogTransactionMutation,
} from '../../state/api';
import AltNavbar from 'componenets/altNavbar';
import useAuth from 'hooks/useAuth';

const CheckOut = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const donation = location.state?.donation;
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const { role, userId } = useAuth();
  const { data: userInfo, error: userInfoError, isLoading } = useGetUserInfoQuery(undefined, { skip: !role });
  const [addDonorToDonationMutation] = useAddDonorToDonationMutation();
  const [logTransactionMutation] = useLogTransactionMutation();
  const [anonymousDonation, setAnonymousDonation] = useState(false); // State to manage anonymous donation checkbox

  // Handle missing donation data
  if (!donation) {
    navigate('/landingPage');
    return <div>Error loading donation details. Please try again.</div>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await createPaymentIntent({ amount, comment });

      if (error || !data || !data.clientSecret) {
        throw new Error('Failed to retrieve client secret.');
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);

        // Log transaction on unsuccessful payment
        await logTransactionMutation({
          userId,
          userEmail: userInfo?.email || '',
          action: `Failed donation attempt to ${donation.title}`,
          amount,
          success: false,
        });

      } else if (result.paymentIntent.status === 'succeeded') {
        // Prepare donor data to send to backend
        const donorData = {
          userId: userId,
          donationId: donation._id,
          name: anonymousDonation ? 'Anonymous' : `${userInfo?.firstName} ${userInfo?.lastName}`,
          email: userInfo?.email,
          amount,
          timestamp: new Date(),
          comment,
        };

        // Call mutation to add donor to donation
        const { data: addedDonorData, error: addDonorError } = await addDonorToDonationMutation(donorData);

        if (addDonorError) {
          throw new Error('Failed to add donor to donation.');
        }

        // Log transaction after successful payment
        await logTransactionMutation({
          userId,
          userEmail: userInfo?.email || '',
          action: `Donation made to ${donation.title}`,
          amount,
          success: true,
        });

        alert('Payment Successful!');
        
        // Redirect user back to the previous page
        navigate(`/donation/${id}`);

      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousDonationChange = () => {
    setAnonymousDonation(!anonymousDonation); // Toggle anonymous donation checkbox
  };

  const firstImage = donation.images.length > 0 ? donation.images[0] : null;

  return (
    <div>
      <AltNavbar />
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md={8} lg={6}>
            <Card>
              <Card.Body>
                <Card.Title className="text-center mb-4">Donation to {donation.title}</Card.Title>
                {firstImage && (
                  <div className="text-center">
                    <img
                      src={firstImage}
                      alt={donation.title}
                      className="img-fluid mb-3"
                    />
                  </div>
                )}
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formAmount" className="mb-3">
                    <Form.Label>Enter your donation</Form.Label>
                    <Form.Control
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="Enter amount"
                    />
                  </Form.Group>
                  <Form.Group controlId="formCard" className="mb-3">
                    <Form.Label>Payment method</Form.Label>
                    <div className="form-control">
                      <CardElement />
                    </div>
                  </Form.Group>
                  <Form.Group controlId="formComment" className="mb-3">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment (optional)"
                    />
                  </Form.Group>
                  <Form.Group controlId="formAnonymous" className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label={
                        <span>
                          Donate Anonymously{' '}
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-anonymous">Your identity will not be exposed.</Tooltip>}
                          >
                            <i className="bi bi-info-circle"></i>
                          </OverlayTrigger>
                        </span>
                      }
                      checked={anonymousDonation}
                      onChange={handleAnonymousDonationChange}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={!stripe || loading} className="w-100">
                    {loading ? 'Processing...' : 'Donate'}
                  </Button>
                  {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CheckOut;