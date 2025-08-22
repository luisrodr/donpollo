import { useState ,useEffect} from 'react';
import {  InputLabel, Select } from '@mui/material';
import { useFormik } from 'formik'
import * as yup from 'yup'
import {
   
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    
    MenuItem,
    Stack,
    TextField,
  
  
  } from '@mui/material';
 

const checkoutSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
    age:yup.number().required("required"),
    state:  yup.string("Enter state").required("is required"),
    ciudad: yup.string("Enter ciudad").required("is required")
    
  });
  
  
  
  export const CreateNewAccountModal = ({ open, onClose, onSubmit,onEdit ,ciudadData,inicialPersona,titulo}) => {
  
    const [initValues] = useState(inicialPersona);
    const [valuesstate, setValuesstate] = useState({  });
    const [valuesciudad, setValuesciudad] = useState({  });    
    
    const formik = useFormik({
      
      initialValues:initValues,
      validationSchema: checkoutSchema ,
      onSubmit: (values) => {
           
        if (values.id==="new" ){
  
            onSubmit(values);
            
            onClose();
        }else{
             console.log("formik edit============>"); 
             console.log(values); 
             onEdit(values);
               
             onClose();
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
  
      const cargaValores=(iniper)=>{
        console.log("Valores iniciales =====>");
  
        formik.setFieldValue("id", iniper.id);
        formik.setFieldValue("firstName", iniper.firstName);
        formik.setFieldValue("lastName", iniper.lastName);
        formik.setFieldValue("email", iniper.email);
        formik.setFieldValue("age", iniper.age);
        formik.setFieldValue("state", iniper.state);
        formik.setFieldValue("ciudad", iniper.ciudad.nombre);
       
        setValuesstate(iniper.state);
        setValuesciudad(iniper.ciudad.nombre);
      };
      cargaValores(inicialPersona);
  
    }, [open]);
  
  
    return (
      <>
    
        <Dialog open={open}>
  
          <DialogTitle textAlign="center">  {titulo}</DialogTitle>
          <DialogContent>
            <form onSubmit={formik.handleSubmit}>
              <Stack
                sx={{
                  marginTop: '30px' ,
                  width: '100%',
                  minWidth: { xs: '300px', sm: '360px', md: '400px' },
                  gap: '1.5rem',
                }}
              >
  
              <TextField
                fullWidth
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
                id="email"
                name="email"
                label="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              
              <TextField
                fullWidth
                id="age"
                name="age"
                label="age"
                value={formik.values.age}
                onChange={formik.handleChange}
                error={formik.touched.age && Boolean(formik.errors.age)}
                helperText={formik.touched.age && formik.errors.age}
              />
                <InputLabel id="demo-simple-select-label">State</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue={valuesstate}
                  value={valuesstate || ''}
                  label="state"
                  onChange={handleChange}
                  required 
               
                >
                     {ciudadData.map(ciudad => (
                      <MenuItem key={ciudad.id} value={ciudad.nombre}>
                        {ciudad.nombre}
                      </MenuItem>
                    ))}
  
                </Select>
                
                
               {/*
                <InputLabel id="demo-simple-select-labelciudads">Ciudads</InputLabel>
                <Select
                  labelId="demo-simple-select-labelciudads"
                  id="demo-simple-selectciudads"
                  defaultValue={valuesciudad}
                  value={valuesciudad || ''}
                  label="ciudad"
                  onChange={handleChangeCiudad}
                  required
                  
  
                >
                     {ciudadData.map(ciudad => (
                      <MenuItem key={ciudad.id} value={ciudad.nombre}>
                        {ciudad.nombre}
                      </MenuItem>
                    ))}
  
                </Select>
                */}
                {/* formik.touched.ciudad && <h1>{formik.errors.ciudad}</h1>*/}
                  <TextField
                    id="standard-select-ciudad0"
                    select
                    label="Select"
                    value={valuesciudad}
                    onChange={handleChangeCiudad("ciudad")}
                    error={formik.touched.ciudad && Boolean(formik.errors.ciudad)}
                    helperText={formik.touched.ciudad && formik.errors.ciudad}
                    margin="normal"
                  >
                    {ciudadData.map(option => (
                      <MenuItem key={option.id} value={option.nombre}>
                          {option.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                   
              </Stack>
  
              <DialogActions sx={{ p: '1.25rem' }}>
                <Button color="secondary" onClick={onClose}>Cancel</Button>
                <Button color="primary" type="submit" variant="contained">
                  Submit
                </Button>
            </DialogActions>
            </form>
           </DialogContent>
        </Dialog>
      </>
    );
  };
  
  
  export default CreateNewAccountModal;
  