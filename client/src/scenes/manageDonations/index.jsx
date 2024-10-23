import React from "react";
import {
  CircularProgress,
  Box,
  Modal,
  Backdrop,
  Fade,
  Typography,
} from "@mui/material";
import FundraiserCard from "./fundraiserCard";
import {
  useGetAllDonationsQuery,
  useDeleteDonationMutation,
  useEditDonationMutation,
} from "../../state/api";
import ToastComponent from "componenets/ToastComponent";
import EditDonationModal from "./editDonationModal";

const LoadingSpinner = () => (
  <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
    <CircularProgress />
  </div>
);

const ManageDonations = () => {
  const { data, error, isLoading, refetch } = useGetAllDonationsQuery();
  const [deleteDonation] = useDeleteDonationMutation();
  const [editDonation] = useEditDonationMutation(); // Use the edit mutation hook

  const [selectedDonation, setSelectedDonation] = React.useState(null);
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const [loadingToast, setLoadingToast] = React.useState(false);

  const handleEdit = (donation) => {
    setSelectedDonation(donation);
    console.log("Donation from main index:", donation);
  };

  const handleDelete = async (donation) => {
    setLoadingToast(true);
  
    try {
      const response = await deleteDonation(donation._id);
      if (response.error) {
        throw new Error(response.error.message);
      }
  
      await refetch(); // Refresh donation list after delete
  
      setToastMessage("Donation deleted successfully.");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting donation:", error);
      setToastMessage("Error deleting donation. Please try again later.");
      setShowToast(true);
    } finally {
      setLoadingToast(false);
      setSelectedDonation(null); // Clear selected donation after delete
    }
  };
  


  const handleEditSubmit = async (updatedDonationData) => {
    setSelectedDonation(null);
    setLoadingToast(true);

    try {
      // Perform update mutation
      const response = await editDonation(updatedDonationData); // Use the edit mutation function
      if (response.error) {
        throw new Error(response.error.message);
      }

      await refetch(); // Refresh donation list after update

      setToastMessage("Donation updated successfully.");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating donation:", error.message);
      setToastMessage("Error updating donation. Please try again later.");
      setShowToast(true);
    } finally {
      setLoadingToast(false);
    }
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="manage-donations">
      {/* Toast Component */}
      <ToastComponent
        message={toastMessage}
        type={error ? "danger" : "success"}
        show={showToast}
        setShow={setShowToast}
        loading={loadingToast}
      />

      <div className="container">
        <h1 className="text-left m-4">Manage Donations</h1>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="row justify-content-center">
            {data.map((donation) => (
              <Box
                key={donation._id}
                sx={{
                  flex: "1 1 calc(25% - 30px)",
                  boxSizing: "border-box",
                  margin: "15px",
                }}
              >
                <FundraiserCard
                  donation={donation}
                  onEdit={() => handleEdit(donation)}
                  onDelete={() => handleDelete(donation)} // Set selectedDonation for delete modal
                />
              </Box>
            ))}
          </div>
        )}
      </div>

      {/* Edit Donation Modal */}
      <EditDonationModal
        open={!!selectedDonation}
        donation={selectedDonation}
        onClose={() => setSelectedDonation(null)}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default ManageDonations;
