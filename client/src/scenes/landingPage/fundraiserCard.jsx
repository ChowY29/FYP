import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  LinearProgress,
  Box,
  Stack,
  Button,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const FundraiserCard = ({ donation }) => {
  const { _id, title, fundsRaised, fundsTarget, images } = donation;
  const navigate = useNavigate();

  // Calculate the percentage of funds raised
  const progress = (fundsRaised / fundsTarget) * 100;

  // Get the first image from the images array, or set a default if no images are available
  const image =
    images.length > 0 ? images[0] : "https://via.placeholder.com/270x270";

  // Handle card click
  const handleClick = () => {
    navigate(`/donation/${_id}`);
  };

  // Helper function to truncate text
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
        <Box sx={{ width: "100%" }}>
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
          sx={{ fontFamily: 'inherit' }} // Ensure font inherits from body
        >
          RM {fundsRaised} raised
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FundraiserCard;
