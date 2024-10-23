import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useGetFeedbackQuery } from "state/api";
import FeedbackCard from "./feedbackCard";
import { Navigate } from "react-router-dom";


const AdminFeedbackPage = () => {
  const { data, isLoading } = useGetFeedbackQuery();
  console.log(data);
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  if (!isLoading && !data) {
    Navigate("/error");
  }

  if (isLoading) return <Box>Loading...</Box>;

  if (data && data.length === 0){
    return <Box>No feedback found</Box>;
  }

  return (
    <div>
      <h1 className="text-left m-4 p-5">User Feedback</h1>
    
    <Box m="1.5rem 2.5rem">
      {data || !isLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {data.map(({ _id, userId, rating, feedback, createdAt }) => (
            <FeedbackCard
              key={_id}
              userId={userId}
              rating={rating}
              feedback={feedback}
              createdAt={createdAt}
            />
          ))}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
    </div>
  );
};

export default AdminFeedbackPage;
