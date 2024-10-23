import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import ToastComponent from './ToastComponent';
import { useChangePasswordMutation } from '../state/api'; // Adjust path as per your project structure
import useAuth from 'hooks/useAuth';

const ChangePasswordModal = ({ show, handleClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false); // State for success toast

  const [changePasswordMutation, { isLoading, isError, isSuccess }] = useChangePasswordMutation();

  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };

  const userId = useAuth().userId;

  const handleChangePassword = async () => {
    setError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (oldPassword === newPassword) {
      setError('New password cannot be the same as the old password.');
      return;
    }
    
    if (!validatePassword(newPassword)) {
      setError(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await changePasswordMutation({ userId, oldPassword, newPassword });
      setShowSuccessToast(true); // Show success toast
      console.log('Password changed successfully');
      handleClose();
    } catch (error) {
      setError('Failed to change password. Please try again later.');
      console.error('Change password error:', error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formOldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleChangePassword} disabled={isLoading}>
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastComponent
        message={error}
        type="danger"
        show={Boolean(error)}
        setShow={setError}
      />
      <ToastComponent
        message="Password changed successfully"
        type="success"
        show={showSuccessToast}
        setShow={setShowSuccessToast}
      />
    </>
  );
};

export default ChangePasswordModal;
