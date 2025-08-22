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

  
  export const ModalTerminal =({ open,
     onClose,
      onSubmit,
      onEdit,
      departamentoData,
      inicial,
      tableData,
      titulomod,
      deshabilitado}) => {

    const [errorPrueba, setErrorPrueba] = useState(false);
    const [errorText,setErrorText] = useState("");
    const [valuesdepartamento, setValuesDepartamento] = useState("");  
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
      .length(2),
      descripcion: yup.string().required("required"),
      funcion: yup.string().required("required"),
      programa: yup.string().required("required"),
      argumento: yup.string().required("required"),
      departamento: yup.string("Enter departamento").required("is required")
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

    const handleChangeDepartamento= name => event => {

      console.log(name);
      const vnombre=event.target.value;
      //console.log(vnombre);
      console.log(event);
      setValuesDepartamento(vnombre);
      
      formik.setFieldValue("departamento", vnombre);
      
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
      formik.setFieldValue("funcion",inicial.funcion);
      formik.setFieldValue("programa",inicial.programa);
      formik.setFieldValue("argumento",inicial.argumento);
      formik.setFieldValue("departamento",inicial.departamento.descripcion);

      setValuesDepartamento(inicial.departamento.descripcion);
     
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
                        id="funcion"
                        name="funcion"
                        label="funcion"
                        autoComplete='off'
                        value={formik.values.funcion}
                        onChange={formik.handleChange}
                        error={formik.touched.funcion && Boolean(formik.errors.funcion)}
                        helperText={formik.touched.funcion && formik.errors.funcion}
                      />

                      <TextField
                        fullWidth
                        margin="normal" 
                        id="programa"
                        name="programa"
                        label="programa"
                        autoComplete='off'
                        value={formik.values.programa}
                        onChange={formik.handleChange}
                        error={formik.touched.programa && Boolean(formik.errors.programa)}
                        helperText={formik.touched.programa && formik.errors.programa}
                      />

                      <TextField
                        fullWidth
                        margin="normal" 
                        id="argumento"
                        name="argumento"
                        label="argumento"
                        autoComplete='off'
                        value={formik.values.argumento}
                        onChange={formik.handleChange}
                        error={formik.touched.argumento && Boolean(formik.errors.argumento)}
                        helperText={formik.touched.argumento && formik.errors.argumento}
                      />
                      <TextField
                        fullWidth
                        margin="normal" 
                        id="standard-select-departamento"
                        select
                        name="departamento"
                        label="departamento"
                        autoComplete='off'
                        value={valuesdepartamento}
                        onChange={handleChangeDepartamento("ciudad")}
                        error={formik.touched.departamento && Boolean(formik.errors.departamento)}
                        helperText={formik.touched.departamento && formik.errors.departamento}
                        
                      >
                        {departamentoData.map(option => (
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
  
  
  export default  ModalTerminal;
  