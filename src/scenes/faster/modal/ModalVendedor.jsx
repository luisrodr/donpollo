import { useState ,useEffect} from 'react';
import { useFormik } from 'formik'



import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import * as yup from 'yup'
import {
    Alert,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FilledInput,
    FormControlLabel,
    IconButton ,
    InputAdornment,
    Stack,
    TextField,
    Typography
  
  } from '@mui/material';
  import { onlyNumbers } from '../helpers/funcYup';
  import {esUnicoYup,existeCodigoYup} from '../helpers/funcYup';

  yup.addMethod(yup.string, "solonum", function (errorMessage) {
    return this.test(`test-codigo solo num`, errorMessage, function (value) {
      const { path, createError } = this;
  
      return (
        (value && onlyNumbers(value)) ||
        createError({ path, message: errorMessage })
      );
    });
  });

  
  export const ModalVendedor =({ open,
     onClose,
      onSubmit,
      onEdit,
      inicial,
      tableData,
      titulomod,
      deshabilitado}) => {
    const [checkedlinea, setCheckedLinea] = useState(false);
    const [checkedTotal, setCheckedTotal] = useState(false);
    const [showPassword, setShowPassword] =useState(false);
    const [errorPrueba, setErrorPrueba] = useState(false);
    const [errorText,setErrorText] = useState("");
    const [initValues] = useState(inicial);
    const [valueIdyup,setValueIdyup] = useState('');  
      yup.addMethod(yup.string, "newexiste", function (errorMessage) {
          
        return this.test(`test-codigo existe`, errorMessage, function (value) {
          const { path, createError } = this;

              return (
                
                  (value && !existeCodigoYup(value,valueIdyup,tableData)) || createError({ path, message: errorMessage })
            
              );
        
        });
      
    });    

    yup.addMethod(yup.string, "modexiste", function (errorMessage) {

        return this.test(`test-codigo existe`, errorMessage, function (value) {
          const { path, createError } = this;
        
          
            return (
              (value && !esUnicoYup(tableData,value,valueIdyup.id)) ||
              createError({ path, message: errorMessage })
            );
          
        });
    
    });  

    const checkoutSchema = yup.object().shape({
      codigo: yup.string()
      .solonum("solo numeros")
      .required("required")
      .length(2)
      .newexiste("New ya existe" ).modexiste("Mod ya existe"),
      descripcion: yup.string().required("required"),
      clave: yup.string().required("required"),
      comision:yup.number().min(1).max(10).required("required"),
     
     });
    const formik = useFormik({
      
      initialValues:initValues,
      validationSchema: checkoutSchema ,
      onSubmit: async (values) => {
        if (values.id==="new" ){

            onSubmit(values);
            onClose();
            /////////////// 
           
        }else{

            //////////////submit 
            console.log("formik edit============>"); 
            console.log(values); 
            onEdit(values);
            onClose();
            
            /////////////// 

        }

        formik.resetForm();
 
      },
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleChangeCheckLinea = (event) => {
      const valor=event.target.checked;

      setCheckedLinea(valor);

      console.log("descuento linea ",valor);
      formik.setFieldValue("descuentolinea",valor);
    };

    const handleChangeCheckTotal = (event) => {
      const valor=event.target.checked;

      setCheckedTotal(valor);

      console.log("descuento total ",valor);
      formik.setFieldValue("descuentototal",valor);
    };

    const handleCodigoChange = (event) => {
      formik.handleChange(event);

      console.log(event.target.value);
      
      if(valueIdyup.id === "new"){
           console.log("validando");

          if (event.target.value.length === 3 && existeCodigoYup(event.target.value,valueIdyup,tableData)){
            setErrorPrueba(true);
            setErrorText(`Ya existe ${event.target.value}`);
          }else{
            setErrorPrueba(false);
            
          }
         
      }

    };
    useEffect(() => {
      console.log("Valores iniciales =====>",inicial);
  
      formik.setFieldValue("id", inicial.id);
      formik.setFieldValue("codigo", inicial.codigo);
      formik.setFieldValue("descripcion",inicial.descripcion);
      formik.setFieldValue("clave",inicial.clave);
      formik.setFieldValue("descuentolinea",inicial.descuentolinea);
      formik.setFieldValue("descuentototal",inicial.descuentototal);
      formik.setFieldValue("comision",inicial.comision);

      setCheckedLinea(inicial.descuentolinea);
      setCheckedTotal(inicial.descuentototal);

      setErrorPrueba(false);
      setValueIdyup(inicial); 
    
    }, [open]);// eslint-disable-line react-hooks/exhaustive-deps
   
    return (
      <>
        
        <Dialog open={open} maxWidth="md" >
          
          <DialogTitle textAlign="center" > 
         
                 <div style={{ display: 'flex' }}>
                    <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                         {titulomod}
                    </Typography>

                </div>
        
                {  errorPrueba   &&
                  <Alert onClose={() => setErrorPrueba(false)} variant="outlined" severity="error">
                         {errorText} alerta — revisar!
                  </Alert>
                }  
          </DialogTitle>
           <DialogContent dividers >
            <form onSubmit={formik.handleSubmit}>
                      <Stack
                      sx={{
                        width: '100%',
                        minWidth: { xs: '300px', sm: '360px', md: '400px' },
                        gap: '1.5rem',
                      }}
                      >
                      <TextField
                        disabled={deshabilitado}
                        fullWidth
                        margin="normal" 
                        id="codigo"
                        name="codigo"
                        label="codigo"
                        autoComplete='off'
                        value={formik.values.codigo}
                        onChange={handleCodigoChange}
                        error={formik.touched.codigo && Boolean(formik.errors.codigo)}
                        helperText={formik.touched.codigo&& formik.errors.codigo}
                      />

                      <TextField
                        fullWidth
                        margin="normal" 
                        id="descripcion"
                        name="descripcion"
                        label="descripcion"
                        autoComplete='off'
                        value={formik.values.descripcion}
                        onChange={formik.handleChange}
                        error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                        helperText={formik.touched.descripcion && formik.errors.descripcion}
                      />

                      <FilledInput
                        id="filled-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        name="clave"
                        placeholder='password'
                        label="Password"
                        autoComplete='off'
                        value={formik.values.clave}
                        onChange={formik.handleChange}
                        error={formik.touched.clave && Boolean(formik.errors.clave)}
                       
                        
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormControlLabel
                            control={
                                    <Checkbox 
                                        checked={checkedlinea}
                                        onChange={handleChangeCheckLinea}
                                        color="primary"
                                  />
                            }
                      label="Descuento linea"/>
                      <FormControlLabel
                            control={
                                    <Checkbox 
                                        checked={checkedTotal}
                                        onChange={handleChangeCheckTotal}
                                        color="primary"
                                  />
                            }
                      label="Descuento total"/>
                           
                      <TextField
                        fullWidth
                        margin="normal" 
                        type="number"
                        id="comision"
                        name="comision"
                        label="comision"
                        value={formik.values.comision}
                        onChange={formik.handleChange}
                        error={formik.touched.comision && Boolean(formik.errors.comision)}
                        helperText={formik.touched.comision && formik.errors.comision}
                      />



                     
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
  
  
  export default ModalVendedor;
  