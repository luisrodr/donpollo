import { useState ,useEffect} from 'react';



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
  


  
  export const ModalTipoDescuento =({ open,
     onClose,
      onSubmit,
      onEdit,
      acciontdeData,
      inicial,
      tableData,
      titulomod,
      deshabilitado}) => {

    const [errorPrueba, setErrorPrueba] = useState(false);
    const [errorText,setErrorText] = useState("");
    const [valuesacciontde, setValuesAccionTde] = useState("");  
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
      .required("required").length(2)
      .newexiste("New ya existe" ).modexiste("Mod ya existe"),
      descripcion: yup.string().required("required"),
      acciontipodescuento:yup.string().required("required"),
  
     });

    const formik = useFormik({
      
      initialValues:initValues,
      validationSchema: checkoutSchema ,
      onSubmit: async (values) => {

        console.log("Submit============>"); 

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

    const handleChangeAtd= event => {

 
      const vnombre=event.target.value;

      console.log(event,vnombre);
      setValuesAccionTde(vnombre);
      
      formik.setFieldValue("acciontipodescuento", vnombre);
      
    };
    const handleCodigoChange = (event) => {
      formik.handleChange(event);

      console.log(event.target.value);

      setErrorPrueba(false);  
      
      if(valueIdyup.id === "new"){
           console.log("validando");


          if ( event.target.value.length === 3 && existeCodigoYup(event.target.value,valueIdyup,tableData)){
            setErrorPrueba(true);
            setErrorText(`Ya existe ${event.target.value}`);
            
          }  
         
      }

    };
    useEffect(() => {
      console.log("Valores iniciales =====>",inicial);
  
      formik.setFieldValue("id", inicial.id);

      formik.setFieldValue("codigo", inicial.codigo);
      formik.setFieldValue("descripcion", inicial.descripcion);
      formik.setFieldValue("acciontipodescuento",inicial.acciontipodescuento.descripcion);

      setValuesAccionTde(inicial.acciontipodescuento.descripcion);
     
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
                 
                      <TextField
                        fullWidth
                        margin="normal" 
                        id="acciontipodescuento"
                        select
                        name="acciontipodescuento"
                        label="accion tipo descuento"
                       
                        value={valuesacciontde}
                        onChange={handleChangeAtd}
                        error={formik.touched.acciontipodescuento&& Boolean(formik.errors.acciontipodescuento)}
                        helperText={formik.touched.acciontipodescuento && formik.errors.acciontipodescuento}
                        
                      >
                        {acciontdeData.map(option => (
                          <MenuItem key={option.id} value={option.descripcion}>
                              {option.descripcion}
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
  
  
  export default  ModalTipoDescuento;
  