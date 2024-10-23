import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import image from "assets/about1.jpg";
import AltNavbar from "componenets/altNavbar";

const LoadingSpinner = () => (
  <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
    <CircularProgress />
  </div>
);

const AboutUsPage = () => {
  // Simulated data for the about us section
  const aboutData = {
    title: "Who Are We?",
    description:
      "At Impact Fund, we are dedicated to harnessing the power of technology and fostering community engagement to tackle pressing environmental challenges and advance Sustainable Development Goals (SDGs). Our mission is to merge cutting-edge innovation with sustainable practices, fostering a profound and enduring impact on our planet.",
    features: [
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            className="bi bi-gear-fill"
            viewBox="0 0 16 16"
          >
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
          </svg>
        ),
        title: "Versatile Brand",
        description:
          "We are crafting a digital method that subsists life across all mediums.",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            className="bi bi-fire"
            viewBox="0 0 16 16"
          >
            <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z" />
          </svg>
        ),
        title: "Digital Agency",
        description:
          "We believe in innovation by merging primary with elaborate ideas.",
      },
    ],
  };

  return (
    <div>
      <AltNavbar />
      <section className="py-3 py-md-5">
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={6} xl={5}>
              <img
                className="img-fluid rounded"
                loading="lazy"
                src={image}
                alt="About 1"
                style={{ width: "75%" }} // Adjust image size to 75%
              />
            </Grid>
            <Grid item xs={12} lg={6} xl={7}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <h2 className="mb-3">{aboutData.title}</h2>
                  <p className="lead fs-4 text-secondary mb-3">
                    {aboutData.description}
                  </p>
                </Grid>
                {aboutData.features.map((feature, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card>
                      <CardContent>
                        <div style={{ display: "flex" }}>
                          <div className="me-4 text-primary">
                            {feature.icon}
                          </div>
                          <div>
                            <h2 className="h4 mb-3">{feature.title}</h2>
                            <p className="text-secondary mb-0">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </section>
    </div>
  );
};

export default AboutUsPage;
