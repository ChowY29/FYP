import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useGetAllContactsQuery } from "state/api";
import ContactCard from "./contactCard";
import { Navigate } from "react-router-dom";

const AdminContactPage = () => {
  const { data, isLoading } = useGetAllContactsQuery();
  console.log(data);
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  if (!isLoading && !data) {
    return <Navigate to="/error" />;
  }

  if (isLoading) return <Box>Loading...</Box>;

  if (data && data.length === 0) {
    return <Box>No contacts found</Box>;
  }

  return (
    <div>
      <h1 className="text-left m-4 p-5">Contact Requests</h1>
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
          {data.map(({ _id, name, email, message, createdAt }) => (
            <ContactCard
              key={_id}
              name={name}
              email={email}
              message={message}
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

export default AdminContactPage;
