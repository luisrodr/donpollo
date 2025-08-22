import React from "react";
import { Container, Box } from "@mui/material";

const CenteredLogo = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        component="img"
        
        src={`../../logodonpollo.png`}
        alt="Logo"
        //sx={{ width: 150, height: 150 }}
      />
    </Container>
  );
};

export default CenteredLogo;
