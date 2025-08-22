import { useState ,useEffect} from 'react';
import { Box } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';

import { useFormik } from 'formik'
import * as yup from 'yup'
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
   Typography
  
  } from '@mui/material';

  import Grid from '@mui/material/Grid';
  import FileUpload from "react-material-file-upload";

  const checkoutSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
    age:yup.number().min(10).max(70).required("required"),
    state:  yup.string("Enter state").required("is required"),
    ciudad: yup.string("Enter ciudad").required("is required")
    
  });
  
  
  
  export const CreateNewAccountModalB =({ open, onClose, onSubmit,onEdit ,ciudadData,inicialPersona,titulo}) => {
    const [errorPrueba, setErrorPrueba] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [initValues] = useState(inicialPersona);
    const [valuesstate, setValuesstate] = useState({  });
    const [valuesciudad, setValuesciudad] = useState({  });  
    const [upLoading,setUpLoading]  = useState(false);
    const [urlImagen, setUrlImagen] = useState('');   
    const [files, setFiles] = useState([]);

    const formik = useFormik({
      
      initialValues:initValues,
      validationSchema: checkoutSchema ,
      onSubmit: async (values) => {

      const cloudUrl=process.env.REACT_APP_URL_IMG;

      const formData=new FormData();
      formData.append('upload_preset','react-faster');
      formData.append('file',files[0]);

           
        if (values.id==="new" ){

            console.log("el seleccionado ============>",files[0]);
 
//////////////////////////////////////////////

            if (files.length>0){
              try {

                  setUpLoading(true);
                  const resp=await fetch(cloudUrl,{
                        method:'POST',
                        body:formData      
                  });

                  if (resp.ok){
                      const cloudResp=await resp.json();
                        
                      console.log("la respuesta de claudinary",cloudResp.secure_url);

                      values.urlimagen=cloudResp.secure_url;
                      console.log("values antes de grabar",values);

                      //////////////submit 
                      onSubmit(values);
                      onClose();
                      /////////////// 
                      setUpLoading(false);

          
                      //return cloudResp.secure_url;
                  }else{
                    //para test 
                    setErrorPrueba(true);
                    setErrorText(JSON.stringify(resp));

                    setUpLoading(false);
                    return null; 
                    // throw await resp.json();
                  };
                  
              } catch (error) {
                  setUpLoading(false);
                  setErrorPrueba(true);
                  setErrorText(JSON.stringify(error));
                  throw error;
              }
            }else{
                //////////////submit 
                onSubmit(values);
                onClose();
                /////////////// 
                
            };  
/////////////////////////////////////////////

        }else{

//////////////////////////////////////////////
            // hay archivo quiere cambiar el archivo
            if (files.length>0){
              
              console.log("contiene archivo: quiere cambiar el archivo");
              

              try {
                  setUpLoading(true);
                  const resp=await fetch(cloudUrl,{
                        method:'POST',
                        body:formData      
                  });

                  if (resp.ok){
                      const cloudResp=await resp.json();
                        
                      console.log("la respuesta de claudinary",cloudResp.secure_url);

                      values.urlimagen=cloudResp.secure_url;
                      console.log("values antes de grabar",values);

                      //////////////submit 
                      console.log("formik edit============>"); 
                      console.log(values); 
                      onEdit(values);
                      onClose();
                      setUpLoading(false);
                      
                      /////////////// 


                      //return cloudResp.secure_url;
                  }else{
                    setUpLoading(false);
                    setErrorPrueba(true);
                    setErrorText(JSON.stringify(resp))
                    //para test 
                    return null; 
                    // throw await resp.json();
                  };
                  
              } catch (error) {
                  setUpLoading(false);
                  setErrorPrueba(true);
                  setErrorText(JSON.stringify(error));
                  throw error;
              }
              

            }else{
              console.log("no contiene archivo , no modifica url ");
              onEdit(values);
              onClose();
            };  
            
/////////////////////////////////////////////
          }  
     
        formik.resetForm();
  
  
      },
    });
  
  
    const handleChange = ( event) => {
      event.preventDefault();
  
      const vnombre=event.target.value;
      console.log(vnombre);
     
      setValuesstate(vnombre);
      
      formik.setFieldValue("state", vnombre);
      
    };
    
    const handleChangeCiudad = name => event => {
      console.log(name);
      const vnombre=event.target.value;
      //console.log(vnombre);
      console.log(event);
    
      setValuesciudad(vnombre);
      
      formik.setFieldValue("ciudad", vnombre);;
      
    };


    useEffect(() => {
      console.log("Valores iniciales =====>");
  
      formik.setFieldValue("id", inicialPersona.id);
      formik.setFieldValue("firstName",inicialPersona.firstName);
      formik.setFieldValue("lastName", inicialPersona.lastName);
      formik.setFieldValue("email", inicialPersona.email);
      formik.setFieldValue("age", inicialPersona.age);
      formik.setFieldValue("state", inicialPersona.state);
      formik.setFieldValue("ciudad", inicialPersona.ciudad.nombre);
      formik.setFieldValue("urlimagen", inicialPersona.urlimagen);

      setValuesstate(inicialPersona.state);
      setValuesciudad(inicialPersona.ciudad.nombre);
      setUrlImagen(inicialPersona.urlimagen);
      setFiles([]);
      setErrorPrueba(false);
    
    }, [open]);// eslint-disable-line react-hooks/exhaustive-deps
  
  
    return (
      <>
        
        <Dialog open={open} maxWidth="md" >
          
          <DialogTitle textAlign="center" > 
         
                 <div style={{ display: 'flex' }}>
                    <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                         {titulo}
                    </Typography>

                </div>
                { upLoading && <LinearProgress/>}
                {  errorPrueba   &&
                  <Alert onClose={() => setErrorPrueba(false)} variant="outlined" severity="error">
                      {errorText} This is an error alert — check it out!
                  </Alert>
                }  
          </DialogTitle>
           <DialogContent dividers >
            <form onSubmit={formik.handleSubmit}>
                 <Grid  container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                   <Grid item xs={6}>
                        <TextField
                         
                          fullWidth
                          margin="normal" 
                          id="firstName"
                          name="firstName"
                          label="firstName"
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                          helperText={formik.touched.firstName&& formik.errors.firstName}
                        />
                    
                      <TextField
                        fullWidth
                        margin="normal" 
                        id="lastName"
                        name="lastName"
                        label="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                      />
          
                      <TextField
                        fullWidth
                        margin="normal" 
                        id="email"
                        name="email"
                        label="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                      />

                      <Box display="flex" justifyContent="center" alignItems="center">
                        <img
                          alt="img"
                          width="100px"
                          height="100px"
                          src={`${urlImagen}`}
                          style={{ cursor: "pointer",borderRadius: "50%" }}
                        />
                        {/*style={{ cursor: "pointer", borderRadius: "50%" }}*/}
                    </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        margin="normal" 
                        type="number"
                        id="age"
                        name="age"
                        label="age"
                        value={formik.values.age}
                        onChange={formik.handleChange}
                        error={formik.touched.age && Boolean(formik.errors.age)}
                        helperText={formik.touched.age && formik.errors.age}
                      />

                      <TextField
                        fullWidth
                        margin="normal" 
                        id="standard-select-state"
                        select
                        label="state"
                        value={valuesstate}
                        onChange={handleChange}
                        error={formik.touched.state && Boolean(formik.errors.state)}
                        helperText={formik.touched.state && formik.errors.state}
                        
                      >
                        {ciudadData.map(option => (
                          <MenuItem key={option.id} value={option.nombre}>
                              {option.nombre}
                          </MenuItem>
                        ))}
                      </TextField>
                      
                      <TextField
                        fullWidth
                        margin="normal" 
                        id="standard-select-ciudad0"
                        select
                        label="ciudad"
                        value={valuesciudad}
                        onChange={handleChangeCiudad("ciudad")}
                        error={formik.touched.ciudad && Boolean(formik.errors.ciudad)}
                        helperText={formik.touched.ciudad && formik.errors.ciudad}
                        
                      >
                        {ciudadData.map(option => (
                          <MenuItem key={option.id} value={option.nombre}>
                              {option.nombre}
                          </MenuItem>
                        ))}
                      </TextField>
                      {/*https://codesandbox.io/s/strapi-react-file-upload-gbyt3?file=/src/FileUploads.js*/ }
                      
                      <FileUpload
                       accept="image/*"
                       label="ciudad"
                       value={files} 
                       onChange={setFiles} />


                      </Grid>
        
                      
                      <DialogActions sx={{ p: '1.25rem' }}>
                        <Button color="secondary" onClick={onClose}>Cancel</Button>
                        <Button color="primary" type="submit" variant="contained">
                          Submit
                        </Button>
                       </DialogActions>
                  </Grid>
                </form>
           </DialogContent>
        </Dialog>
      </>
    );
  };
  
  
  export default CreateNewAccountModalB;
  