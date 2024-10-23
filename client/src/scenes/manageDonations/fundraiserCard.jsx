import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  LinearProgress,
  Box,
  Button,
  Stack,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const FundraiserCard = ({ donation, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { _id, title, fundsRaised, fundsTarget, images } = donation;

  // Calculate the percentage of funds raised
  const progress = (fundsRaised / fundsTarget) * 100;

  // Get the first image from the images array, or set a default if no images are available
  const image =
    images.length > 0 ? images[0] : "https://via.placeholder.com/270x270";

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    onDelete();
    handleCloseDeleteModal();
  };

  const handleClick = (e) => {
    // Check if the click originated from the buttons
    if (e.target.tagName !== "BUTTON") {
      navigate(`/donation/${_id}`);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card
      className="card-bootstrap-style"
      sx={{
        maxWidth: 345,
        width: '100%',
        borderRadius: "16px",
        overflow: "hidden",
        margin: "17px",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="270"
        image={image}
        alt={title}
        sx={{ borderRadius: "16px 16px 0 0" }}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          className="custom-font"
          sx={{ fontFamily: 'inherit' }} // Ensure font inherits from body
        >
          {truncateText(title, 25)}
        </Typography>
        <Box sx={{ width: "100%", mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              backgroundColor: "#ccc",
              height: "6px", // Adjust the height of the LinearProgress
              borderRadius: "4px", // Adjust the border radius for rounded edges
            }}
          />
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          className="custom-font mt-2"
          sx={{ fontFamily: 'inherit', mb: 2 }} // Ensure font inherits from body
        >
          RM {fundsRaised} raised
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="warning"
            className="btn-custom-padding rounded-start-custom"
            onClick={onEdit}
            sx={{ borderRadius: "25px" }} // Adjust border radius for rounded edges
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            className="btn-custom-padding rounded-end-custom"
            onClick={handleOpenDeleteModal}
            sx={{ borderRadius: "25px" }} // Adjust border radius for rounded edges
          >
            Delete
          </Button>
        </Stack>
      </CardContent>

      {/* Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-donation-modal-title"
        aria-describedby="delete-donation-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isDeleteModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "8px",
              textAlign: "center",
              fontFamily: 'inherit', // Ensure font inherits from body
            }}
          >
            <Typography
              variant="h5"
              id="delete-donation-modal-title"
              gutterBottom
            >
              Confirm Deletion
            </Typography>
            <Typography
              variant="body1"
              id="delete-donation-modal-description"
              mb={2}
            >
              Are you sure you want to delete this donation?
            </Typography>
            <Button variant="contained" onClick={confirmDelete} color="error">
              Delete
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseDeleteModal}
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Card>
  );
};

export default FundraiserCard;
