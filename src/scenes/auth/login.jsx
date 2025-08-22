import { useCallback, useState,useContext,useRef } from 'react';
import axios from "axios";
//import Head from 'next/head';
//import NextLink from 'next/link';
//import { useRouter } from 'next/navigation';
import { useNavigate } from "react-router-dom";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Box,
  Button,
  FormHelperText,

  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';

//import { useAuth } from '../../hooks/use-auth';
//import { Layout as AuthLayout } from '../../layouts/auth/layout';
import { Logo } from '../../components/logo';
import { AuthContext } from '../../mycontext';

//import Layout from "../../layouts/auth/layout";
//  'http://localhost:1337/api/auth/local'
//https://cozy-desk-d67daf35b9.strapiapp.com

const URL_BASE=process.env.REACT_APP_URL_BASE;
const API_AUTH=process.env.REACT_APP_API_AUTH;

const Login = () => {
   const refSiguiente = useRef();
   const navigate = useNavigate();
  //const router = useRouter();
  //const auth = useAuth();
 

  const { login} = useContext(AuthContext);

 

  const [method, setMethod] = useState('email');
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values) => {

         refSiguiente.current.setAttribute("disabled", true)
         console.log(values);

         axios
        .post(`${URL_BASE}${API_AUTH}`, {
          identifier: values.email,
          password: values.password
        })
        .then(response => {
          console.log('User profile', response.data.user);
          console.log('User token', response.data.jwt);
          // login(response.data.user.username);
          login({user:{id:response.data.user.id,
                        username:response.data.user.username,
                        password: values.password,
                        token:response.data.jwt}});
          formik.resetForm();      
          navigate("/");                
        })
        .catch(error => {
          console.log('An error occurred:', error.response);

        });

        refSiguiente.current.removeAttribute("disabled")

       

    }
  });

  const handleMethodChange = useCallback(
    (event, value) => {
      setMethod(value);
    },
    []
  );


  /*
  const handleSkip = useCallback(
    () => {
      auth.skip();
      router.push('/');
    },
    [auth, router]
  );
   */
/*
  const myhandleSkip = () => {
    setIsLogin(true);
     
  };
   
*/
  return (
    <>
      {/*
      <Head>
        <title>
          Login | Devias Kit
        </title>
      </Head>
      */}
     
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Box
              
              href="/"
              sx={{
                display: 'inline-flex',
                height: 32,
                width: 32
              }}
            >
              {/* <Logo /> */}
            </Box>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Login
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                {/* 
                Don&apos;t have an account?
                &nbsp;
                
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
                */}
              </Typography>
            </Stack>
            <Tabs
              onChange={handleMethodChange}
              sx={{ mb: 3 }}
              value={method}
            >
              <Tab
                label="Email"
                value="email"
              />
              {/* <Tab
                label="Phone Number"
                value="phoneNumber"
              /> */}
            </Tabs>
            {method === 'email' && (
              <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
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
                {/* <FormHelperText sx={{ mt: 1 }}>
                       Opcionalmente puedes continuar
                </FormHelperText>  */}
                {formik.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
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
                {/* 
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  onClick={handleSkip}
                >
                  Skip authentication
                </Button>
                */}
                {/* <Alert
                  color="primary"
                  severity="info"
                  sx={{ mt: 3 }}
                >
                  <div>
                  
                       Puede usar <b>ipdp@donpollo.cl</b> y password <b>123456!</b> 
                  
                  </div>
                </Alert> */}
              </form>
            )}
            {method === 'phoneNumber' && (
              <div>
                <Typography
                  sx={{ mb: 1 }}
                  variant="h6"
                >
                 no disponible
                </Typography>
                <Typography color="text.secondary">
                  To prevent unnecessary costs we disabled this feature 
                </Typography>
              </div>
            )}
          </div>
        </Box>
        
      </Box>
      
    </>
  );
};




export default Login;
