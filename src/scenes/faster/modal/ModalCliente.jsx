import { useState ,useEffect} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,    
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    TextField,
   Typography,
   Tooltip

  } from '@mui/material';


  //import Grid from '@mui/material/Grid';

  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  import {  useTheme } from "@mui/material";
  import { tokens } from "../../../theme";

  // import {  validate, clean, format, getCheckDigit } from 'rut.js'
  import {  validate,clean } from 'rut.js';

  import {esUnicoYup,existeCodigoYup} from '../helpers/funcYup';


    
  export const ModalCliente =({ open,
     onClose, 
     onSubmit,
     onEdit,
     inicial,
     tableData,
     condicionpagoData,
     titulomod,
     deshabilitado}) => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [valuesCondicionPago, setvaluesCondicionPago] = useState([]);

    const [valuesultimaventa,setValuesultimaventa]=useState(0);   
    const [valuesventames,setValuesventames]=useState(0);   
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

    yup.addMethod(yup.string, "validarut", function (errorMessage) {
      return this.test(`validarut`, errorMessage, function (value) {
        const { path, createError } = this;
    
        return (
          (value && validate(value)) ||
          createError({ path, message: errorMessage })
        );
      });
    });
  
    const checkoutSchema = yup.object().shape({
      rut: yup.string().required("required")
      .validarut("Rut invalido!!"),
      codigo: yup.string().required("required")
      .length(6)
      .newexiste("New ya existe" ).modexiste("Mod ya existe"),
      razonsocial: yup.string().required("required"),
      direccion:yup.string().required("required"),
      giro:yup.string().required("required"),
      ciudad:yup.string().required("required"),
      telefono:yup.string().required("required"),
      email:yup.string().required("required").email('Enter a valid email'),
      nombre:yup.string().required("required"),     
      condicionpago:yup.string().required("required"),     
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
    const handleChangeConPag=  event => {
      const vnombre=event.target.value;

      console.log(event);

      setvaluesCondicionPago(vnombre);
      formik.setFieldValue("condicionpago", vnombre);

    };

    const handleChangeRut=  event => {

      const vnombre=event.target.value;
      console.log(event);
      formik.setFieldValue("rut",clean(vnombre));
    
    };

    const handleCodigoChange = (event) => {
      formik.handleChange(event);

      console.log(event.target.value);

      setErrorPrueba(false);  
      
      if(valueIdyup.id === "new"){
           console.log("validando");
          if ( event.target.value.length === 6 && existeCodigoYup(event.target.value,valueIdyup,tableData)){
            setErrorPrueba(true);
            setErrorText(`Ya existe ${event.target.value}`);
            
          };  
      };

    };
    useEffect(() => {

      console.log("Valores iniciales =====>",inicial);
  
      formik.setFieldValue("id", inicial.id);
      formik.setFieldValue("rut", inicial.rut);
      formik.setFieldValue("codigo",inicial.codigo);
      formik.setFieldValue("razonsocial",inicial.razonsocial);
      formik.setFieldValue("giro",inicial.giro);
      formik.setFieldValue("ciudad",inicial.ciudad);
      formik.setFieldValue("direccion",inicial.direccion);
      formik.setFieldValue("ultimaventa",inicial.ultimaventa);
      formik.setFieldValue("ventames",inicial.ventames);
      formik.setFieldValue("telefono",inicial.telefono);
      formik.setFieldValue("email",inicial.email);
      formik.setFieldValue("nombre",inicial.nombre);

      formik.setFieldValue("condicionpago",inicial.condicionpago.descripcion);
      setvaluesCondicionPago(inicial.condicionpago.descripcion); 

      setValuesultimaventa("$".concat(Intl.NumberFormat('en-US').format(inicial.ultimaventa)));
      setValuesventames("$".concat(Intl.NumberFormat('en-US').format(inicial.ventames)));

      setValueIdyup(inicial);       
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
                     {errorText} alerta — revisar!
                  </Alert>
                }  
          </DialogTitle>
           <DialogContent dividers >
            <form onSubmit={formik.handleSubmit}>

                      <Grid  container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={6}>
                            <Tooltip title="Digite sin puntos ni guion" >
                              <TextField
                                fullWidth
                                margin="normal" 
                                id="rut"
                                name="rut"
                                label="rut"
                                autoComplete='off'
                                value={formik.values.rut}
                                onChange={handleChangeRut}
                                error={formik.touched.rut && Boolean(formik.errors.rut)}
                                helperText={formik.touched.rut&& formik.errors.rut}
                              />
                            </Tooltip>  
                            <TextField
                              disabled={deshabilitado}
                              fullWidth
                              margin="normal" 
                              id="codigo"
                              name="codigo"
                              label="sigla"
                              autoComplete='off'
                              value={formik.values.codigo}
                              onChange={handleCodigoChange}
                              error={formik.touched.codigo && Boolean(formik.errors.codigo)}
                              helperText={formik.touched.codigo && formik.errors.codigo}
                            />
                            <TextField
                              fullWidth
                              margin="normal" 
                              id="razonsocial"
                              name="razonsocial"
                              label="razon social"
                              autoComplete='off'
                              value={formik.values.razonsocial}
                              onChange={formik.handleChange}
                              error={formik.touched.razonsocial && Boolean(formik.errors.razonsocial)}
                              helperText={formik.touched.razonsocial && formik.errors.razonsocial}
                            />  
                            <TextField
                              fullWidth
                              margin="normal" 
                              id="giro"
                              name="giro"
                              label="giro"
                              autoComplete='off'
                              value={formik.values.giro}
                              onChange={formik.handleChange}
                              error={formik.touched.giro && Boolean(formik.errors.giro)}
                              helperText={formik.touched.giro && formik.errors.giro}
                            />    
                            <TextField
                              fullWidth
                              margin="normal" 
                              id="direccion"
                              name="direccion"
                              label="direccion"
                              autoComplete='off'
                              value={formik.values.direccion}
                              onChange={formik.handleChange}
                              error={formik.touched.direccion && Boolean(formik.errors.direccion)}
                              helperText={formik.touched.direccion && formik.errors.direccion}
                            />   
                            <TextField
                                fullWidth
                                margin="normal" 
                                id="ciudad"
                                name="ciudad"
                                label="ciudad"
                                autoComplete='off'
                                value={formik.values.ciudad}
                                onChange={formik.handleChange}
                                error={formik.touched.ciudad && Boolean(formik.errors.ciudad)}
                                helperText={formik.touched.ciudad && formik.errors.ciudad}
                              />
                            <TextField
                              fullWidth
                              margin="normal" 
                              id="standard-select-tippro"
                              select
                              name="condicionpago"
                              label="condicion pago"
                              value={valuesCondicionPago}
                              onChange={handleChangeConPag}
                              error={formik.touched.condicionpago && Boolean(formik.errors.condicionpago)}
                              helperText={formik.touched.condicionpago && formik.errors.condicionpago}
                              
                            >
                              {condicionpagoData.map(option => (
                                <MenuItem key={option.id} value={option.descripcion}>
                                    {option.descripcion}
                                </MenuItem>
                              ))}
                            </TextField>                                 

                          </Grid>
                          <Grid item xs={6}>
  

                          
                            <Accordion defaultExpanded={true}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography color={colors.greenAccent[500]} variant="h5">
                                        Contacto
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                  <TextField
                                    fullWidth
                                    margin="normal" 
                                    id="telefono"
                                    name="telefono"
                                    label="telefono"
                                    autoComplete='off'
                                    value={formik.values.telefono}
                                    onChange={formik.handleChange}
                                    error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                                    helperText={formik.touched.telefono && formik.errors.telefono}
                                  />    

                                  <TextField
                                    fullWidth
                                    margin="normal" 
                                    id="email"
                                    name="email"
                                    label="email"
                                    autoComplete='off'
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                  />    
                                  <TextField
                                    fullWidth
                                    margin="normal" 
                                    id="nombre"
                                    name="nombre"
                                    label="nombre"
                                    autoComplete='off'
                                    value={formik.values.nombre}
                                    onChange={formik.handleChange}
                                    error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                                    helperText={formik.touched.nombre && formik.errors.nombre}
                                  />    
                            </AccordionDetails>
                            </Accordion>  
                        
                            <Accordion defaultExpanded={false}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography color={colors.greenAccent[500]} variant="h5">
                                        Estadistica venta
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>

                                  <TextField
                                      fullWidth
                                      margin="normal" 
                                    
                                      id="ultimaventa"
                                      name="ultimaventa"
                                      label="ultima venta"
                                      inputProps={
                                        { readOnly: true, }
                                      }
                                      value={valuesultimaventa}
                                      
                                    />  
                                    <TextField
                                      fullWidth
                                      margin="normal" 
                                    
                                      id="ventames"
                                      name="ventames"
                                      label="venta mes"
                                      inputProps={
                                        { readOnly: true, }
                                      }
                                      value={valuesventames}
                                      
                                    />  
                              </AccordionDetails>
                            </Accordion>  
                          </Grid>                                                                       
                      </Grid>
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
  
  
  export default ModalCliente;
  