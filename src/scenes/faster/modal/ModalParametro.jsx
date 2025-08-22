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
    Stack,
    TextField,
    Tooltip,
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

// export const inicialParametro={
//   id:'new',
//   siguientefamiliaarticulo:0,
//   siguientefamiliaproducto:0,

//   iva:19,
// };


export const ModalParametro =({ open, 
   onClose,
   onSubmit,
   onEdit,
   inicial, 
   tableData,
   titulomod,
   }) => {

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
      mesproceso: yup.string().required("required").length(6)
       .solonum("solo numeros")

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

  
    useEffect(() => {
      console.log("Valores iniciales =====>",inicial);
  
      formik.setFieldValue("id", inicial.id);
      formik.setFieldValue("siguientefamiliaarticulo", inicial.siguientefamiliaarticulo);
      formik.setFieldValue("siguientefamiliaproducto",inicial.siguientefamiliaproducto);
      formik.setFieldValue("iva",inicial.iva);
      formik.setFieldValue("mesproceso",inicial.mesproceso);
      formik.setFieldValue("diasadicionalperiodoactual",inicial.diasadicionalperiodoactual);
      formik.setFieldValue("comportamientogeneral",inicial.comportamientogeneral);
      formik.setFieldValue("empresa",inicial.empresa);

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
                        
                        fullWidth
                        margin="normal" 
                        id="empresa"
                        name="empresa"
                        label="empresa"
                        autoComplete='off'
                        value={formik.values.empresa}
                        onChange={formik.handleChange}

                      />                      

                    <TextField
                      fullWidth
                      margin="normal" 
                      type="number"
                      id="siguientefamiliaarticulo"
                      name="siguientefamiliaarticulo"
                      label="siguiente familia articulo"
                      value={formik.values.siguientefamiliaarticulo}
                      onChange={formik.handleChange}
                    />   

                    <TextField
                      fullWidth
                      margin="normal" 
                      type="number"
                      id="siguientefamiliaproducto"
                      name="siguientefamiliaproducto"
                      label="siguiente familia producto"
                      value={formik.values.siguientefamiliaproducto}
                      onChange={formik.handleChange}                      
                    />   

                    <TextField
                      fullWidth
                      margin="normal" 
                      type="number"
                      id="iva"
                      name="iva"
                      label="iva"
                      value={formik.values.iva}
                      onChange={formik.handleChange}
                    />   
                    <Tooltip title="formato:AAAAMM">
                        <TextField
                        
                            fullWidth
                            margin="normal" 
                            id="mesproceso"
                            name="mesproceso"
                            label="mesproceso"
                            autoComplete='off'
                            value={formik.values.mesproceso}
                            onChange={formik.handleChange}
                            error={formik.touched.mesproceso && Boolean(formik.errors.mesproceso )}
                            helperText={formik.touched.mesproceso&& formik.errors.mesproceso}
                          />
                    </Tooltip>
   
                    <TextField
                      fullWidth
                      margin="diasadicionalperiodoactual" 
                      type="number"
                      id="diasadicionalperiodoactual"
                      name="diasadicionalperiodoactual"
                      label="dias adicional periodo actual"
                      value={formik.values.diasadicionalperiodoactual}
                      onChange={formik.handleChange}
                    />  
                    <Tooltip title={ <>
                                  <Typography color="inherit">Si contiene:</Typography>
                                  <Typography color="inherit">N=no graba si stock insuficiente. n=avisa y da opción de grabar.Warning!</Typography>
                                  {/* <Typography color="inherit">otra linea</Typography> */}
                        
                                </>} >
                        <TextField
                        
                            fullWidth
                            margin="normal" 
                            id="comportamientogeneral"
                            name="comportamientogeneral"
                            label="comportamientogeneral"
                            autoComplete='off'
                            value={formik.values.comportamientogeneral}
                            onChange={formik.handleChange}
                            //error={formik.touched.mesproceso && Boolean(formik.errors.mesproceso )}
                            //helperText={formik.touched.mesproceso&& formik.errors.mesproceso}
                          />
                    </Tooltip>


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
  
  
  export default ModalParametro;
  