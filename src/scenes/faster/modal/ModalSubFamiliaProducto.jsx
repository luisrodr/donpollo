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

  export const ModalSubFamiliaProducto =({ open,
     onClose, 
     onSubmit,
     onEdit,
     familiaData,
     agregadoData,
     inicial,
     tableData,
     titulomod,
     deshabilitado}) => {
    
    const [valuesIguala, setvaluesIguala] = useState('');  
    const [errorPrueba, setErrorPrueba] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [valuesfamilia, setValuesFamilia] = useState("");  
    const [valuesagregado, setValuesAgregado] = useState("");  
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

    //dentro de la funcion para que valide valuesIguala
    yup.addMethod(yup.string, "codigoiguala", function (errorMessage) {
      return this.test(`test-codigo igual a`, errorMessage, function (value) {
        const { path, createError } = this;
    
        return (
          (value && value.substring(0, 2)  === valuesIguala) ||
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
      familia_producto: yup.string("Enter familia").required("is required"),
      agregadosubfamiliaproducto: yup.string("Enter Agregado").required("is required")
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
      formik.setFieldValue("familia_producto", vnombre);
      const idfam=familiaData.find(element=>element.descripcion===vnombre);
      console.log("fam seleccionada ",idfam);
     
      setvaluesIguala(idfam.codigo);
      if (inicial.id === "new" ){
       // formik.setFieldValue("codigo", idfam.codigo);
        formik.setFieldValue("codigo",idfam.codigo+getCodigoSiguiente(idfam.siguientesubfamilia));
   
   
      };  
      
    };
    
    const handleChangeAgregado = name => event => {

      console.log(name);
      const vnombre=event.target.value;
      //console.log(vnombre);
      console.log(event);
      setValuesAgregado(vnombre);
      
      formik.setFieldValue("agregadosubfamiliaproducto", vnombre);
      
    };

    const handleCodigoChange = (event) => {
      formik.handleChange(event);

      console.log(event.target.value);
      
      if(valueIdyup.id === "new"){
           console.log("validando");

          if (event.target.value.length === 6 && existeCodigoYup(event.target.value,valueIdyup,tableData)){
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
      formik.setFieldValue("familia_producto",inicial.familia_producto.descripcion);
      formik.setFieldValue("agregadosubfamiliaproducto",inicial.agregadosubfamiliaproducto.descripcion);

      setValuesFamilia(inicial.familia_producto.descripcion);
      setValuesAgregado(inicial.agregadosubfamiliaproducto.descripcion);
     
      setErrorPrueba(false);
      if (deshabilitado ){
        //solo mod
        setvaluesIguala(getRelacion(familiaData,inicial.familia_producto.id).codigo);
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
                        id="standard-select-familia"
                        select
                        name="familia_producto"
                        label="familia_producto"
                       
                        value={valuesfamilia}
                        onChange={handleChangeFamilia("ciudad")}
                        error={formik.touched.familia_producto && Boolean(formik.errors.familia_producto)}
                        helperText={formik.touched.familia_producto && formik.errors.familia_producto}
                        
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
                        id="standard-select-agregado"
                        select
                        name="agregado"
                        label="agregado_subfamilia"
                        value={valuesagregado}
                        onChange={handleChangeAgregado("ciudad")}
                        error={formik.touched.agregadosubfamiliaproducto && Boolean(formik.errors.agregadosubfamiliaproducto)}
                        helperText={formik.touched.agregadosubfamiliaproducto && formik.errors.agregadosubfamiliaproducto}
                        
                      >
                        {agregadoData.map(option => (
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
  
  
  export default ModalSubFamiliaProducto;
  