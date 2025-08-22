import { useState ,useEffect} from 'react';
//import {isIP, isIPv4} from 'is-ip';
import {isIPv4} from 'is-ip';

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
//import {esUnicoYup,existeCodigoYup} from '../helpers/funcYup';

yup.addMethod(yup.string, "solonum", function (errorMessage) {
  return this.test(`test-codigo solo num`, errorMessage, function (value) {
    const { path, createError } = this;

    return (
      (value && onlyNumbers(value)) ||
      createError({ path, message: errorMessage })
    );
  });
});

export const ModalIp=({ open,
   onClose,
    onSubmit,
    onEdit,
   // tipodescuentoData,
    lugarData,
    inicial,
    tableData,
    titulomod,
 
    //habilitado
  }) => {

    const [errorPrueba, setErrorPrueba] = useState(false);
    const [errorText,setErrorText] = useState("");
    //const [valuestipodescuento, setValuesTipodescuento] = useState("");  
    const [valueslugar, setValuesLugar] = useState("");  
    const [initValues] = useState(inicial);

    const [valuesIpInicial, setValuesIpInicial] = useState("");  

    //const [valueIdyup,setValueIdyup] = useState('');  

  yup.addMethod(yup.string, "esip", function (errorMessage) {
    return this.test(`test-codigo esip`, errorMessage, function (value) {
      const { path, createError } = this;
  
      return (
        (value && isIPv4(value)  ) ||
        createError({ path, message: errorMessage })
      );
    });
  });

 const noExisteIp=(ipbuscar)=>{
  let existeValorIp = tableData.find(element => String(element.ip)=== ipbuscar);

  return existeValorIp ? false:true;

 };

  // yup.addMethod(yup.string, "noexisteip", function (errorMessage) {
  //   return this.test(`test-codigo existeip`, errorMessage, function (value) {
  //     const { path, createError } = this;
  
  //     return (
  //       (value && noExisteIp(value)  ) ||
  //       createError({ path, message: errorMessage })
  //     );
  //   });
  // });

  const checkoutSchema = yup.object().shape({

    nombre: yup.string().required("required"),
    equipo: yup.string().required("equipo"),
   
    detalle: yup.string().required("detalle"),
    lugar: yup.string("Enter lugar").required("is required"),
    ip: yup.string().esip("debe ser ip valida").required("ip"),
 

    });
  
    const formik = useFormik({
      
      initialValues:initValues,
      validationSchema: checkoutSchema ,
      onSubmit: async (values) => {

        // if (!isIP(values.ip)){
        //        setErrorPrueba(true);
        //        setErrorText("ip invalida");
        //        return;
        // } ;

        if (values.id==="new" ){
           
            if ( !noExisteIp(values.ip)){
                setErrorPrueba(true);
                setErrorText("new : ip existe!");
                return;
            };

            onSubmit(values);
            onClose();
            /////////////// 
           
        }else{
            //modifica y es distinta la ip
            //busca si existe
            console.log("ip  valuesIpInicial ",valuesIpInicial);
            console.log("values.ip ",values.ip);
            console.log("valuesIpInicial.localeCompare(values.ip) ",valuesIpInicial.localeCompare(values.ip));


            if ( ! valuesIpInicial.localeCompare(values.ip) == 0 ){
              
                 console.log("mod  no son iguales la ip ");

                //existe ip , no graba
                if ( !noExisteIp(values.ip)){
                 
                   setErrorPrueba(true);
                   setErrorText("mod:  ip existe!");
                   return;


                };   
                
            };


            
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

    const handleChangeLugar= name => event => {

      console.log(name);
      const vnombre=event.target.value;
      //console.log(vnombre);
      console.log(event);
      setValuesLugar(vnombre);
      
      formik.setFieldValue("lugar", vnombre);
      
    };
  
    useEffect(() => {
      console.log("Valores iniciales =====>",inicial);
  
      formik.setFieldValue("id", inicial.id);

 
      formik.setFieldValue("nombre", inicial.nombre);
      formik.setFieldValue("equipo", inicial.equipo);
      
      formik.setFieldValue("ip", inicial.ip);
      //para  validar solo si modifica
      setValuesIpInicial(inicial.ip);

      formik.setFieldValue("detalle", inicial.detalle);
      formik.setFieldValue("lugar",inicial.lugar.descripcion);
      
      setValuesLugar(inicial.lugar.descripcion);

     
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
                        id="nombre"
                        name="nombre"
                        label="nombre"
                        autoComplete='off'
                        value={formik.values.nombre}
                        onChange={formik.handleChange}
                        error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                        helperText={formik.touched.nombre && formik.errors.nombre}
                      />
                     <TextField
                        fullWidth
                        margin="normal" 
                        id="nombre"
                        name="equipo"
                        label="equipo"
                        autoComplete='off'
                        value={formik.values.equipo}
                        onChange={formik.handleChange}
                        error={formik.touched.equipo && Boolean(formik.errors.equipo)}
                        helperText={formik.touched.equipo && formik.errors.equipo}
                      />

                     <TextField
                        fullWidth
                        margin="normal" 
                        id="nombre"
                        name="ip"
                        label="ip"
                        autoComplete='off'
                        value={formik.values.ip}
                        onChange={formik.handleChange}
                        error={formik.touched.ip && Boolean(formik.errors.ip)}
                        helperText={formik.touched.ip && formik.errors.ip}
                      />
                     <TextField
                        fullWidth
                        margin="normal" 
                        id="nombre"
                        name="detalle"
                        label="detalle"
                        autoComplete='off'
                        value={formik.values.detalle}
                        onChange={formik.handleChange}
                        error={formik.touched.detalle && Boolean(formik.errors.detalle)}
                        helperText
                        ={formik.touched.detalle && formik.errors.detalle}
                      />

                      <TextField
                        fullWidth
                        margin="normal" 
                        id="lugar"
                        select
                        name="lugar"
                        label="lugar"
                       
                        value={valueslugar}
                        onChange={handleChangeLugar("ciudad")}
                        error={formik.touched.lugar && Boolean(formik.errors.lugar)}
                        helperText={formik.touched.lugar && formik.errors.lugar}
                        
                      >
                        {lugarData.map(option => (
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
  
  
  export default  ModalIp;
  