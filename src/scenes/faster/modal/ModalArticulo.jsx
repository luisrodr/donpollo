import { useState ,useEffect,useContext} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from "axios";
import dayjs from 'dayjs';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {  useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { AuthContext } from "../../../mycontext";
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
    Grid,
    FormControlLabel,
    LinearProgress,
    MenuItem,
    TextField,
    Typography,

  
  } from '@mui/material';

  import Autocomplete from '@mui/material/Autocomplete';
 
  import FileUpload from "react-material-file-upload";

  import "./ModalArticulo.css"
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
  const URL_BASE=process.env.REACT_APP_URL_BASE;
  const API_SPA_CST1=process.env.REACT_APP_API_SPA_CST1;
  const API_SPA_CST2=process.env.REACT_APP_API_SPA_CST2;
  export const ModalArticulo =({ open,
     onClose,
     onSubmit,
     onEdit,
     subfamData,
     bodegaData,
     familiaData,
     inicial,
     tableData,
     titulomod,
     deshabilitado,
     valuePeriodo}) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const {user} = useContext(AuthContext);
    const { token } = user;

    const [checkedProduccion, setCheckedProduccion] = useState(false);  


    //para filtrar la subfamilia
    const [valuesSubfamfilter, setvaluesSubfamfilter] = useState([]);
     //validando  custom
    const [valuesIguala, setvaluesIguala] = useState('');  
    const [valuesfamilia,setValuesfamilia]= useState('');
    const [upLoading,setUpLoading]  = useState(false);
    const [urlImagen, setUrlImagen] = useState('');   
    const [files, setFiles] = useState([]);
   
    const [valuesventasdelmes, setValuesventasdelmes] = useState("");  
    const [valuesventasacumuladas,setValuesventasacumuladas]=useState("");
   
    const [valuescunipromedio,setValuescunipromedio]=useState("");
    const [valuescunitmayor,setValuescunitmayor]=useState("");
    const [valuescostostock,setValuescostostock]=useState("");
    const [valuescostototal,setValuescostototal]=useState("");

    const [valuescomprasdelmes,setValuescomprasdelmes]=useState("");
    const [valuescomprasacumuladas,setValuescomprasacumuladas]=useState("");

    const [checkedpreventa, setCheckedPreventa] = useState(false);
    const [checkedbase, setCheckedBase] = useState(false);
    const [errorPrueba, setErrorPrueba] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [valuessubfam, setValuessubfam] = useState("");
    const [valuesbodega, setValuesbodega] = useState("");   
 
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
          (value && value.substring(0, 4)  === valuesIguala) ||
          createError({ path, message: errorMessage })
        );
      });
    });

    const checkoutSchema = yup.object().shape({

      codigo: yup.string().required("required").length(7)
      .codigoiguala(`debe empezar igual a ${valuesIguala}` )
      .solonum("solo numeros").newexiste("New ya existe" )
      .modexiste("Mod ya existe"),
      descripcion: yup.string().required("required"),
      codigodebarra:yup.string().required("required"),
      unidaddemedida:yup.string().required("required"),
      ubicacion:yup.string().required("required"),
      preciodeventa:yup.number().required("required"),
      precio:yup.number().required("required"),
      costopromedio:yup.number().required("required"),
      maximodescuento:yup.number().required("required"),
      stockmin:yup.number().required("required"),
      stockmax:yup.number().required("required"),
      tasaila:yup.number().required("required"),
      subfamilia_articulo: yup.string("Enter subfam").required("is required"),

      bodega: yup.string("Enter bodega").required("is required"),
  
    });

   

    const formik = useFormik({
      
      initialValues:initValues,
      validationSchema: checkoutSchema ,
      onSubmit: async (values) => {

        const cloudUrl=process.env.REACT_APP_URL_IMG;
        const formData=new FormData();
        formData.append('upload_preset','react-faster');
        formData.append('file',files[0]);
        
        values.produccioninterna=checkedProduccion;

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
        }

        formik.resetForm();
 
      },
    });

    const setValueFamiliaRel=(laid)=>{
      setValuesfamilia(getRelacion(subfamData,laid).familiaarticulo.descripcion);
      //console.log(getRelacion(subfamData,laid));
    };

    const setValidacionCodigo=(vnombre)=>{
      const idsubfam=subfamData.find(element=>element.descripcion===vnombre);
      console.log("subfam seleccionada ",idsubfam);
     
      setValueFamiliaRel(idsubfam.id);
    };

    const handleChangeSub=  event => {
      const vnombre=event.target.value;

      console.log(event);
      setValuessubfam(vnombre);
      
      formik.setFieldValue("subfamilia_articulo", vnombre);

      const idsubfam=subfamData.find(element=>element.descripcion===vnombre);
      console.log("subfam seleccionada ",idsubfam);


      setvaluesIguala(idsubfam.codigo);
      if (inicial.id === "new" ){
        formik.setFieldValue("codigo",idsubfam.codigo+getCodigoSiguiente(idsubfam.siguientecodigo));
        formik.setFieldValue("codigodebarra", idsubfam.codigo+getCodigoSiguiente(idsubfam.siguientecodigo));
      
      };  
      setValidacionCodigo(vnombre);
      
    };


    const getCodigoSiguiente=(sigte)=>{
      console.log("siguiente ",sigte); 

      //const sigteStr=sigte.toString();
      const sfolio=`000${sigte}`;

      return sfolio.substr(sfolio.length - 3); 

      //return ;
    };    

    const handleChangeBod=  event => {

      const vnombre=event.target.value;
      console.log(event);
      setValuesbodega(vnombre);
      formik.setFieldValue("bodega", vnombre);
      
    };

    const getSubFamByCodeFam=(code ='',arr)=>{

        if (code===''){
          return [];
        }
        
        return arr.filter(subfam=>subfam.familiaarticulo.descripcion===code);
    };

    const handleChangeFam=  event => {
      const vnombre=event.target.value;
      
      formik.setFieldValue("subfamilia_articulo","");

      console.log("familia seleccionada :",vnombre);
      

      setValuesfamilia(vnombre);

      setvaluesSubfamfilter(getSubFamByCodeFam(vnombre,subfamData));

     
      
    };

    const handleChangeCheckPreven = (event) => {
      const valor=event.target.checked;
      setCheckedPreventa(valor);
      formik.setFieldValue("modificapreciodeventa",valor);
    };

    const handleChangeCheckBase = (event) => {
      const valor=event.target.checked;
      setCheckedBase(valor);
      formik.setFieldValue("base",valor);
    };


    const handleCodigoChange = (event) => {
      formik.handleChange(event);

      console.log(event.target.value);
      
      if(valueIdyup.id === "new"){
           console.log("validando");
           formik.setFieldValue("codigodebarra",event.target.value);

          if (event.target.value.length === 6 && existeCodigoYup(event.target.value,valueIdyup,tableData)){
            setErrorPrueba(true);
            setErrorText(`Ya existe ${event.target.value}`);
          }else{
            setErrorPrueba(false);
            
          }
         
      }

    };

    const getCompraArticulo= async(idArticulo)=>{
      console.log("getCompraArticulo ",idArticulo,valuePeriodo)
      const urlapicst  = `${URL_BASE}${API_SPA_CST1}${valuePeriodo}${API_SPA_CST2}${idArticulo}`;
      let valorCompraMes=0;
      let valorCompraAcumulada=0;
      await axios
      .get(urlapicst, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then(({ data }) => {
          //no existe , agrega actualiza
          console.log("data ", data.data);
          if (data.data.length > 0){
            console.log("compras data ",data.data[0].compras);
            valorCompraMes=data.data[0].compras;
            valorCompraAcumulada=data.data[0].comprasacumuladas;
             return; 
          };
  
      })
      .catch((error) => {
        console.log("error")
        setErrorPrueba(true)
        setErrorText(JSON.stringify(error))
  
      }).finally(function()
      {
        setValuescomprasdelmes("$".concat(Intl.NumberFormat('en-US').format(valorCompraMes)));
        
        //muestra todo 
        setValuescomprasacumuladas("$".concat(Intl.NumberFormat('en-US').format(valorCompraAcumulada+valorCompraMes)));
        console.log('finally')
       });
        
  };

  const handleChangeCheckProduccion= (event) => {
   
    setCheckedProduccion(event.target.checked);
    //formik.setFieldValue("produccioninterna", event.target.checked);

  };  


    useEffect(() => {
      console.log("Valores iniciales =====>",inicial);
       //arreglar 20240819
       //getCompraArticulo(inicial.id);
  
      formik.setFieldValue("id", inicial.id);
      formik.setFieldValue("codigo", inicial.codigo);
      formik.setFieldValue("descripcion", inicial.descripcion);
      formik.setFieldValue("codigodebarra", inicial.codigodebarra);
      formik.setFieldValue("unidaddemedida", inicial.unidaddemedida);
      formik.setFieldValue("codigoproveedor", inicial.codigoproveedor);
      formik.setFieldValue("ubicacion", inicial.ubicacion);
      formik.setFieldValue("preciodeventa",inicial.preciodeventa);
      formik.setFieldValue("precio",inicial.precio);     
      formik.setFieldValue("costopromedio",inicial.costopromedio);
      formik.setFieldValue("maximodescuento",inicial.maximodescuento);
      formik.setFieldValue("modificapreciodeventa",inicial.modificapreciodeventa);
      formik.setFieldValue("stockmin",inicial.stockmin);
      formik.setFieldValue("stockmax",inicial.stockmax);
      formik.setFieldValue("tasaila",inicial.tasaila);

      formik.setFieldValue("fechaultimaventa",inicial.fechaultimaventa);
      formik.setFieldValue("fechacumayor",inicial.fechacumayor);
      formik.setFieldValue("fechaultimacompra",inicial.fechaultimacompra);

      formik.setFieldValue("familia",valuesfamilia);

      formik.setFieldValue("subfamilia_articulo",inicial.subfamilia_articulo.descripcion);
      
      formik.setFieldValue("bodega",inicial.bodega.descripcion);
      formik.setFieldValue("base",inicial.base);
      formik.setFieldValue("urlimagen", inicial.urlimagen);
  
      setCheckedProduccion(inicial.produccioninterna);

      setValuesfamilia("");
      setValuessubfam(inicial.subfamilia_articulo.descripcion);
      setValuesbodega(inicial.bodega.descripcion);

      setCheckedPreventa(inicial.modificapreciodeventa);
      setCheckedBase(inicial.base);

      setValuesventasdelmes( "$".concat(Intl.NumberFormat('en-US').format(inicial.ventasdelmes)));
      setValuesventasacumuladas( "$".concat(Intl.NumberFormat('en-US').format(inicial.ventasacumuladas)));
      
      setValuescunipromedio( Intl.NumberFormat().format(inicial.cunipromedio));
      setValuescunitmayor( Intl.NumberFormat().format(inicial.cunitmayor));
      setValuescostostock("$".concat(Intl.NumberFormat('en-US').format(inicial.costostock)));
      setValuescostototal("$".concat(Intl.NumberFormat('en-US').format(inicial.costototal)));
  
   
      setUrlImagen(inicial.urlimagen);
      setFiles([]); 
      setErrorPrueba(false);     

      setvaluesSubfamfilter(subfamData);

      if (deshabilitado ){

         setvaluesIguala(inicial.subfamilia_articulo.codigo);
        //  +
        // getRelacion(subfamData,inicial.subfamilia_articulo.id).familiaarticulo.codigo);
         setValuesfamilia(getRelacion(subfamData,inicial.subfamilia_articulo.id).familiaarticulo.descripcion)
       
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
                        id="codigodebarra"
                        name="codigodebarra"
                        label="codigo de barra"
                        autoComplete='off'
                        value={formik.values.codigodebarra}
                        onChange={formik.handleChange}
                        error={formik.touched.codigodebarra && Boolean(formik.errors.codigodebarra)}
                        helperText={formik.touched.codigodebarra && formik.errors.codigodebarra}
                      />
                      <TextField
                        fullWidth
                        margin="normal" 
                        id="codigoproveedor"
                        name="codigoproveedor"
                        label="codigo proveedor"
                        autoComplete='off'
                        value={formik.values.codigoproveedor}
                        onChange={formik.handleChange}
                        //sin validacion
                        //error={formik.touched.codigodebarra && Boolean(formik.errors.codigodebarra)}
                        //helperText={formik.touched.codigodebarra && formik.errors.codigodebarra}
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
                        id="ubicacion"
                        name="ubicacion"
                        label="ubicacion"
                        autoComplete='off'
                        value={formik.values.ubicacion}
                        onChange={formik.handleChange}
                        error={formik.touched.ubicacion && Boolean(formik.errors.ubicacion)}
                        helperText={formik.touched.ubicacion && formik.errors.ubicacion}
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
                      <TextField
                        fullWidth
                        margin="normal" 
                        type="number"
                        id="costopromedio"
                        name="costopromedio"
                        label="costo promedio"
                        value={formik.values.costopromedio}
                        onChange={formik.handleChange}
                        error={formik.touched.costopromedio && Boolean(formik.errors.costopromedio)}
                        helperText={formik.touched.costopromedio && formik.errors.costopromedio}
                      />       
                      <TextField
                        fullWidth
                        margin="normal" 
                        type="number"
                        id="tasaila"
                        name="tasaila"
                        label="tasa ila"
                        value={formik.values.tasaila}
                        onChange={formik.handleChange}
                        error={formik.touched.tasaila && Boolean(formik.errors.tasaila)}
                        helperText={formik.touched.tasaila && formik.errors.tasaila}
                      />                         
                      <Accordion defaultExpanded={false}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography color={colors.greenAccent[500]} variant="h5">
                                  Estadistica venta articulo
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

                      <Accordion defaultExpanded={false}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography color={colors.greenAccent[500]} variant="h5">
                                  Estadistica stock articulo
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                              fullWidth
                              margin="normal" 
                              id="fechacumayor"
                              name="fechacumayor"
                              label="fecha cu mayor"
                              inputProps={
                                { readOnly: true, }
                              }
                              value={dayjs(formik.touched.fechacumayor).format("YYYY-MM-DD")}
                            />
                            
                            <TextField
                              fullWidth
                              margin="normal" 
                              id="cunipromedio"
                              name="cunipromedio"
                              label="c uni promedio"
                              inputProps={
                                { readOnly: true, }
                              }
                              value={valuescunipromedio}
                            />
                            <TextField
                              fullWidth
                              margin="normal" 
                              id="cunitmayor"
                              name="cunitmayor"
                              label="c unit mayor"
                              inputProps={
                                { readOnly: true, }
                              }
                              value={valuescunitmayor}
                            />
                            <TextField
                              fullWidth
                              margin="normal" 
                              id="costostock"
                              name="costostock"
                              label="costo stock"
                              inputProps={
                                { readOnly: true, }
                              }
                              value={valuescostostock}
                            />
                            <TextField
                              fullWidth
                              margin="normal" 
                              id="costototal"
                              name="costototal"
                              label="costo total"
                              inputProps={
                                { readOnly: true, }
                              }
                              value={valuescostototal}
                            />                            
                        </AccordionDetails>
                      </Accordion>
                      <Accordion defaultExpanded={false}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography color={colors.greenAccent[500]} variant="h5">
                                  Estadistica compra articulo
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                              fullWidth
                              margin="normal" 
                              id="fechaultimacompra"
                              name="ffechaultimacompra"
                              label="fecha ultima compra"
                              inputProps={
                                { readOnly: true, }
                              }
                              value={dayjs(formik.touched.fechaultimacompra).format("YYYY-MM-DD")}
                            />
                          <TextField
                              fullWidth
                              margin="normal" 
                              id="comprasdelmes"
                              name="comprasdelmes"
                              label="compras del mes"
                              inputProps={
                                { readOnly: true, }
                              }
                              value={valuescomprasdelmes}
                            />                                
                          <TextField
                              fullWidth
                              margin="normal" 
                              id="comprasacumuladas"
                              name="comprasacumuladas"
                              label="compras acumuladas"
                              inputProps={
                                { readOnly: true, }
                              }
                              value={valuescomprasacumuladas}
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
                        error={formik.touched.subfamilia_articulo && Boolean(formik.errors.subfamilia_articulo)}
                        helperText={formik.touched.subfamilia_articulo && formik.errors.subfamilia_articulo}
                        
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
                        type="number"
                        id="maximodescuento"
                        name="maximodescuento"
                        label="maximo descuento"
                        value={formik.values.maximodescuento}
                        onChange={formik.handleChange}
                        error={formik.touched.maximodescuento && Boolean(formik.errors.maximodescuento)}
                        helperText={formik.touched.maximodescuento && formik.errors.maximodescuento}
                      />   


                      <TextField
                        fullWidth
                        margin="normal" 
                        type="number"
                        id="stockmin"
                        name="stockmin"
                        label="stock min"
                        value={formik.values.stockmin}
                        onChange={formik.handleChange}
                        error={formik.touched.stockmin && Boolean(formik.errors.stockmin)}
                        helperText={formik.touched.stockmin && formik.errors.stockmin}
                      />  

                      <TextField
                        fullWidth
                        margin="normal" 
                        type="number"
                        id="stockmax"
                        name="stockmax"
                        label="stock max"
                        value={formik.values.stockmax}
                        onChange={formik.handleChange}
                        error={formik.touched.stockmax && Boolean(formik.errors.stockmax)}
                        helperText={formik.touched.stockmax && formik.errors.stockmax}
                      /> 

                      <TextField
                        fullWidth
                        margin="normal" 
                        id="standard-select-bodega"
                        select
                        name="bodega"
                        label="bodega"
                       
                        value={valuesbodega}
                        onChange={handleChangeBod}
                        error={formik.touched.bodega && Boolean(formik.errors.bodega)}
                        helperText={formik.touched.bodega && formik.errors.bodega}
                        
                      >
                        {bodegaData.map(option => (
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
                      <FormControlLabel
                            control={
                                    <Checkbox 
                                        checked={checkedbase}
                                        onChange={handleChangeCheckBase}
                                        color="primary"
                                  />
                            }
                      label="Base"/>   

                      <FormControlLabel
                            control={
                                    <Checkbox 
                                        checked={checkedProduccion}
                                        onChange={handleChangeCheckProduccion}
                                        color="primary"
                                  />
                            }
                      label="Produccion interna"/>   


                     

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
  
  
  export default  ModalArticulo;
  