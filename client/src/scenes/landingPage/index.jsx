import React from "react";
import { CircularProgress } from "@mui/material";
import backgroundImage from "assets/panel-background.png";
import Navbar from "componenets/navbar";
import FundraiserCard from "./fundraiserCard";
import { useGetAllDonationsQuery } from "../../state/api";

const LoadingSpinner = () => (
  <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
    <CircularProgress />
  </div>
);

const LandingPage = () => {
  const { data, error, isLoading } = useGetAllDonationsQuery();

  React.useEffect(() => {
  }, [data]);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="landing-page">
      <div style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Navbar />
        <h1 className="font-paytone-one text-center fs-0">
          Empowering Communities, Changing Lives
        </h1>
        <h2 className="lead text-center font-montserrat pt-4">
        Join us in our mission to create a world where everyone has the opportunity to thrive.
        <br></br>
         Support transformative projects that make a lasting difference.
        </h2>
        <br></br>
        <br></br>
        <br></br>
      </div>
      <div className="container">
        <h3 className="text-left m-4">Discover ongoing fundraisers</h3>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="row justify-content-center">
            {data.map((donation) => (
              <div key={donation._id} className="col-md-4">
                <FundraiserCard donation={donation} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
