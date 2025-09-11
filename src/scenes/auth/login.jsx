import { useCallback, useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { AuthContext } from "../../mycontext";

const URL_BASE = process.env.REACT_APP_URL_BASE;
const API_AUTH = process.env.REACT_APP_API_AUTH;

const Login = () => {
  const refSiguiente = useRef();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // true si <600px

  const [method, setMethod] = useState("email");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values) => {
      refSiguiente.current.setAttribute("disabled", true);

      axios
        .post(`${URL_BASE}${API_AUTH}`, {
          identifier: values.email,
          password: values.password,
        })
        .then((response) => {
          login({
            user: {
              id: response.data.user.id,
              username: response.data.user.username,
              password: values.password,
              token: response.data.jwt,
            },
          });
          formik.resetForm();
          if (isMobile) {
               navigate('/ip'); // 👈 va directo a /ip en mobile
          }  else{
               navigate("/");
          }
          
        })
        .catch((error) => {
          console.log("An error occurred:", error.response);
        });

      refSiguiente.current.removeAttribute("disabled");
    },
  });

  const handleMethodChange = useCallback((event, value) => {
    setMethod(value);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        flex: "1 1 auto",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        px: isMobile ? 2 : 4,
      }}
    >
      <Box
        sx={{
          maxWidth: isMobile ? "100%" : 550,
          px: isMobile ? 2 : 3,
          py: isMobile ? 4 : "100px",
          width: "100%",
        }}
      >
        <div>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant={isMobile ? "h5" : "h4"}>Login</Typography>
            <Typography color="text.secondary" variant="body2">
              Ingresa tus credenciales para continuar
            </Typography>
          </Stack>
          <Tabs
            onChange={handleMethodChange}
            sx={{ mb: 3 }}
            value={method}
            variant={isMobile ? "fullWidth" : "standard"}
          >
            <Tab label="Email" value="email" />
          </Tabs>
          {method === "email" && (
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>

              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}

              <Button
                ref={refSiguiente}
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Continue
              </Button>
            </form>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default Login;
