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


  export const ModalImpresoraDocumentoFolio=({ open, onClose, onSubmit,onEdit,impresoraData,documentoData,inicial,titulomod}) => {

    const [errorPrueba, setErrorPrueba] = useState(false);
    const [errorText] = useState("");
    const [valuesimpresora, setValuesimpresora] = useState("");  
    const [valuesdocumento, setValuesdocumento] = useState("");  
    const [initValues] = useState(inicial);


    const checkoutSchema = yup.object().shape({
      folioinicial:yup.number().test('match', 
      'debe ser menor o igual a folio final', 
      function(folioinicial) { 
        return folioinicial <= this.parent.foliofinal; 
      }),
      foliofinal:yup.number().required("required"),
      siguiente:yup.number().test('match', 
      'debe ser mayor a folio final', 
      function(siguiente) { 
        return siguiente > this.parent.foliofinal; 
      }),

      impresora: yup.string("required").required("is required"),
      documento: yup.string("required").required("is required"),

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

        };

        formik.resetForm();
 
      },
    });

    const handleChangeImpresora =  event => {
 
      const vnombre=event.target.value;
      //console.log(vnombre);
      console.log(event);
      setValuesimpresora(vnombre);
      
      formik.setFieldValue("impresora", vnombre);
      
    };

    const handleChangeDocumento =  event => {
      const vnombre=event.target.value;
      //console.log(vnombre);
      console.log(event);
      setValuesdocumento(vnombre);
      
      formik.setFieldValue("documento", vnombre);
    };
  
    useEffect(() => {
      console.log("Valores iniciales =====>",inicial);
  
      formik.setFieldValue("id", inicial.id);
      formik.setFieldValue("folioinicial",inicial.folioinicial);
      formik.setFieldValue("foliofinal",inicial.foliofinal);
      formik.setFieldValue("siguiente",inicial.siguiente);
      formik.setFieldValue("impresora",inicial.impresora.descripcion);
      formik.setFieldValue("documento",inicial.documento.descripcion);

      setValuesimpresora(inicial.impresora.descripcion);
      setValuesdocumento(inicial.documento.descripcion);
     
      setErrorPrueba(false);
    
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
                      {errorText} This is an error alert — check it out!
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
                        type="number"
                        id="folioinicial"
                        name="folioinicial"
                        label="folio inicial"
                        value={formik.values.folioinicial}
                        onChange={formik.handleChange}
                        error={formik.touched.folioinicial && Boolean(formik.errors.folioinicial)}
                        helperText={formik.touched.folioinicial && formik.errors.folioinicial}
                      />   
                      <TextField
                        fullWidth
                        margin="normal" 
                        type="number"
                        id="foliofinal"
                        name="foliofinal"
                        label="folio final"
                        value={formik.values.foliofinal}
                        onChange={formik.handleChange}
                        error={formik.touched.foliofinal && Boolean(formik.errors.foliofinal)}
                        helperText={formik.touched.foliofinal && formik.errors.foliofinal}
                      />      
                      <TextField
                        fullWidth
                        margin="normal" 
                        type="number"
                        id="siguiente"
                        name="siguiente"
                        label="siguiente"
                        value={formik.values.siguiente}
                        onChange={formik.handleChange}
                        error={formik.touched.siguiente && Boolean(formik.errors.siguiente)}
                        helperText={formik.touched.siguiente && formik.errors.siguiente}
                      /> 
                     
 
                      <TextField
                        fullWidth
                        margin="normal" 
                        id="impresora"
                        select
                        name="impresora"
                        label="impresora"
                       
                        value={valuesimpresora}
                        onChange={handleChangeImpresora}
                        error={formik.touched.impresora && Boolean(formik.errors.impresora)}
                        helperText={formik.touched.impresora && formik.errors.impresora}
                        
                      >
                        {impresoraData.map(option => (
                          <MenuItem key={option.id} value={option.descripcion}>
                              {option.descripcion}
                          </MenuItem>
                        ))}
                      </TextField>


                      <TextField
                        fullWidth
                        margin="normal" 
                        id="documento"
                        select
                        name="documento"
                        label="documento"
                        value={valuesdocumento}
                        onChange={handleChangeDocumento}
                        error={formik.touched.documento && Boolean(formik.errors.documento)}
                        helperText={formik.touched.documento  && formik.errors.documento}
                        
                      >
                        {documentoData.map(option => (
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
  
  
  export default ModalImpresoraDocumentoFolio;
  