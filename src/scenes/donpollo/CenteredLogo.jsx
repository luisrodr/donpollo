import React from "react";
import { Container, Box, useTheme, useMediaQuery } from "@mui/material";

const CenteredLogo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // true si <600px

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: isMobile ? "10px" : "20px",
      }}
    >
      <Box
        component="img"
        src={`../../logodonpollo.png`}
        alt="Logo"
        sx={{
          width: isMobile ? 120 : 250, // más chico en mobile
          height: "auto",
        }}
      />
    </Container>
  );
};

export default CenteredLogo;
