import { useState ,useEffect} from 'react';
import { useFormik } from 'formik'
import * as yup from 'yup'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {  useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import {
  Accordion,
  AccordionSummary,
  
  AccordionDetails,
    Alert,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Stack,
    TextField,
   Typography
  
  } from '@mui/material';
import { cosas} from '../../../data/makeDataCrud';
import Autocomplete from '@mui/material/Autocomplete';
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



export const ModalDocumento =({ open,
   onClose, 
   onSubmit,
   onEdit,
   inicial,
   tableData,
   titulomod,
   deshabilitado}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

   // const [inputValueCosa,setInputValueCosa] = useState(cosas[0]);
    
    const [errorPrueba, setErrorPrueba] = useState(false);
    const [errorText,setErrorText] = useState("");
    const [initValues] = useState(inicial);

    const [valueIdyup,setValueIdyup] = useState('');  
    
    const [valueEntradaSalida,setValueEntradaSalida] = useState('');  

    const [checkedEncabezadoVencimiento, setCheckedEncabezadoVencimiento] = useState(false);
    const [checkedEncabezadoDocumentoActual, setCheckedEncabezadoDocumentoActual] = useState(false);
    const [checkedEncabezadoProveedor, setCheckedEncabezadoProveedor] = useState(false);
    const [checkedEncabezadoDocumentoRelacionado, setCheckedEncabezadoDocumentoRelacionado] = useState(false);
    const [checkedEncabezadoBodega, setCheckedEncabezadoBodega] = useState(false);
    const [checkedEncabezadoCentroConsumo, setCheckedEncabezadoCentroConsumo] = useState(false);    
    const [checkedEncabezadoCentroProduccion, setCheckedEncabezadoCentroProduccion] = useState(false);  
    const [checkedEncabezadoDescuento, setCheckedEncabezadoDescuento] = useState(false);  
    const [checkedEncabezadoRecargo, setCheckedEncabezadoRecargo] = useState(false);  
    const [checkedEncabezadoStock, setCheckedEncabezadoStock] = useState(false);  
    const [checkedEncabezadoEntradaSalida, setCheckedEncabezadoEntradaSalida] = useState(false);   
  
    const [checkedEncabezadoRelacionaDocumento,setCheckedEncabezadoRelacionaDocumento]=useState(false);   
    const [checkedEncabezadoActualizaPrecio,setCheckedEncabezadoActualizaPrecio]=useState(false);   
 
    //detalle
    const [checkedDetalleExento, setCheckedDetalleExento] = useState(false);  
    const [checkedDetalleBodega, setCheckedDetalleBodega] = useState(false);  
    const [checkedDetalleNeto, setCheckedDetalleNeto] = useState(false);  
    const [checkedDetalleIla, setCheckedDetalleIla] = useState(false);  
    const [checkedDetalleDescuento, setCheckedDetalleDescuento] = useState(false); 
    const [checkedDetalleRecargo, setCheckedDetalleRecargo] = useState(false);
    const [checkedDetalleArticulo, setCheckedDetalleArticulo] = useState(false);
    const [checkedDetalleProducto, setCheckedDetalleProducto] = useState(false);
    const [checkedDetallePrecio, setCheckedDetallePrecio] = useState(false);

    const [checkedDetalleCostounitario, setDetalleCostounitario] = useState(false);
    const [checkedDetalleRecargoglobal, setDetalleRecargoglobal] = useState(false);
    const [checkedDetalleCostototal, setDetalleCostototal] = useState(false);
    const [checkedDetalleRetencion, setDetalleRetencion] = useState(false);

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
      /*
      folioinicial:yup.number().test('match', 
                              'debe ser menor o igual a folio final', 
                              function(folioinicial) { 
                                return folioinicial <= this.parent.foliofinal; 
                              }),
      foliofinal:yup.number().required("required"),
      siguiente:yup.number(),
      */
      sistemaimpresora: yup.string().required("required"),
      });
    

    const formik = useFormik({
      
      initialValues:initValues,
      validationSchema: checkoutSchema ,
      onSubmit: async (values) => {



        values.swEncabezadoVencimiento=checkedEncabezadoVencimiento;
        values.swEncabezadoProveedor=checkedEncabezadoProveedor;
        values.swEncabezadoDocumentoActual=checkedEncabezadoDocumentoActual;        
        values.swEncabezadoDocumentoRelacionado=checkedEncabezadoDocumentoRelacionado;
        values.swEncabezadoBodega=checkedEncabezadoBodega;
        values.swEncabezadoCentroConsumo=checkedEncabezadoCentroConsumo;
        values.swEncabezadoCentroProduccion=checkedEncabezadoCentroProduccion;
        values.swEncabezadoDescuento=checkedEncabezadoDescuento;
        values.swEncabezadoRecargo=checkedEncabezadoRecargo;
        values.swEncabezadoStock=checkedEncabezadoStock;
        values.swEncabezadoEntradaSalida=checkedEncabezadoEntradaSalida;
        
        values.swEncabezadoRelacionaDocumento=checkedEncabezadoRelacionaDocumento;
        values.swEncabezadoActualizaPrecio=checkedEncabezadoActualizaPrecio;

        values.ensa=checkedEncabezadoEntradaSalida ? "E":"S";     


        
        ///detALLE
        values.swDetalleExento=checkedDetalleExento;        
        values.swDetalleBodega=checkedDetalleBodega;
        values.swDetalleNeto=checkedDetalleNeto;
        values.swDetalleIla=checkedDetalleIla;
        values.swDetalleDescuento=checkedDetalleDescuento;
        values.swDetalleRecargo=checkedDetalleRecargo;
        values.swDetalleArticulo=checkedDetalleArticulo;
        values.swDetalleProducto=checkedDetalleProducto;
        values.swDetallePrecio=checkedDetallePrecio;
        
        values.swDetalleCostounitario=checkedDetalleCostounitario;
        values.swDetalleRecargoglobal=checkedDetalleRecargoglobal;
        values.swDetalleCostototal=checkedDetalleCostototal;
        values.swDetalleRetencion=checkedDetalleRetencion;
        


        console.log("submit");
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

    const handleCodigoChange = (event) => {
      formik.handleChange(event);



      setErrorPrueba(false);  
      
      if(valueIdyup.id === "new"){
           console.log("validando");


          if ( event.target.value.length === 3 && existeCodigoYup(event.target.value,valueIdyup,tableData)){
            setErrorPrueba(true);
            setErrorText(`Ya existe ${event.target.value}`);
            
          }  
      }

    };
    const handleChangeCheckEncabezadoVencimiento= (event) => {

      setCheckedEncabezadoVencimiento(event.target.checked);

    };
    const handleChangeCheckEncProveedor= (event) => {

      setCheckedEncabezadoProveedor(event.target.checked);

    };
    const handleChangeCheckEncabezadoDocumentoActual= (event) => {
      
      setCheckedEncabezadoDocumentoActual(event.target.checked);

    };    
    const handleChangeCheckEncabezadoDocumentoRelacionado= (event) => {

      setCheckedEncabezadoDocumentoRelacionado(event.target.checked);

    };
    const handleChangeCheckEncabezadoBodega= (event) => {
   
      setCheckedEncabezadoBodega(event.target.checked);

    };
    const handleChangeCheckEncabezadoCentroConsumo= (event) => {

      setCheckedEncabezadoCentroConsumo(event.target.checked);

    };
    const handleChangeCheckEncabezadoCentroProduccion= (event) => {

      setCheckedEncabezadoCentroProduccion(event.target.checked);

    };
    const handleChangeCheckEncabezadoDescuento= (event) => {
    
      setCheckedEncabezadoDescuento(event.target.checked);

    };
    const handleChangeCheckEncabezadoRecargo= (event) => {

      setCheckedEncabezadoRecargo(event.target.checked);

    };
    const handleChangeCheckEncabezadoStock= (event) => {
   
      setCheckedEncabezadoStock(event.target.checked);

    };  

    const handleChangeCheckEncabezadoRelacionaDocumento= (event) => {
   
      setCheckedEncabezadoRelacionaDocumento(event.target.checked);

    };  

    const handleChangeCheckEncabezadoActualizaPrecio= (event) => {
   
      setCheckedEncabezadoActualizaPrecio(event.target.checked);

    };  


    const handleChangeCheckEncabezadoEntradaSalida= (event) => {
     setCheckedEncabezadoEntradaSalida(event.target.checked);
      valueES(event.target.checked);
 
    }; 
    
   const valueES=(value)=>{
      setValueEntradaSalida(value?"entrada":"salida");
   };

    ///detalle
    const handleChangeCheckDetalleBodega= (event) => {

      setCheckedDetalleBodega(event.target.checked);

    };            
    const handleChangeCheckDetalleExento= (event) => {
   
      setCheckedDetalleExento(event.target.checked);

    };
    const handleChangeCheckDetalleNeto= (event) => {
   
      setCheckedDetalleNeto(event.target.checked);

    };

    const handleChangeCheckDetalleIla= (event) => {
      setCheckedDetalleIla(event.target.checked);
   };
 
   const handleChangeCheckDetalleDescuento= (event) => {
    setCheckedDetalleDescuento(event.target.checked);
   };   
   const handleChangeCheckDetalleRecargo= (event) => {
    setCheckedDetalleRecargo(event.target.checked);
   };   
   const handleChangeCheckDetalleArticulo= (event) => {
    setCheckedDetalleArticulo(event.target.checked);
   };  
   const handleChangeCheckDetalleProducto= (event) => {
    setCheckedDetalleProducto(event.target.checked);
   };  
   const handleChangeCheckDetallePrecio= (event) => {
    setCheckedDetallePrecio(event.target.checked);
   };
   
   const handleChangeCheckDetalleCostounitario=(event)=>{
    setDetalleCostounitario(event.target.checked);
   };
   const handleChangeCheckDetalleRecargoglobal=(event)=>{   
     setDetalleRecargoglobal(event.target.checked);
    };
    const handleChangeCheckDetalleCostototal=(event)=>{   
      setDetalleCostototal(event.target.checked);
     };
     const handleChangeCheckDetalleRetencion=(event)=>{   
      setDetalleRetencion(event.target.checked);
     };       
    useEffect(() => {
      console.log("Valores iniciales =====>",inicial);
      formik.setFieldValue("id", inicial.id);
      formik.setFieldValue("codigo", inicial.codigo);
      formik.setFieldValue("descripcion",inicial.descripcion);
      formik.setFieldValue("folioinicial",inicial.folioinicial);
      formik.setFieldValue("foliofinal",inicial.foliofinal);
      formik.setFieldValue("siguiente",inicial.siguiente);
      formik.setFieldValue("sistemaimpresora",inicial.sistemaimpresora);
    

      setCheckedEncabezadoVencimiento(inicial.swEncabezadoVencimiento); 
      setCheckedEncabezadoProveedor(inicial.swEncabezadoProveedor);

      setCheckedEncabezadoDocumentoActual(inicial.swEncabezadoDocumentoActual);
 
      setCheckedEncabezadoDocumentoRelacionado(inicial.swEncabezadoDocumentoRelacionado);
      setCheckedEncabezadoBodega(inicial.swEncabezadoBodega);
      setCheckedEncabezadoCentroConsumo(inicial.swEncabezadoCentroConsumo);
      setCheckedEncabezadoCentroProduccion(inicial.swEncabezadoCentroProduccion);

      setCheckedEncabezadoDescuento(inicial.swEncabezadoDescuento);
      setCheckedEncabezadoRecargo(inicial.swEncabezadoRecargo);    
      setCheckedEncabezadoStock(inicial.swEncabezadoStock);    

      setCheckedEncabezadoRelacionaDocumento(inicial.swEncabezadoRelacionaDocumento); 
      setCheckedEncabezadoActualizaPrecio(inicial.swEncabezadoActualizaPrecio);   
   
      setCheckedEncabezadoEntradaSalida(inicial.swEncabezadoEntradaSalida);    
      valueES(inicial.swEncabezadoEntradaSalida);

     ///////////////////////detalle
     setCheckedDetalleBodega(inicial.swDetalleBodega);
     setCheckedDetalleExento(inicial.swDetalleExento);
     setCheckedDetalleNeto(inicial.swDetalleNeto);
     setCheckedDetalleIla(inicial.swDetalleIla);
     setCheckedDetalleDescuento(inicial.swDetalleDescuento);
     setCheckedDetalleRecargo(inicial.swDetalleRecargo);
     setCheckedDetalleArticulo(inicial.swDetalleArticulo);
     setCheckedDetalleProducto(inicial.swDetalleProducto);
     setCheckedDetallePrecio(inicial.swDetallePrecio);

     setDetalleCostounitario(inicial.swDetalleCostounitario);
     setDetalleRecargoglobal(inicial.swDetalleRecargoglobal);
     setDetalleCostototal(inicial.swDetalleCostototal);
     setDetalleRetencion(inicial.swDetalleRetencion);

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
                        id="sistemaimpresora"
                        name="sistemaimpresora"
                        label="sistema impresora"
                        autoComplete='off'
                        value={formik.values.sistemaimpresora}
                        onChange={formik.handleChange}
                        error={formik.touched.sistemaimpresora && Boolean(formik.errors.sistemaimpresora)}
                        helperText={formik.touched.sistemaimpresora && formik.errors.sistemaimpresora}
                      /> 
                      <Accordion defaultExpanded={false}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography color={colors.greenAccent[500]} variant="h5">
                                  Encabezado 
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <FormControlLabel
                                  control={
                                          <Checkbox 
                                              checked={checkedEncabezadoVencimiento}
                                              onChange={handleChangeCheckEncabezadoVencimiento}
                                              color="primary"
                                        />
                                  }
                            label="Encabezado vencimiento"/>        
                            <FormControlLabel
                                  control={
                                          <Checkbox 
                                              checked={checkedEncabezadoDocumentoActual}
                                              onChange={handleChangeCheckEncabezadoDocumentoActual}
                                              color="primary"
                                        />
                                  }
                            label="Encabezado folio documento actual"/>        

                            <FormControlLabel
                                    control={
                                            <Checkbox 
                                                checked={checkedEncabezadoProveedor}
                                                onChange={handleChangeCheckEncProveedor}
                                                color="primary"
                                          />
                                    }
                              label="Encabezado proveedor"/>        
                            <FormControlLabel
                                  control={
                                          <Checkbox 
                                              checked={checkedEncabezadoDocumentoRelacionado}
                                              onChange={handleChangeCheckEncabezadoDocumentoRelacionado}
                                              color="primary"
                                        />
                                  }
                            label="Encabezado documento relacionado"/>  
                            <FormControlLabel
                                  control={
                                          <Checkbox 
                                              checked={checkedEncabezadoBodega}
                                              onChange={handleChangeCheckEncabezadoBodega}
                                              color="primary"
                                        />
                                  }
                            label="Encabezado bodega"/>   

                            <FormControlLabel
                                  control={
                                          <Checkbox 
                                              checked={checkedEncabezadoCentroConsumo}
                                              onChange={handleChangeCheckEncabezadoCentroConsumo}
                                              color="primary"
                                        />
                                  }
                            label="Encabezado centro consumo"/>

                            <FormControlLabel
                                  control={
                                          <Checkbox 
                                              checked={checkedEncabezadoCentroProduccion}
                                              onChange={handleChangeCheckEncabezadoCentroProduccion}
                                              color="primary"
                                        />
                                  }
                            label="Encabezado centro produccion"/>
                            <FormControlLabel
                                  control={
                                          <Checkbox 
                                              checked={checkedEncabezadoDescuento}
                                              onChange={handleChangeCheckEncabezadoDescuento}
                                              color="primary"
                                        />
                                  }
                            label="Encabezado descuent "/>
                            <FormControlLabel
                                  control={
                                          <Checkbox 
                                              checked={checkedEncabezadoRecargo}
                                              onChange={handleChangeCheckEncabezadoRecargo}
                                              color="primary"
                                        />
                                  }
                            label="Encabezado recargo"/>  

                            <FormControlLabel
                                  control={
                                          <Checkbox 
                                              checked={checkedEncabezadoStock}
                                              onChange={handleChangeCheckEncabezadoStock}
                                              color="primary"
                                        />
                                  }
                            label="stock"/>   

                            <FormControlLabel
                                  control={
                                          <Checkbox 
                                              checked={checkedEncabezadoRelacionaDocumento}
                                              onChange={handleChangeCheckEncabezadoRelacionaDocumento}                               color="primary"
                                        />
                                  }
                            label="Relaciona documento"/>  


                            <FormControlLabel
                                  control={
                                          <Checkbox 
                                              checked={checkedEncabezadoActualizaPrecio}
                                              onChange={handleChangeCheckEncabezadoActualizaPrecio}
                                              color="primary"
                                        />
                                  }
                            label="Actualiza precio"/>   

                            <FormControlLabel
                                  control={
                                          <Checkbox 
                                              checked={checkedEncabezadoEntradaSalida}
                                              onChange={handleChangeCheckEncabezadoEntradaSalida}
                                              color="primary"
                                        />
                                  }
                            label={valueEntradaSalida}/> 
                            

                            </AccordionDetails>
                        </Accordion>
                        {/*detalle*/} 
                        <Accordion defaultExpanded={false}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography color={colors.greenAccent[500]} variant="h5">
                                 Detalle elementos
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <FormControlLabel
                              control={
                                      <Checkbox 
                                          checked={checkedDetalleExento}
                                          onChange={handleChangeCheckDetalleExento}
                                          color="primary"
                                    />
                              }
                        label="Detalle exento"/>   

                        <FormControlLabel
                              control={
                                      <Checkbox 
                                          checked={checkedDetalleBodega}
                                          onChange={handleChangeCheckDetalleBodega}
                                          color="primary"
                                    />
                              }
                        label="Detalle bodega"/>                      
                        <FormControlLabel
                              control={
                                      <Checkbox 
                                          checked={checkedDetalleNeto}
                                          onChange={handleChangeCheckDetalleNeto}
                                          color="primary"
                                    />
                              }
                        label="Detalle neto"/>  
                        <FormControlLabel
                              control={
                                      <Checkbox 
                                          checked={checkedDetalleIla}
                                          onChange={handleChangeCheckDetalleIla}
                                          color="primary"
                                    />
                              }
                        label="Detalle Ila"/>  
                        <FormControlLabel
                              control={
                                      <Checkbox 
                                          checked={checkedDetalleDescuento}
                                          onChange={handleChangeCheckDetalleDescuento}
                                          color="primary"
                                    />
                              }
                        label="Detalle descuento"/>  
                        <FormControlLabel
                              control={
                                      <Checkbox 
                                          checked={checkedDetalleRecargo}
                                          onChange={handleChangeCheckDetalleRecargo}
                                          color="primary"
                                    />
                              }
                        label="Detalle recargo"/>  

                        <FormControlLabel
                              control={
                                      <Checkbox 
                                          checked={checkedDetalleArticulo}
                                          onChange={handleChangeCheckDetalleArticulo}
                                          color="primary"
                                    />
                              }
                        label="Detalle articulo"/>       

                        <FormControlLabel
                              control={
                                      <Checkbox 
                                          checked={checkedDetalleProducto}
                                          onChange={handleChangeCheckDetalleProducto}
                                          color="primary"
                                    />
                              }
                        label="Detalle producto"/>    
                        <FormControlLabel
                              control={
                                      <Checkbox 
                                          checked={checkedDetallePrecio}
                                          onChange={handleChangeCheckDetallePrecio }
                                          color="primary"
                                    />
                              }
                         label="Detalle precio"/>   

                        <FormControlLabel
                              control={
                                      <Checkbox 
                                          checked={checkedDetalleCostounitario}
                                          onChange={handleChangeCheckDetalleCostounitario}
                                          color="primary"
                                    />
                              }
                         label="Detalle costo unitario"/>  
                                                 
                        <FormControlLabel
                              control={
                                      <Checkbox 
                                          checked={checkedDetalleRecargoglobal}
                                          onChange={handleChangeCheckDetalleRecargoglobal}
                                          color="primary"
                                    />
                              }
                         label="Detalle recargo global"/> 

                        <FormControlLabel
                              control={
                                      <Checkbox 
                                          checked={checkedDetalleCostototal}
                                          onChange={handleChangeCheckDetalleCostototal}
                                          color="primary"
                                    />
                              }
                         label="Detalle costo total"/>  
                                                
                        <FormControlLabel
                              control={
                                      <Checkbox 
                                          checked={checkedDetalleRetencion}
                                          onChange={handleChangeCheckDetalleRetencion}
                                          color="primary"
                                    />
                              }
                         label="Detalle retencion"/>     

                        </AccordionDetails>
                    </Accordion>
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
  
  
  export default ModalDocumento;
  