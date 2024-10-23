import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBTextArea } from 'mdb-react-ui-kit';
import AltNavbar from 'componenets/altNavbar';
import { useAddContactMutation } from '../../state/api'; // Import the appropriate mutation hook
import ToastComponent from 'componenets/ToastComponent';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addContact] = useAddContactMutation();

  // State for toast
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!name || !email || !message) {
      setToastMessage('Please fill in all fields.');
      setToastType('danger');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      // Call your API endpoint to save contact information
      const { data } = await addContact({ name, email, message }).unwrap();

      // Handle success response
      setToastMessage('Submission successful!');
      setToastType('success');
      setShowToast(true);

      // Optionally, reset form fields after successful submission
      setName('');
      setEmail('');
      setMessage('');
      setError(null); // Clear any previous errors
    } catch (error) {
      setToastMessage(`Error submitting contact form: ${error.message}`);
      setToastType('danger');
      setShowToast(true);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <AltNavbar />
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol md="6">
            <h2 className="text-center mb-4">Contact Us</h2>
            <form onSubmit={handleSubmit}>
              <MDBInput
                wrapperClass="mb-4"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="lg"
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
              />
              <MDBTextArea
                wrapperClass="mb-4"
                label="Message"
                type="textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                size="lg"
                maxLength={200}
              />
              <MDBBtn
                className="mb-4 w-100"
                color="warning"
                size="lg"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </MDBBtn>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <ToastComponent
        message={toastMessage}
        type={toastType}
        show={showToast}
        setShow={setShowToast}
      />
    </div>
  );
};

export default ContactUs;
