import { Box, Button , useTheme } from "@mui/material";
import { tokens } from "../../theme";
//import { Formik } from "formik";
//import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
const Downloads= () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const onDownloadapk1= () => {
    const link = document.createElement("a");
    link.download = `A1033.apk`;
    link.href = "/A1033.apk";
    link.click();
  };


  const onDownloadapk2 = () => {
    const link = document.createElement("a");
    link.download = `app-debug33.apk`;
    link.href = "/app-debug33.apk";
    link.click();
  };

  return (
    <Box m="20px">
      <Header title="Downloads" subtitle="Lista de descargas" />
   

       <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
        >

          <Box display="flex" justifyContent="end" mt="20px">

              <Button onClick={onDownloadapk1} 
                  sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                  }}
                >
                 <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                  Download A1033.apk
               </Button>
          </Box>
          <Box display="flex" justifyContent="end" mt="20px">
                <Button onClick={onDownloadapk2} 
                  sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                  }}
                >
                 <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                      Download app-debug33.apk
               </Button>
          </Box>

        </Box>


    </Box>
  );
};
//<Button onClick={onDownloadapk1} color="secondary" variant="contained">
//Download  A1033.apk
//</Button>



export default Downloads;
