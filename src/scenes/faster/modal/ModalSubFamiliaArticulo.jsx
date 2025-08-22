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

  import getRelacion from '../helpers/getRelacion';

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

  
  export const ModalSubFamiliaArticulo =({ open, 
    onClose, 
    onSubmit,
    onEdit,
    familiaData,
    inicial,
    tableData,
    titulomod,
    deshabilitado}) => {
    const [valuesIguala, setvaluesIguala] = useState(''); 
    const [errorPrueba, setErrorPrueba] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [valuesfamilia, setValuesFamilia] = useState("");  
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


    //dentro de la funcion para que valide valuesIguala SOLO NEW 
    yup.addMethod(yup.string, "codigoiguala", function (errorMessage) {
      //solo si es new add
      
        return this.test(`test-codigo igual a`, errorMessage, function (value) {
          const { path, createError } = this;
      
          return (
            (value && value.substring(0, 2)  === valuesIguala ) ||
            createError({ path, message: errorMessage })
          );
        });
      
    });


    const checkoutSchema = yup.object().shape({
      codigo: yup.string().solonum("solo numeros")
      .required("required").length(4)
      .codigoiguala(`debe empezar igual a ${valuesIguala}` )
      .newexiste("New ya existe" ).modexiste("Mod ya existe"),
      descripcion: yup.string().required("required"),
      familiaarticulo: yup.string("Enter familia articulo").required("is required"),
      siguientecodigo:yup.number().required().moreThan(0, 'debe ser mayor a cero')
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

    const getCodigoSiguiente=(sigte)=>{
      console.log("siguiente ",sigte); 

      //const sigteStr=sigte.toString();
      const sfolio=`000${sigte}`;

      return sfolio.substr(sfolio.length - 2); 

      //return ;
    };    
    const handleChangeFamilia = name => event => {

      console.log(name);
      const vnombre=event.target.value;
      //console.log(vnombre);
      console.log(event);
      setValuesFamilia(vnombre);
      
      formik.setFieldValue("familiaarticulo", vnombre);

      const idfam=familiaData.find(element=>element.descripcion===vnombre);
      console.log("fam seleccionada ",idfam);
      setvaluesIguala(idfam.codigo);      

      if (inicial.id === "new" ){
        //formik.setFieldValue("codigo", idfam.codigo);
        formik.setFieldValue("codigo",idfam.codigo+getCodigoSiguiente(idfam.siguientesubfamilia));
   
      };  
     
    };

    const handleCodigoChange = (event) => {
      formik.handleChange(event);

      console.log(event.target.value);
      
      if(valueIdyup.id === "new"){
           console.log("validando");

          if (event.target.value.length === 4 && existeCodigoYup(event.target.value,valueIdyup,tableData)){
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
      formik.setFieldValue("descripcion", inicial.descripcion);
      formik.setFieldValue("familiaarticulo",inicial.familiaarticulo.descripcion);
      formik.setFieldValue("siguientecodigo",inicial.siguientecodigo);
      

      setValuesFamilia(inicial.familiaarticulo.descripcion);
     
      setErrorPrueba(false);

      if (deshabilitado ){
           //solo mod
           setvaluesIguala(getRelacion(familiaData,inicial.familiaarticulo.id).codigo);
      };  

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
                   
                    valida {valuesIguala}
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
                        id="standard-select-familia"
                        select
                        name="familiaarticulo"
                        label="familiaarticulo"
                        value={valuesfamilia}
                        onChange={handleChangeFamilia("ciudad")}
                        error={formik.touched.familiaarticulo && Boolean(formik.errors.familiaarticulo)}
                        helperText={formik.touched.familiaarticulo && formik.errors.familiaarticulo}
                        
                      >
                        {familiaData.map(option => (
                          <MenuItem key={option.id} value={option.descripcion}>
                              {option.descripcion}
                          </MenuItem>
                        ))}
                      </TextField>                      
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
                        id="siguientecodigo"
                        name="siguientecodigo"
                        label="siguiente codigo articulo"
                        type='number'
                        autoComplete='off'
                        value={formik.values.siguientecodigo}
                        onChange={formik.handleChange}
                        error={formik.touched.siguientecodigo && Boolean(formik.errors.siguientecodigo)}
                        helperText={formik.touched.siguientecodigo && formik.errors.siguientecodigo}
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
  
  
  export default ModalSubFamiliaArticulo;
  