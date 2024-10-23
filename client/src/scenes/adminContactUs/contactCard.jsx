import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  useTheme,
  Modal,
} from "@mui/material";

const ContactCard = ({ name, email, message, createdAt }) => {
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <>
      <Card
        sx={{
          backgroundImage: "none",
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
          maxHeight: "200px", // Cap the height of the card
          overflow: "hidden", // Hide overflow content
          textOverflow: "ellipsis", // Add ellipsis to overflow text
          cursor: "pointer", // Change cursor to pointer on hover
          transition: "transform 0.2s", // Smooth transition for transform
          "&:hover": {
            transform: "scale(1.02)", // Slightly scale up the card on hover
            boxShadow: `0 4px 8px ${theme.palette.grey[500]}`, // Add a subtle shadow on hover
          },
        }}
        onClick={handleOpen}
      >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color={theme.palette.secondary[700]} gutterBottom>
            {name}
          </Typography>
          <Typography variant="h5" component="div">
            {email}
          </Typography>
          <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
            {new Date(createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" noWrap>
            {message}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleOpen}>
            See More
          </Button>
        </CardActions>
      </Card>
      
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            {name}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Email: {email}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Date: {new Date(createdAt).toLocaleDateString()}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Message: {message}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default ContactCard;
