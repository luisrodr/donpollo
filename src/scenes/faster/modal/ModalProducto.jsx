import { useState ,useEffect} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

import dayjs from 'dayjs';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {  useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,  
    Alert,
    Box ,
    Button,
    Dialog,
    Checkbox,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    LinearProgress,
    MenuItem,
    TextField,
    Typography,

  
  } from '@mui/material';

  //import Grid from '@mui/material/Grid';
  import FileUpload from "react-material-file-upload";

  import "./ModalArticulo.css"
  import getRelacion from '../helpers/getRelacion';
  import {esUnicoYup,existeCodigoYup} from '../helpers/funcYup';
  import { onlyNumbers } from '../helpers/funcYup';

  yup.addMethod(yup.string, "solonum", function (errorMessage) {
    return this.test(`test-codigo solo num`, errorMessage, function (value) {
      const { path, createError } = this;
  
      return (
        (value && onlyNumbers(value)) ||
        createError({ path, message: errorMessage })
      );
    });
  });

  export const ModalProducto =({ open,
     onClose,
     onSubmit,
     onEdit,
     subfamData,
     familiaData,
     inicial,
     tableData,
     tipoproductoData,
     titulomod,
     deshabilitado}) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    //para filtrar la subfamilia
    const [valuesSubfamfilter, setvaluesSubfamfilter] = useState([]);

    const [valuescostopromedio,setValuescostopromedio]=useState("");
    const [valuesmaximodescuento,setValuesmaximodescuento]=useState("");
    const [valuesventasdelmes,setValuesventasdelmes]=useState("");
    const [valuesventasacumuladas,setValuesventasacumuladas]=useState("");

     //validando  custom
    const [valuesIguala, setvaluesIguala] = useState('');  
    const [valuesfamilia,setValuesfamilia]= useState('');
    const [valuestipoproducto,setValuestipoproducto]= useState('');
    const [upLoading,setUpLoading]  = useState(false);
    const [urlImagen, setUrlImagen] = useState('');   
    const [files, setFiles] = useState([]);
   
    const [checkedpreventa, setCheckedPreventa] = useState(false);

    const [errorPrueba, setErrorPrueba] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [valuessubfam, setValuessubfam] = useState("");
   
    const [valueIdyup,setValueIdyup] = useState('');   
    const [initValues] = useState(inicial);



    //dentro de la funcion para que valide valuesIguala
    //dentro de la funcion para que valide valuesIguala
    yup.addMethod(yup.string, "codigoiguala", function (errorMessage) {
      return this.test(`test-codigo igual a`, errorMessage, function (value) {
        const { path, createError } = this;
    
        return (
          (value && value.substring(0, 4)  === valuesIguala) ||
          createError({ path, message: errorMessage })
        );
      });
    });
    const existeCodigoIngresoComanda=(code)=>{
      if (valueIdyup.id === "new" ){
         return tableData.find(({ codigoingresocomanda }) => codigoingresocomanda === code);
       };
    };

    yup.addMethod(yup.string, "newexisteingcomanda", function (errorMessage) {
      
      return this.test(`test-codigo existe`, errorMessage, function (value) {
        const { path, createError } = this;

            return (
              
                (value && !existeCodigoIngresoComanda(value)) || createError({ path, message: errorMessage })
          
            );
       
      });
    
   });   

   
   const  esUnicoYupComanda=(tableData, searchElement,filtro) =>{
    if (filtro !== "new" ){
      for (let elements of tableData) {
      
          if (elements.codigoingresocomanda === searchElement) {
            if (elements.id !== filtro) {
                //console.log("ya existe el CODIGO ",elements.codigo);
                  return true;
            }
        }  
      }
    };
    return false;
  };
  yup.addMethod(yup.string, "modexistecomanda", function (errorMessage) {

    return this.test(`test-codigo existe`, errorMessage, function (value) {
      const { path, createError } = this;
     
       
        return (
          (value && !esUnicoYupComanda(tableData,value,valueIdyup.id)) ||
          createError({ path, message: errorMessage })
        );
       
    });

  });   

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

      codigo: yup.string().solonum("solo numeros").required("required").length(7).codigoiguala(`debe empezar igual a ${valuesIguala}`).newexiste("New ya existe" ).modexiste("Mod ya existe"),
      
      descripcion: yup.string().required("required"),
      
      codigoingresocomanda:yup.string().required("required").newexisteingcomanda("New ya existe" ).modexistecomanda("Mod ya exist..."),
      
      unidaddemedida:yup.string().required("required"),

      preciodeventa:yup.number().required("required"),

      subfamilia_producto: yup.string("Enter subfamilia").required("is required"),

      tipoproducto: yup.string("Enter tipo producto").required("is required"),

    });
 
    const formik = useFormik({
      
      initialValues:initValues,
      validationSchema: checkoutSchema ,
      onSubmit: async (values) => {

        const cloudUrl=process.env.REACT_APP_URL_IMG;
        const formData=new FormData();
        formData.append('upload_preset','react-faster');
        formData.append('file',files[0]);

        
        if (values.id==="new" ){
          console.log("el seleccionado ============>",files[0]);
 
          //////////////////////////////////////////////
          
          if (files.length>0){
            
            try {

                setUpLoading(true);
                const resp=await fetch(cloudUrl,{
                      method:'POST',
                      body:formData      
                });

                if (resp.ok){
                    const cloudResp=await resp.json();
                      
                    console.log("la respuesta de claudinary",cloudResp.secure_url);

                    values.urlimagen=cloudResp.secure_url;
                    console.log("values antes de grabar",values);

                    //////////////submit 
                    onSubmit(values);
                    onClose();
                    /////////////// 
                    setUpLoading(false);

        
                    //return cloudResp.secure_url;
                }else{
                  //para test 
                  setErrorPrueba(true);
                  setErrorText(JSON.stringify(resp));

                  setUpLoading(false);
                  return null; 
                  // throw await resp.json();
                };
                
            } catch (error) {
                setUpLoading(false);
                setErrorPrueba(true);
                setErrorText(JSON.stringify(error));
                throw error;
            }

          }else{
              //////////////submit 
              onSubmit(values);
              onClose();
              /////////////// 
              
          };  
          /////////////////////////////////////////////
           
        }else{

            //////////////////////////////////////////////
            // hay archivo quiere cambiar el archivo
            if (files.length>0){
              
               console.log("contiene archivo: quiere cambiar el archivo");
              

                try {
                    setUpLoading(true);
                    const resp=await fetch(cloudUrl,{
                          method:'POST',
                          body:formData      
                    });

                    if (resp.ok){
                        const cloudResp=await resp.json();
                          
                        console.log("la respuesta de claudinary",cloudResp.secure_url);

                        values.urlimagen=cloudResp.secure_url;
                        console.log("values antes de grabar",values);

                        //////////////submit 
                        console.log("formik edit============>"); 
                        console.log(values); 
                        onEdit(values);
                        onClose();
                        setUpLoading(false);
                        
                        /////////////// 


                        //return cloudResp.secure_url;
                    }else{
                      setUpLoading(false);
                      setErrorPrueba(true);
                      setErrorText(JSON.stringify(resp))
                      //para test 
                      return null; 
                      // throw await resp.json();
                    };
                    
                } catch (error) {
                    setUpLoading(false);
                    setErrorPrueba(true);
                    setErrorText(JSON.stringify(error));
                    throw error;
                }
              

            }else{
              console.log("no contiene archivo , no modifica url ");
              onEdit(values);
              onClose();
            };  
/////////////////////////////////////////////
        };
        
        formik.resetForm();
 
      },
    });

    const setValueFamiliaRel=(laid)=>{
      setValuesfamilia(getRelacion(subfamData,laid).familia_producto.descripcion);


    };
    const getCodigoSiguiente=(sigte)=>{
      console.log("siguiente ",sigte); 

      //const sigteStr=sigte.toString();
      const sfolio=`000${sigte}`;

      return sfolio.substr(sfolio.length - 3); 

      //return ;
    };    
    const setValidacionCodigo=(vnombre)=>{
      const idsubfam=subfamData.find(element=>element.descripcion===vnombre);
      console.log("subfam seleccionada ",idsubfam);
      setvaluesIguala(idsubfam.codigo);
      setValueFamiliaRel(idsubfam.id);



      formik.setFieldValue("codigo", idsubfam.codigo+getCodigoSiguiente(idsubfam.siguientecodigo));

    }

    const handleChangeSub=  event => {
      const vnombre=event.target.value;



      console.log(event);
      setValuessubfam(vnombre);
      formik.setFieldValue("subfamilia_producto", vnombre);
     

      setValidacionCodigo(vnombre);

    };

    const handleChangeTipPro=  event => {
      const vnombre=event.target.value;

      console.log(event);
      setValuestipoproducto(vnombre);
      formik.setFieldValue("tipoproducto", vnombre);

    };

    const getSubFamByCodeFam=(code ='',arr)=>{

        if (code===''){
          return [];
        }
        
        return arr.filter(subfam=>subfam.familia_producto.descripcion===code);
    };

    const handleChangeFam=  event => {
      const vnombre=event.target.value;
      formik.setFieldValue("subfamilia_producto","");
      console.log("familia seleccionada :",vnombre);

      setValuesfamilia(vnombre);

      console.log("subfam a filtrar   ===>   ",subfamData);

      setvaluesSubfamfilter(getSubFamByCodeFam(vnombre,subfamData));
      
    };

    const handleChangeCheckPreven = (event) => {
      const valor=event.target.checked;
      setCheckedPreventa(valor);
      formik.setFieldValue("modificapreciodeventa",valor);
    };


    const handleCodigoChange = (event) => {
      formik.handleChange(event);

      console.log(event.target.value);

      setErrorPrueba(false);  
      
      if(valueIdyup.id === "new"){
           console.log("validando");


          if ( event.target.value.length === 7 && existeCodigoYup(event.target.value,valueIdyup,tableData)){
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
      formik.setFieldValue("codigoingresocomanda",inicial.codigoingresocomanda);
      formik.setFieldValue("unidaddemedida", inicial.unidaddemedida);
      formik.setFieldValue("preciodeventa",inicial.preciodeventa);
      formik.setFieldValue("precio",inicial.precio);

      formik.setFieldValue("modificapreciodeventa",inicial.modificapreciodeventa);
      formik.setFieldValue("subfamilia_producto",inicial.subfamilia_producto.descripcion);
      formik.setFieldValue("tipoproducto",inicial.tipoproducto.descripcion);
      formik.setFieldValue("urlimagen", inicial.urlimagen);
      formik.setFieldValue("fechaultimaventa",inicial.fechaultimaventa);
      formik.setFieldValue("costopromedio",inicial.costopromedio);
      formik.setFieldValue("maximodescuento",inicial.maximodescuento);
      formik.setFieldValue("ventasdelmes",inicial.ventasdelmes);
      formik.setFieldValue("ventasacumuladas",inicial.ventasacumuladas);

      setValuesfamilia("");
      setValuessubfam(inicial.subfamilia_producto.descripcion);
      setValuestipoproducto(inicial.tipoproducto.descripcion);

      setCheckedPreventa(inicial.modificapreciodeventa);

      setUrlImagen(inicial.urlimagen);
      setFiles([]); 
      setErrorPrueba(false);     

      setvaluesSubfamfilter(subfamData);

      setValueIdyup(inicial);


      setValuescostopromedio("$".concat(Intl.NumberFormat('en-US').format(inicial.costopromedio)));
      setValuesmaximodescuento("$".concat(Intl.NumberFormat('en-US').format(inicial.maximodescuento)));
      setValuesventasdelmes("$".concat(Intl.NumberFormat('en-US').format(inicial.ventasdelmes)));  
      setValuesventasacumuladas("$".concat(Intl.NumberFormat('en-US').format(inicial.ventasacumuladas)));  
     
      if (inicial.id !== "new" ){
        setValidacionCodigo(inicial.subfamilia_producto.descripcion);
        setValueFamiliaRel(inicial.subfamilia_producto.id);
     
    };   

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
                { upLoading &&  
                  <h1> Subiendo imagen ...</h1>
                
                }       
                { upLoading &&  
                  
                 <LinearProgress/>
                }
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
                   <TextField
                        disabled={deshabilitado}
                        fullWidth
                        margin="normal" 
                        id="standard-select-familia"
                        select
                        name="familia"
                        label="familia"
                       
                        value={valuesfamilia}
                        onChange={handleChangeFam}

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
                        id="codigoingresocomanda"
                        name="codigoingresocomanda"
                        label="codigoingresocomanda"
                        autoComplete='off'
                        value={formik.values.codigoingresocomanda}
                        onChange={formik.handleChange}
                        error={formik.touched.codigoingresocomanda && Boolean(formik.errors.codigoingresocomanda)}
                        helperText={formik.touched.codigoingresocomanda && formik.errors.codigoingresocomanda}
                      />

                      
                      <TextField
                        fullWidth
                        margin="normal" 
                        id="unidaddemedida"
                        name="unidaddemedida"
                        label="unidad de medida"
                        autoComplete='off'
                        value={formik.values.unidaddemedida}
                        onChange={formik.handleChange}
                        error={formik.touched.unidaddemedida && Boolean(formik.errors.unidaddemedida)}
                        helperText={formik.touched.unidaddemedida && formik.errors.unidaddemedida}
                      />


                      <TextField
                        fullWidth
                        margin="normal" 
                        type="number"
                        id="preciodeventa"
                        name="preciodeventa"
                        label="precio de venta"
                        value={formik.values.preciodeventa}
                        onChange={formik.handleChange}
                        error={formik.touched.preciodeventa && Boolean(formik.errors.preciodeventa)}
                        helperText={formik.touched.preciodeventa && formik.errors.preciodeventa}
                      /> 
                      <TextField
                        fullWidth
                        margin="normal" 
                        type="number"
                        id="precio"
                        name="precio"
                        label="precio"
                        value={formik.values.precio}
                        onChange={formik.handleChange}
                        error={formik.touched.precio && Boolean(formik.errors.precio)}
                        helperText={formik.touched.precio && formik.errors.precio}
                      /> 

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
                             
                              id="fechaultimaventa"
                              name="fechaultimaventa"
                              label="fecha ultimaventa"
                              inputProps={
                                { readOnly: true, }
                              }
                              value={dayjs(formik.touched.fechaultimaventa).format("YYYY-MM-DD")}
                            />
                             <TextField
                                fullWidth
                                margin="normal" 
                               
                                id="costopromedio"
                                name="costopromedio"
                                label="costo promedio"
                                inputProps={
                                  { readOnly: true, }
                                }
                                value={valuescostopromedio}
                                
                             />  
                             <TextField
                                fullWidth
                                margin="normal" 
                               
                                id="maximodescuento"
                                name="maximodescuento"
                                label="maximo descuento"
                                inputProps={
                                  { readOnly: true, }
                                }
                                value={valuesmaximodescuento}
                                
                             />     
                             <TextField
                                fullWidth
                                margin="normal" 
                               
                                id="ventasdelmes"
                                name="ventasdelmes"
                                label="ventas del mes"
                                inputProps={
                                  { readOnly: true, }
                                }
                                value={valuesventasdelmes}
                                
                             />     
                             <TextField
                                fullWidth
                                margin="normal" 
                               
                                id="ventasacumuladas"
                                name="ventasacumuladas"
                                label="ventas acumuladas"
                                inputProps={
                                  { readOnly: true, }
                                }
                                value={valuesventasacumuladas}
                                
                             />     

                               
                        </AccordionDetails>
                      </Accordion>


                    </Grid>
                    <Grid item xs={6}>
                    <TextField
                        disabled={deshabilitado}
                        fullWidth
                        margin="normal" 
                        id="standard-select-subfam"
                        select
                        name="subfam"
                        label="subfamilia"
                       
                        value={valuessubfam}
                        onChange={handleChangeSub}
                        error={formik.touched.subfamilia_producto && Boolean(formik.errors.subfamilia_producto)}
                        helperText={formik.touched.subfamilia_producto && formik.errors.subfamilia_producto}
                        
                      >
                        {valuesSubfamfilter.map(option => (
                          <MenuItem key={option.id} value={option.descripcion}>
                              {option.descripcion}
                          </MenuItem>
                        ))}
                      </TextField>  

                      <TextField
                        fullWidth
                        margin="normal" 
                        id="standard-select-tippro"
                        select
                        name="tippro"
                        label="tipo producto"
                       
                        value={valuestipoproducto}
                        onChange={handleChangeTipPro}
                        error={formik.touched.tipoproducto && Boolean(formik.errors.tipoproducto)}
                        helperText={formik.touched.tipoproducto && formik.errors.tipoproducto}
                        
                      >
                        {tipoproductoData.map(option => (
                          <MenuItem key={option.id} value={option.descripcion}>
                              {option.descripcion}
                          </MenuItem>
                        ))}
                      </TextField>                                          
  
                      <FormControlLabel
                            control={
                                    <Checkbox 
                                        checked={checkedpreventa}
                                        onChange={handleChangeCheckPreven}
                                        color="primary"
                                  />
                            }
                      label="Modifica precio de venta"/>
                                       
                      <FileUpload
                       accept="image/*"
                       label="imagen"
                       value={files} 
                       onChange={setFiles} />
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <img
                          alt="img"
                          width="100px"
                          height="100px"
                          src={`${urlImagen}`}
                          style={{ cursor: "pointer",borderRadius: "50%" }}
                        />
                        {/*style={{ cursor: "pointer", borderRadius: "50%" }}*/}
                      </Box>
                      <Accordion defaultExpanded={false}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography color={colors.greenAccent[500]} variant="h5">
                                  Estadistica costo
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>


                             <TextField
                                fullWidth
                                margin="normal" 
                               
                                id="costopromedio"
                                name="costopromedio"
                                label="costo promedio"
                                inputProps={
                                  { readOnly: true, }
                                }
                                value={valuescostopromedio}
                                
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
  
  
  export default  ModalProducto;
  