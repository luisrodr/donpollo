//import "./ModalEncabezadoDoc.css"
import { useCallback, useState, useEffect, useContext, useMemo, useRef } from 'react';
import axios from "axios";
import { useFormik } from 'formik'
import * as yup from 'yup'
import MaterialReactTable from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { v1 as uuidv1 } from 'uuid';
import { useValidation, defaultMessages, defaultRules } from 'react-simple-form-validator';

import Checkbox from "@mui/material/Checkbox";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import getPeriodo from '../helpers/getPeriodo';

import Autocomplete from '@mui/material/Autocomplete';
import { AuthContext } from "../../../mycontext";

//import Dialog from '@mui/material/Dialog';
//import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

import Select from '@mui/material/Select';
import getFechaInicioProceso from "../helpers/getFechaInicioProceso";
import runCierreReport0 from "../helpers/runCierreReport0";

//import DialogIlaModalEncabezado from '../../faster/modal/dialog/DialogIlaModalEncabezado';


import {
  Delete,
  Add,
  DocumentScannerRounded,
  BlenderRounded,
  Filter1,
  LocalDiningRounded,
  ShoppingCartCheckoutRounded,
  // TextSnippetRounded,
  TextSnippetOutlined,
  SoupKitchen,
  //OnlinePrediction
} from '@mui/icons-material';

//import { top100Films} from '../../../data/makeDataCrud';
//import { bodegas} from '../../../data/makeDataCrud';
//import { proveedores} from '../../../data/makeDataCrud';
//import { centroproduccion} from '../../../data/makeDataCrud';
//import { centroconsumo} from '../../../data/makeDataCrud';
//cambia tamaño de textfield
// inputProps={{style: {fontSize: 24}}} // 14 deafult font size of input text
// InputLabelProps={{style: {fontSize: 40}}} // font size of input label

//import { inicialProducto} from '../../../data/makeDataCrud';
import { inicialDocumento } from '../../../data/makeDataCrud';

import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  //DialogContent,
  /// DialogTitle,
  IconButton,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';

import { onlyNumbers } from '../helpers/funcYup';
import getDateMasDias from '../helpers/getDateMasDias';


const tiva = 19;


yup.addMethod(yup.string, "solonum", function (errorMessage) {
  return this.test(`test-codigo solo num`, errorMessage, function (value) {
    const { path, createError } = this;

    return (
      (value && onlyNumbers(value)) ||
      createError({ path, message: errorMessage })
    );
  });
});


const URL_BASE = process.env.REACT_APP_URL_BASE;
const API_FIL1 = process.env.REACT_APP_API_SEL_FUD_FIL1;
const API_FIL2 = process.env.REACT_APP_API_SEL_FUD_FIL2;
//const API_SEL_DOC=process.env.REACT_APP_API_SID_DOC;

const API_SEL_EDO_PRO=process.env.REACT_APP_API_SEL_EDO_PRO;
const API_SEL_EDO_DOC=process.env.REACT_APP_API_SEL_EDO_DOC;
const API_SEL_EDO_FOL=process.env.REACT_APP_API_SEL_EDO_FOL;

const API_SEL_EDO=process.env.REACT_APP_API_SEL_EDO;

const optionsPrecio = [

  'Precio',
  'Total'

];

// const listaIla= [
//   { nomila: 'vino1', tasa: 10 },
//   { nomila: 'vino2',   tasa: 10.5 },
//   { nomila: 'vino3', tasa: 10.6 },
//   { nomila: 'vino4',tasa: 10.7 },
//   { nomila: 'vino5', tasa: 10.8 },
// ];

export const ModalEncabezadoDoc = ({

  open,
  onClose,
  onSubmit,
  onEdit,
  inicial,
  //tableData,
  titulomod,
  deshabilitado,
  ofProgress,
  inicialDocumentos,
  inicialProveedores,
  inicialCentroProduccion,
  inicialCentroConsumo,
  inicialBodega,
  inicialArticulo,
  inicialProducto,
  inicialTablaIla,
  swVista,
  setSwVista,
  valorMesProceso,
  valueDiasadicionalperiodoactual,
  valorMesAnterior ,
  valueCierre,
  valueMovimientosPeriodo,
  valueComportamiento}) => {
  const { user } = useContext(AuthContext);
  const { token } = user;

  const [isRefetching] = useState(false);
  const [isLoading] = useState(false);
  const [errorPrueba, setErrorPrueba] = useState(false);
  const [errorUserDocumento, seterrorUserDocumento] = useState(false);
  const [valueUserDocumento, setValueUserDocumento] = useState({});


  const [errorText, setErrorText] = useState("");
  const [initValues] = useState(inicial);
  //const [valueIdyup,setValueIdyup] = useState(''); 
  //global
  const [valueDate, setValueDate] = useState(dayjs(new Date()));

  const [valueVencimiento, setValueVencimiento] = useState(dayjs(new Date()));

  const [valueFolioInternoDocumento, setValueFolioInternoDocumento] = useState("");
  const [valueInputProveedor, setValueInputProveedor] = useState([]);
  const [valueInputDocumentoActual, setValueInputDocumentoActual] = useState([]);
  const [valueFolioDocumentoActual, setValueFolioDocumentoActual] = useState('');

  const [valueInputDocumentoRelacionado, setValueInputDocumentoRelacionado] = useState([]);
  const [valueFolioDocumentoRelacionado, setValueFolioDocumentoRelacionado] = useState('');

  const [valueInputCentroProduccion, setValueInputCentroProduccion] = useState([]);
  const [valueInputCentroConsumo, setValueInputCentroConsumo] = useState([]);
  const [valueGlobalDescuentoLinea, setValueGlobalDescuentoLinea] = useState(0);
  const [valueGlobalDescuento, setValueGlobalDescuento] = useState(0);
  const [valueGlobExento, setGlobExento] = useState(0);
  const [valueGlobalNeto, setValueGlobalNeto] = useState(0);
  const [valueGlogIva, setGlobIva] = useState(0);
  const [valueGlobIla, setGlobIla] = useState(0);
  const [valueGlobRetencion, setGlobRetencion] = useState(0);
  const [valueGlobRecargo, setGlobRecargo] = useState(0);
  const [valueGlobRecargoLinea, setGlobRecargoLinea] = useState(0);
  const [valueGlobTotal, setGlobTotal] = useState(0);
  const [valueGlobTotalFormat, setGlobTotalFormat] = useState('');
  const [valueInputBodEncabezado, setValueInputBodEncabezado] = useState(inicialBodega[0]);
  const [listaDocumentosRelacionados, setListaDocumentosRelacionados] = useState(inicialDocumentos)


  //tabla
  const [checked, setChecked] = useState(true);
  const [valueAfecto, setValueAfecto] = useState('afecto');
  const [valueCantidad, setValueCantidad] = useState(0);
  const [valuePrecio, setValuePrecio] = useState(0);
  const [valueNeto, setValueNeto] = useState(0);
  const [valueDescuentoLinea, setValueDescuentoLinea] = useState(0);
  const [valueRecargoLinea, setValueRecargoLinea] = useState(0);
  const [valueRetencionLinea, setValueRetencionLinea] = useState(0);
  const [valueIla, setValueIla] = useState(0);
  const [valueTasaIla, setValueTasaIla] = useState(0);
  const [valueTasaIlaLabel, setValueTasaIlaLabel] = useState('');
  const [valueMov, setValueMov] = useState([]);

  const [valueArticulo, setValueArticulo] = useState('');
  const [inputArticulo, setInputValueArticulo] = useState([]);
  const [valueProducto, setValueProducto] = useState('');
  const [inputProducto, setInputValueProducto] = useState([]);
  const [valueBodega, setValueBodega] = useState('');
  const [valueInputBod, setValueInputBod] = useState([]);


  //dialogo precio
  const [openDialogDetallePrecio, setOpenDialogDetallePrecio] = useState(false);
  const [valueDialogPrecio, setValueDialogPrecio] = useState('Precio');
  const radioGroupRef = useRef(null);
  const [valorDialogoPrecio, setValorDialogoPrecio] = useState(0);
  const inputRefNeto = useRef(null);

  //vista columnas detalle
  const [columnVisibility, setColumnVisibility] = useState({});
  const [editaPrecio, setEditaPrecio] = useState(false);
  
  //dialogo de Saldo
  const [openDialogSaldo, setOpenDialogSaldo] = useState(false);

  //const [ handleCloseDialogSaldo, setHandleCloseDialogSaldo ]= useState(false);
    


  //dialogo de Ila
  const [openDialogDetalleIla, setOpenDialogDetalleIla] = useState(false);
  //const [valueNila, setValueNila] = useState(listaIla[0]);
  const [valorDialogoTasaIla, setValorDialogoTasaIla] = useState(0);
  const [valorDialogoIla, setValorDialogoIla] = useState(0);

  const [validaNegativoProduccion, setValidaNegativoProduccion] = useState(true);

  //validaciones movimiento
  const customRules = {
    ...defaultRules,
    cantidadmayora0: () => valueCantidad > 0,
    preciomayora0: () => valuePrecio > 0,
    netomayora0: () => valueNeto > 0,
    ilamayoroiguala0: () => valueIla >= 0,
    descuentomayoriguala0: () => valueDescuentoLinea >= 0,
    recargomayoriguala0: () => valueRecargoLinea >= 0,
  };
 
  const { isFieldInError, getErrorsInField, isFormValid } = useValidation({
    fieldsRules: {
      valueProducto: { required: swVista.swDetalleProducto },
      valueArticulo: { required: swVista.swDetalleArticulo },
      valueBodega: { required: swVista.swDetalleBodega },
      valueCantidad: {
        required: true, hasNumber: true,
        cantidadmayora0: !validaNegativoProduccion,
      },
      valuePrecio: {
        required: true,
        hasNumber: true,
        preciomayora0: true
      },
      valueNeto: {
        required: swVista.DetalleNeto,
        hasNumber:true,
        netomayora0:  !validaNegativoProduccion
      },
      valueIla: {
        required: swVista.DetalleIla,
        numbers: true,
        ilamayoroiguala0: true
      },
      valueDescuentoLinea: {
        required: swVista.DetalleDescuento,
        numbers: true,
        descuentoiguala0: true
      },
      valueRecargoLinea: {
        required: swVista.DetalleRecargo,
        numbers: true,
        recargoiguala0: true
      },
    },
    state: {
      valueProducto,
      valueArticulo,
      valueBodega,
      valueCantidad,
      valuePrecio,
      valueNeto,
      valueIla,
      valueDescuentoLinea,
      valueRecargoLinea
    },
    rules: customRules,
    messages: {
      en: {
        ...defaultMessages.en,
        required: "campo requerido!!!!!",
        numbers: "debe ser numerico!!!!!",
        cantidadmayora0: "cantidad debe ser mayor a 0!!!",
        preciomayora0: "precio debe ser mayor a 0!!!",
        netomayora0: "neto debe ser mayor a 0!!!",
        ilamayoroiguala0: "Ila debe ser mayor o igual  a 0!!!",
        descuentomayoriguala0: "descuento debe ser mayor o igual  a 0!!!",
        recargomayoriguala0: "recargo debe ser mayor o igual  a 0!!!",
      },
    }

  });

  const checkoutSchema = yup.object().shape({
    documentoactual: yup.string().required("required"),
    foliodocumentoactual: yup.string().required("required").solonum("solo numeros"),
    proveedor: yup.string().required("required"),
    centroproduccion: yup.string().required("required"),
    centroconsumo: yup.string().required("required"),
    bodegaenc: yup.string().required("required"),
    documentorelacionado: yup.string().required("required"),
    foliodocumentorelacionado: yup.string().required("required").solonum("solo numeros"),
  });

  const getValidPeriodo=()=>{

    const numeroPeridoFecha=Number(dayjs(valueDate).format('YYYY-MM-DD').substring(0,7).replace("-",""));
    const numeroPeriodoProceso=Number(valorMesProceso);
 
    return  numeroPeridoFecha >= numeroPeriodoProceso  ?   true : false;
   };

  const grabaTodo=(values)=>{
    if (errorUserDocumento) {
      return;
    };

    distribucionRecargoGlobal();

    if (values.id === "new") {

      if (valueMov.length === 0) {

        setErrorPrueba(true);
        setErrorText("sin movimientos");

        return;
      };
      if (!getValidPeriodo()){
        setErrorPrueba(true);
        setErrorText(`Periodo de documento debe ser mayor o igual al de proceso ${valorMesProceso}`);
         return;  
      };

      const fIniProceso=getFechaInicioProceso(valorMesProceso);
      const fLimite=getDateMasDias(fIniProceso,valueDiasadicionalperiodoactual);

      if(Date.parse(fLimite) < Date.parse(valueDate.format("YYYY-MM-DD"))){
        setErrorPrueba(true);
        setErrorText(`Fecha de documento mayor a fecha limite de ingreso ${fLimite}`);
        return;
      };

      valueMov.forEach((item) => {
        console.log("submit datosagrabar", item);

      });

      console.log("valueUserDocumento:", valueUserDocumento);
      
      const datosagrabar = {
        fechadoc: valueDate.format("YYYY-MM-DD"),
        periodo: getPeriodo( valueDate.format("YYYY-MM-DD")),
        vencimiento: valueVencimiento.format("YYYY-MM-DD"),
        documento: valueInputDocumentoActual,
        foliodoc: valueFolioDocumentoActual,
        proveedor: swVista.swEncabezadoProveedor ? valueInputProveedor : {},
        centroproduccion: swVista.swEncabezadoCentroProduccion ? valueInputCentroProduccion : {},
        centroconsumo: swVista.swEncabezadoCentroConsumo ? valueInputCentroConsumo : {},
        bodega: swVista.swEncabezadoBodega ? valueInputBodEncabezado : {},
        neto: valueGlobalNeto,
        exento: valueGlobExento,
        total: valueGlobTotal,
        siva: valueGlogIva,
        sila: valueGlobIla,
        sretencion: valueGlobRetencion,
        sdescuento: valueGlobalDescuentoLinea,
        descuentoglobal: valueGlobalDescuento,
        documentosrelacionado: swVista.swEncabezadoDocumentoRelacionado ? valueInputDocumentoRelacionado : {},
        foliodocrel: valueFolioDocumentoRelacionado,
        srecargo: valueGlobRecargoLinea,
        recargoglobal: valueGlobRecargo,
        movimientodocs: [...valueMov],
        foliointerno: Number(valueUserDocumento[0].siguiente),
        idfoliointerno: valueUserDocumento[0].id

      };

      onSubmit(datosagrabar);
      console.log("a grabar ", datosagrabar)
      onClose();

      //actualizar siguiente folio de documento
      formik.resetForm();
      /////////////// 

    } else {

      //////////////submit 
      console.log("formik edit============>");
      console.log(values);
      onEdit(values);
      onClose();
      formik.resetForm();
      /////////////// 
    };

  } ;

  
  const formik = useFormik({
    initialValues: initValues,
    validationSchema: checkoutSchema,

    onSubmit: async (values) => {
      if(swVista.swEncabezadoDocumentoRelacionado){

            const urlapiusrdoc = `${URL_BASE}${API_SEL_EDO}${API_SEL_EDO_PRO}${valueInputProveedor.id}${API_SEL_EDO_DOC}${valueInputDocumentoRelacionado.id}${API_SEL_EDO_FOL}${valueFolioDocumentoRelacionado}`;

            console.log("url ",urlapiusrdoc);
        
            await axios
            .get(urlapiusrdoc, {
              headers: {
                Authorization: `Bearer  ${token}`
              }
            })
            .then(({ data }) => {
        
                  if (data.data.length>0){
                      console.log("hay consulta docu proveedor ", data.data);
                      grabaTodo(values);
                      return true;
                    };
        
                  console.log("documento relacionado no pertenece al proveedor!!!!!! " , data.data);
                  //seterrorUserDocumento(true);
                  setErrorPrueba(true);
                  setErrorText("documento relacionado no pertenece al proveedor !!!! ");
          
                  
                  return false;
        
                  })
            .catch((error) => {
        
            // seterrorUserDocumento(true);
              setErrorPrueba(true);
              setErrorText(JSON.stringify(error));

              console.log("error ....documento relacionado !!!! ",JSON.stringify(error));
              return false;
        
            });
       
      }else{
        console.log("no hay validacion de docu relacionado...");
        grabaTodo(values);
      };

     

      // if (errorUserDocumento) {
      //   return;
      // };

      // distribucionRecargoGlobal();

      // if (values.id === "new") {

      //   if (valueMov.length === 0) {

      //     setErrorPrueba(true);
      //     setErrorText("sin movimientos");

      //     return;
      //   };
      //   if (!getValidPeriodo()){
      //     setErrorPrueba(true);
      //     setErrorText(`Periodo de documento debe ser mayor o igual al de proceso ${valorMesProceso}`);
      //      return;  
      //   };

      //   const fIniProceso=getFechaInicioProceso(valorMesProceso);
      //   const fLimite=getDateMasDias(fIniProceso,valueDiasadicionalperiodoactual);

      //   if(Date.parse(fLimite) < Date.parse(valueDate.format("YYYY-MM-DD"))){
      //     setErrorPrueba(true);
      //     setErrorText(`Fecha de documento mayor a fecha limite de ingreso ${fLimite}`);
      //     return;
      //   };

      //   valueMov.forEach((item) => {
      //     console.log("submit datosagrabar", item);

      //   });

      //   console.log("valueUserDocumento:", valueUserDocumento);
        
      //   const datosagrabar = {
      //     fechadoc: valueDate.format("YYYY-MM-DD"),
      //     periodo: getPeriodo( valueDate.format("YYYY-MM-DD")),
      //     vencimiento: valueVencimiento.format("YYYY-MM-DD"),
      //     documento: valueInputDocumentoActual,
      //     foliodoc: valueFolioDocumentoActual,
      //     proveedor: swVista.swEncabezadoProveedor ? valueInputProveedor : {},
      //     centroproduccion: swVista.swEncabezadoCentroProduccion ? valueInputCentroProduccion : {},
      //     centroconsumo: swVista.swEncabezadoCentroConsumo ? valueInputCentroConsumo : {},
      //     bodega: swVista.swEncabezadoBodega ? valueInputBodEncabezado : {},
      //     neto: valueGlobalNeto,
      //     exento: valueGlobExento,
      //     total: valueGlobTotal,
      //     siva: valueGlogIva,
      //     sila: valueGlobIla,
      //     sretencion: valueGlobRetencion,
      //     sdescuento: valueGlobalDescuentoLinea,
      //     descuentoglobal: valueGlobalDescuento,
      //     documentosrelacionado: swVista.swEncabezadoDocumentoRelacionado ? valueInputDocumentoRelacionado : {},
      //     foliodocrel: valueFolioDocumentoRelacionado,
      //     srecargo: valueGlobRecargoLinea,
      //     recargoglobal: valueGlobRecargo,
      //     movimientodocs: [...valueMov],
      //     foliointerno: Number(valueUserDocumento[0].siguiente),
      //     idfoliointerno: valueUserDocumento[0].id

      //   };

      //   onSubmit(datosagrabar);
      //   console.log("a grabar ", datosagrabar)
      //   onClose();

      //   //actualizar siguiente folio de documento
      //   formik.resetForm();
      //   /////////////// 

      // } else {

      //   //////////////submit 
      //   console.log("formik edit============>");
      //   console.log(values);
      //   onEdit(values);
      //   onClose();
      //   formik.resetForm();
      //   /////////////// 
      // }

    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,

        size: 80,
      },
      {
        accessorKey: 'producto.descripcion',
        header: 'producto',
        size: 150,

      },
      {
        accessorKey: 'articulo.descripcion',
        header: 'articulo',
        size: 150,

      },

      {
        accessorKey: 'bodega.descripcion',
        header: 'bodega',
        size: 60,

      },
      {
        accessorKey: 'cantidad',
        header: 'cantidad',
        size: 30,

      },
      {
        accessorKey: 'precio',
        header: 'precio',
        size: 30,

      },
      {
        accessorKey: 'exento',
        header: 'exento',
        size: 30,

      },
      {
        accessorKey: 'neto',
        header: 'neto',
        size: 30,

      },
      {
        accessorKey: 'descuento',
        header: 'descuento',
        size: 60,

      },
      {
        accessorKey: 'tila',
        header: 'ila',
        size: 60,

      },

      {
        accessorKey: 'recargo',
        header: 'recargo',
        size: 60,

      },

      {
        accessorKey: 'recargoglobal',
        header: 'recargoglobal',
        size: 60,

      },
      {
        accessorKey: 'costounitario',
        header: 'costounitario',
        size: 60,

      },
      {
        accessorKey: 'costototal',
        header: 'costototal',
        size: 60,

      },
      {
        accessorKey: 'retencion',
        header: 'retencion',
        size: 60,

      },
    ],
    [],
  );

  const iniciaVistaColumnaDetalle = () => {
    setColumnVisibility({
      id: false,
      exento: false,
      'producto.descripcion': false,
      'articulo.descripcion': false,
      'bodega.descripcion': false,
      neto: false,
      tila: false,
      descuento: false,
      recargo: false,
    });

  };

  const handleDeleteRow = useCallback(

    (row) => {
      console.log(row);
      setValueCantidad(row.getValue('cantidad'));
      setValuePrecio(row.getValue('precio'));

      setValueIla(row.getValue('tila'));
      setValueDescuentoLinea(row.getValue('descuento'))
      setValueRecargoLinea(row.getValue('recargo'));

      if (row.getValue('neto')) {
        setValueNeto(row.getValue('neto'));
        setChecked(true);
      } else {
        setValueNeto(row.getValue('exento'));
        setChecked(false);
      };

      const vArticulo = inicialArticulo.find(({ descripcion }) => descripcion === row.getValue('articulo.descripcion'));

      setInputValueArticulo(vArticulo);

      setValueTasaIlaLabel(`Ila %${setInputValueArticulo.tasaila}`);

      setValueInputBod(inicialBodega.find(({ descripcion }) => descripcion === row.getValue('bodega.descripcion')));

      valueMov.splice(row.index, 1);
      setValueMov([...valueMov]);
      handleSumaGlobalesDetalle();

    },
    [valueMov, inicialBodega, inicialArticulo],
  );


  //distribuye cargo global en las lineas 
  const distribucionRecargoGlobal = () => {
    if (valueGlobRecargo > 0) {
      console.log("distribuyendo cargo global...")
      //100% para del factor de distribucion //agregar la retencion del 5%  carnes
      const costoTotalGlobal = Number(valueGlobTotal) - Number(valueGlobRecargo) - Number(valueGlogIva) - Number(valueGlobIla);

      console.log("distribuyendo cargo global ...", costoTotalGlobal)

      let sumDistCargoGlobal = 0;

      //distribuye el gasto global por linea
      valueMov.forEach((elemento) => {


        const costoTotLinea = (Number(elemento.neto) +
          Number(elemento.exento) +
          Number(elemento.recargo) -
          Number(elemento.descuento)
        );

        console.log("Number(elemento.neto)", Number(elemento.neto));
        console.log("Number(elemento.exento)", Number(elemento.exento));
        console.log("Number(elemento.recargo)", Number(elemento.recargo));
        console.log("Number(elemento.descuento)", Number(elemento.descuento));


        console.log("costoTotLinea ", costoTotLinea);


        const factorDist = Number(costoTotLinea) / Number(costoTotalGlobal);

        console.log("factorDist ", factorDist);

        const recargoGlolinea = Math.round(Number(valueGlobRecargo) * factorDist);

        console.log("recargoGlolinea ", recargoGlolinea);

        elemento.recargoglobal = recargoGlolinea;

        sumDistCargoGlobal = sumDistCargoGlobal + recargoGlolinea;

      });


      //agrega diferencia a el primer registro
      const diferenciaAjuste = Number(valueGlobRecargo) - Number(sumDistCargoGlobal);
      valueMov.forEach((elemento) => {
        elemento.recargoglobal = Number(elemento.recargoglobal) + diferenciaAjuste;
        //solo el primero
        return;

      });

      //recalcula costo total y unitario 
      valueMov.forEach((elemento) => {

        const ctotal = (Number(elemento.neto) +
          Number(elemento.exento) +
          Number(elemento.recargo) +
          Number(elemento.recargoglobal)) -
          Number(elemento.descuento);

        elemento.costounitario = ctotal / Number(elemento.cantidad);
        elemento.costototal = ctotal;

      });
      setValueMov([...valueMov]);

    };
  };


  const haySaldoNegativo=async ()=>{
    if (valueInputDocumentoActual.ensa==="S"){
          console.log(" evaluando  haySaldoNegativo ");  
          let swRespuesta=false;
          let txtArticulo="";

          //for (const ele of values.movimientodocs) {

            const tableDataArticulo=inicialArticulo.filter((element) => element.id===inputArticulo.id);

            await Promise.all([
         
             runCierreReport0(
               valorMesAnterior,
               valorMesProceso,
                tableDataArticulo,
               //inputArticulo,
               valueCierre,
               valueMovimientosPeriodo)]).
         
             then(result=>{
         
              // console.log("termina la promesa runCierreReport0 s ======>",result)
             
                      let sUnidad=result[0][0][0].saldounitario;
                      
                      console.log("saldo unidad ========> sUnidad ",sUnidad );
                      // console.log("item.unidad ",Number(item.cantidad));
         
               if (  Number(sUnidad) <  Number(valueCantidad) ){;
                   console.log("Saldo insuficiente para calculo de Precio Promedio"   ,inputArticulo.descripcion);
 
                   txtArticulo=`Articulo :  ${inputArticulo.descripcion}`;
           
                   swRespuesta=true;
              
               };
             });
            
          //};

          return {respuesta:swRespuesta,texto:txtArticulo};
    };

    console.log("haySaldoNegativo  no se evalua saldo");

    return false;
  };


  const handleSaveMov = () => {

   

    console.log("agregando  valuemov   ======>",valueMov);
    console.log("el articulo ",inputArticulo);  


    if (inputArticulo){
        //console.log("buscando articulo  ======>",valueMov.findIndex(element => element.articulo.id === inputArticulo.id));

        if (valueMov.findIndex(element => element.articulo.id === inputArticulo.id)>-1){
          setErrorPrueba(true);
          setErrorText(`Articulo ya ingresado  ${inputArticulo}`);
          return ;

        }; 
    };




    Promise.all([haySaldoNegativo()]).
    then(result=>{   
              console.log("result ",result); 
              console.log("proceso de promesa finalizado ",result[0].respuesta);  
              console.log("ahora a grabar .....");
         
              //es entrada siempre graba
              if (valueInputDocumentoActual.ensa==="E"){

                
                  grabaMovimiento();
                  return;
              };

              //es salida y no hay saldo negativo
              if (!result[0].respuesta){
               
                  grabaMovimiento();
                  return;
              };

              //es salida y hay saldo negativo
              //sin comportamiento , graba siempre     
              if(!valueComportamiento.length>0){
                console.log("no hay caracteres...... agrega.......");
                grabaMovimiento();
                return;
              };

              //con N no se graba si hay saldo negativo
              if (valueComportamiento.indexOf("N")>-1){
                console.log("Tiene N , no se graba si hay saldo negativo");

                setErrorPrueba(true);
                setErrorText(`No se puede agregar , saldo negativo ! ${result[0].texto}`);

                return ;
              };

              //con n Existen saldo negativo. quiere grabar de todos modos?
              if (valueComportamiento.indexOf("n")>-1){
                    //setea dialogo que pregunta si graba de todos modos  

                    setOpenDialogSaldo(true);

              
                   return ;
              };  
    });

   //return;
  };

  const grabaMovimiento=()=>{ 

    const vctotal = (valueNeto + Number(valueRecargoLinea) - Number(valueDescuentoLinea));
    const vcunit = vctotal / Number(valueCantidad);

    const nuevo = {
      id: uuidv1(),
      //agregar producto predeterminado para evitar error
      producto: swVista.swDetalleProducto ? inputProducto : inicialProducto,
      articulo: inputArticulo ? inputArticulo : inicialArticulo,
      bodega: valueInputBod,
      cantidad: valueCantidad,
      precio: valuePrecio,
      exento: !checked ? valueNeto : 0,
      neto: checked ? valueNeto : 0,
      tila: valueIla ? valueIla : 0,
      retencion: valueRetencionLinea ? valueRetencionLinea : 0,
      descuento: valueDescuentoLinea ? valueDescuentoLinea : 0,
      recargo: valueRecargoLinea ? valueRecargoLinea : 0,

      //dato estadistico
      costounitario: valueCantidad > 0 ? vcunit : 0,
      // recargoglobal:
      costototal: vctotal,

    };

    valueMov.push(nuevo);
    setValueMov([...valueMov]);

    console.log("movimiento agregado...");
    setDetalleReset();
    handleSumaGlobalesDetalle();
  };




  const handleSumaGlobalesDetalle = () => {
    //  console.log("handleSumaGlobalesDetalle valueMov",valueMov)

    let sexe = 0;
    let snet = 0;
    let sila = 0;
    let sdesc = 0;
    let sreca = 0;
    let srete = 0
    valueMov.forEach((item) => {
      if (item.exento) {
        sexe = sexe + Number(item.exento);
      };

      snet = snet + item.neto;

      if (item.tila) {
        sila = sila + Number(item.tila);
      };

      if (item.descuento) {
        sdesc = sdesc + Number(item.descuento);
      };

      if (item.recargo) {
        sreca = sreca + Number(item.recargo);
      };
      if (item.retencion) {
        srete = srete + Number(item.retencion);
      };

      console.log("sumando detalle....");

    });
    const ncde = snet - Number(valueGlobalDescuento) - sdesc;

    //globales

    setValueGlobalDescuentoLinea(sdesc)
    setGlobRecargoLinea(sreca)
    setGlobExento(sexe);
    setValueGlobalNeto(ncde);
    setGlobIla(sila);

    console.log("sumatoria retencion ", srete);

    setGlobRetencion(srete);

    let nviva = 0;
    if (ncde > 0) {
      nviva = Math.round((tiva / 100) * (ncde));
    };

    setGlobIva(nviva);
    const tntotal = sexe + ncde + nviva + sila + Number(valueGlobRecargo) + sreca + srete;

    setGlobTotal(tntotal);
    setGlobTotalFormat("$".concat(Intl.NumberFormat('en-US').format(tntotal)));

  };

  const handleSumaTotalGlobalGlobal = (objdesrec) => {

    let sexe = 0;
    let snet = 0;
    let sila = 0;
    let siva = 0;
    let sreca = 0;
    valueMov.forEach((item) => {

      sexe = sexe + Number(item.exento);
      snet = snet + Number(item.neto);
      sila = Number(item.ila) ? sila + Number(item.ila) : 0;
      sreca = sreca + Number(item.recargo);

    });

    let ncde = 0;
    //es descuento
    if (objdesrec.tipo.trim() === "d") {

      ncde = snet - objdesrec.valor;
    } else {
      //es recargo
      ncde = snet - Number(valueGlobalDescuento) - Number(valueGlobalDescuentoLinea);
    };

    console.log("ncde ", ncde);

    setValueGlobalNeto(ncde);

    if (snet > 0) {
      siva = Math.round((tiva / 100) * (ncde));

    };

    console.log("siva,sexe,sila ", siva, sexe, sila);

    setGlobIva(siva);
    setGlobExento(sexe);
    setGlobIla(sila);

    let tntotal = 0;
    //es descuento
    if (objdesrec.tipo.trim() === "d") {
      tntotal = (sexe + ncde + siva + sila + Number(valueGlobRecargo) + sreca);
    } else {
      //es recargo
      tntotal = (sexe + ncde + siva + sila + Number(objdesrec.valor) + sreca);
    }

    console.log("total g", tntotal);
    setGlobTotal(tntotal);
    setGlobTotalFormat("$".concat(Intl.NumberFormat('en-US').format(tntotal)));

  };

  const setDetalleReset = () => {

    setValueCantidad(0);
    setValuePrecio(0);
    setValueNeto(0);
    setValueIla(0);
    setValueDescuentoLinea(0);
    setValueRecargoLinea(0);
    setValueRetencionLinea(0);
    setValueTasaIlaLabel(`Ila %`);
    setInputValueArticulo(null);
    setInputValueProducto(null);
    setValueInputBod(null);
    setValueProducto('');
    setValueArticulo('');
    setValueBodega('');

  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      setValueAfecto("afecto");
    } else {
      setValueAfecto("exento");
    }
  };

  const handleChangeFolioDocumentoActual = event => {

    const vnombre = event.target.value;
    console.log(event);
    setValueFolioDocumentoActual(vnombre);
    formik.setFieldValue("foliodocumentoactual", vnombre);

  };

  const handleChangeFolioDocumentoRelacionado = event => {

    const vnombre = event.target.value;
    console.log(event);
    setValueFolioDocumentoRelacionado(vnombre);
    formik.setFieldValue("foliodocumentorelacionado", vnombre);

  };

  const iniciaVarValidGlobal = (nv) => {
    if (nv) {
      formik.setFieldValue("proveedor", nv.swEncabezadoProveedor ? null : ' ');

      formik.setFieldValue("foliodocumentoactual", nv.swEncabezadoDocumentoActual ? '' : '0');
      setValueFolioDocumentoActual('');

      formik.setFieldValue("documentorelacionado", nv.swEncabezadoDocumentoRelacionado ? null : ' ');
      formik.setFieldValue("foliodocumentorelacionado", nv.swEncabezadoDocumentoRelacionado ? '' : '0');
      setValueFolioDocumentoRelacionado('');

      formik.setFieldValue("bodegaenc", nv.swEncabezadoBodega ? null : ' ');
      formik.setFieldValue("centroproduccion", nv.swEncabezadoCentroProduccion ? null : ' ');
      formik.setFieldValue("centroconsumo", nv.swEncabezadoCentroConsumo ? null : ' ');


    };

  };

  const getFolioInternoUsuario = async (idusr, iddoc) => {
    console.log("getFolioInternoUsuario ", idusr, iddoc);

    const urlapiusrdoc = `${URL_BASE}${API_FIL1}${idusr}${API_FIL2}${iddoc}`;

    await axios
      .get(urlapiusrdoc, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then(({ data }) => {

        console.log("urlapiusrdoc ====>" + urlapiusrdoc, data.data);

        console.log("foliofinal ====>", data.data[0].foliofinal);

        console.log("siguiente ====>", data.data[0].siguiente);


        if (Object.keys(data.data).length === 0 || !(data.data[0].foliofinal > data.data[0].siguiente)) {

          seterrorUserDocumento(true);
          setErrorPrueba(true);
          setErrorText('no existe asignacion de folio interno para el usuario');
          return;
        };

        //actualizar id del registro de usuario documento

        setValueUserDocumento([...data.data]);

        //vista del folio
        setValueFolioInternoDocumento(data.data[0].siguiente);

        console.log("valueUserDocumento:", valueUserDocumento);

      })
      .catch((error) => {
        console.log("error ",error)
        seterrorUserDocumento(true);
        setErrorPrueba(true)
        setErrorText(JSON.stringify(error))

      });
  };

  /*busca documento en API
      const getDocumento=async(iddoc)=>{
      
    
        const urldoc=`${URL_BASE}${API_SEL_DOC}${iddoc}`;
    
        await axios
        .get(urldoc,{    headers:{
        Authorization:`Bearer  ${token}`
        }})
        .then(({ data }) => {
          
          //vista del folio
          //setValueFolioInternoDocumento(data.data[0].siguiente );
          console.log("documento ID",data.data);

          setSwVista(data.data);
        
        })
        .catch((error) => {
          console.log("error")
          seterrorUserDocumento(true);
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))
        
        });
      };            
  // */
  //   const handleChangeDialogValorTasaIla= (event) => {
  //     setValorDialogoTasaIla(event.target.value);
  //   };


  const handleChangeDialogValorIla = (event) => {
    setValorDialogoIla(event.target.value);
  };

  const handleCloseDialogIla = () => {
    setOpenDialogDetalleIla(false);
    setValueIla(valorDialogoIla);
    setValueTasaIla(valorDialogoTasaIla);
    setValueTasaIlaLabel(`Ila %${valorDialogoTasaIla}`);
  };

  const handleClickOpenDialogIla = () => {
    setOpenDialogDetalleIla(true);

    setValorDialogoTasaIla(0);
  };

  const handleClickOpenDialogPrecio = () => {
    setOpenDialogDetallePrecio(true);

    setValorDialogoPrecio(valuePrecio);
  };

  const handleCloseNoSaldo=()=>{
        setOpenDialogSaldo(false);
        console.log("No graba...");
  };


  const handleCloseDialogSaldo = () => {
 
       setOpenDialogSaldo(false);
      
       grabaMovimiento();
       console.log("Graba de todos modos ... ");

  };  

  const handleCloseDialogPrecio = () => {
    setOpenDialogDetallePrecio(false);
    /*
    aqui va  la actualizacion de precio o neto segun seleccion
    */
    console.log(valueDialogPrecio);
    if (valueDialogPrecio.trim() === 'Precio') {

      setValuePrecio(valorDialogoPrecio);
      //actualizar operaciones matematicas
      calculosHandlePrecio(valorDialogoPrecio);

    } else {

      //es total
      setValueNeto(valorDialogoPrecio);
      calculosNetoDetallePrecio(valorDialogoPrecio);
      // inputRefNeto.current.focus();
    };

  };

  //calcula precio basada en total y cantidad
  const calculosNetoDetallePrecio = (valorND) => {
    setValueNeto(valorND);
    setValuePrecio(valorND / valueCantidad);

    setValueIla(valueTasaIla ? Math.round((valueTasaIla / 100) * (valorND)) : 0);

  };


  //option Dialogo precio
  const handleChangeDialogPrecio = (event) => {
    setValueDialogPrecio(event.target.value);
  };

  const handleChangeDialogValorPrecioTotal = (event) => {
    setValorDialogoPrecio(event.target.value);
  };

  //calcula total precio * cantidad   
  const calculosHandlePrecio = (valor) => {
    setValuePrecio(valor);
    setValueNeto(valor * valueCantidad);

    setValueIla(valueTasaIla ? Math.round((valueTasaIla / 100) * ((valor * valueCantidad) - valueDescuentoLinea)) : 0);

  };

  const calculosNetoDetalle = (valorND) => {
    setValueNeto(valorND);
    setValueCantidad(valorND / valuePrecio);

    setValueIla(valueTasaIla ? Math.round((valueTasaIla / 100) * (valorND)) : 0);

  };


  const actualizaVistaDetalle = (aSw) => {
    setColumnVisibility(
      {
        id: false,

        exento: aSw.swDetalleExento,
        'producto.descripcion': aSw.swDetalleProducto,
        'articulo.descripcion': aSw.swDetalleArticulo,
        'bodega.descripcion': aSw.swDetalleBodega,
        neto: aSw.swDetalleNeto,
        tila: aSw.swDetalleIla,
        descuento: aSw.swDetalleDescuento,
        recargo: aSw.swDetalleRecargo,

        costounitario: aSw.swDetalleCostounitario,
        recargoglobal: aSw.swDetalleRecargoglobal,
        costototal: aSw.swDetalleCostototal,
        retencion: aSw.swDetalleRetencion,

      });
  };

  const handleChangeMultiple = (event) => {
    console.log("event", event);
    const { options } = event.target;
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {

        const vtasa = inicialTablaIla.find((nom) => nom.descripcion === options[i].text).tasa;

        setValorDialogoTasaIla(vtasa);
        setValorDialogoIla(vtasa ? Math.round((vtasa / 100) * (valueNeto)) : 0);

        break;
      }
    }
    //setPersonName(value[0]);
    //console.log(value[0]);
  };

  useEffect(() => {

  
    setListaDocumentosRelacionados([...inicialDocumentos.filter(doc => doc.swEncabezadoRelacionaDocumento)]);
    
    setErrorPrueba(false);
    setDetalleReset();
    valueMov.length = 0;

    //con movimiento 
    if (inicial.movimientodocs.length > 0) {
      console.log("vista   ..........");
      setValueMov([...inicial.movimientodocs]);
      console.log("valueMov =====>", inicial.movimientodocs);
      //seteando globales
      setValueInputDocumentoActual(inicialDocumentos.find(({ id }) => id === inicial.documento.id));

      //console.log(" valueInputDocumentoActual   " ,valueInputDocumentoActual);
      // setSwVista( inicialDocumentos.find(({id}) => id === inicial.documento.id));

      formik.setFieldValue("foliodocumentoactual", inicial.foliodoc);
      setValueFolioDocumentoActual(inicial.foliodoc);

      setValueInputProveedor(inicialProveedores.find(({ id }) => id === inicial.proveedor.id))

      setValueInputDocumentoRelacionado(swVista.swEncabezadoDocumentoRelacionado ? inicialDocumentos.find(({ id }) => id === inicial.documentosrelacionado.id):'');


      formik.setFieldValue("foliodocumentorelacionado", inicial.foliodocrel);
      setValueFolioDocumentoRelacionado(inicial.foliodocrel);


      setValueInputCentroProduccion(swVista.swEncabezadoCentroProduccion ? inicialCentroProduccion.find(({ id }) => id === inicial.centroproduccion.id) : {});
      setValueInputCentroConsumo(swVista.swEncabezadoCentroConsumo ? inicialCentroConsumo.find(({ id }) => id === inicial.centroconsumo.id) : {});
      setValueInputBodEncabezado(swVista.swEncabezadoBodega ? inicialBodega.find(({ id }) => id === inicial.bodega.id) : {})


      setValueDate(dayjs(String(inicial.fechadoc)) );

      setValueVencimiento(dayjs(String(inicial.vencimiento)));

      setGlobExento(inicial.exento);
      setValueGlobalNeto(inicial.neto);
      setGlobIva(inicial.siva);
      setGlobIla(inicial.sila);

      setGlobRetencion(inicial.sretencion);

      setGlobRecargoLinea(inicial.srecargo);
      setGlobRecargo(inicial.recargoglobal);
      setValueGlobalDescuentoLinea(inicial.sdescuento);
      setValueGlobalDescuento(inicial.descuentoglobal);
      setGlobTotal(inicial.total);
      setGlobTotalFormat("$".concat(Intl.NumberFormat('en-US').format(inicial.total)));

      //vista del folio
      setValueFolioInternoDocumento(inicial.foliointerno);

      actualizaVistaDetalle(inicial.documento);

      return;
    };

    console.log("useEffect inicial.documento ", inicial.documento);
    console.log("useEffect  inicial swVista ", swVista);

    //para validacion
    formik.setFieldValue("id", inicial.id);
    formik.setFieldValue("documentoactual", '');

    iniciaVarValidGlobal(swVista);
    //todos los sw detalle a falso
    iniciaVistaColumnaDetalle();

    //Valores nuevo
    setValueGlobalDescuento(0);
    setValueGlobalDescuentoLinea(0);
    setValueRecargoLinea(0);
    setGlobRecargo(0);
    setGlobExento(0);
    setValueGlobalNeto(0);
    setGlobIla(0);
    setGlobRetencion(0);
    setGlobIva(0);
    setGlobTotal(0);
    setGlobTotalFormat("$".concat(Intl.NumberFormat('en-US').format(0)));

    setValueInputProveedor(null);
    setValueInputDocumentoActual(null);
    setValueInputCentroProduccion(null);
    setValueInputCentroConsumo(null);
    setValueInputBodEncabezado(null);
    setValueInputDocumentoRelacionado(null);

    //fechas
    setValueDate(dayjs(new Date()));
    setValueVencimiento(dayjs(new Date()));
    

    ofProgress();


  }, [open]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Dialog open={open}
        maxWidth="lg"
      >
        <DialogTitle textAlign="center" >

          <div style={{ display: 'flex' }}>

            <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
              {titulomod}
            </Typography>
            <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
              <Autocomplete
                disabled={deshabilitado}
                style={{ width: "210px" }}
                options={inicialDocumentos}
                getOptionLabel={(option) => option.descripcion}
                id="documentoactual"
                clearOnEscape
                value={valueInputDocumentoActual}
                onChange={(event, newValue) => {
                  if (newValue) {

                    console.log("cambiando a documento  .....", newValue);
                    setValueInputDocumentoActual(newValue);
                    setSwVista(newValue);

                    actualizaVistaDetalle(newValue);

                    setEditaPrecio(newValue.swDetallePrecio);

                    formik.setFieldValue("documentoactual", newValue.descripcion);

                    //busca usr doc
                    //console.log("user documento ....",user,newValue.id);
                    getFolioInternoUsuario(user.id, newValue.id);

                  } else {

                    //todos los sw detalle a false
                    iniciaVistaColumnaDetalle();

                    setSwVista(inicialDocumento);
                    formik.setFieldValue("documentoactual", '');

                    setValueInputDocumentoActual(null);

                  };

                  iniciaVarValidGlobal(newValue);
                }}

                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={formik.touched.documentoactual && Boolean(formik.errors.documentoactual)}
                    helperText={formik.touched.documentoactual && formik.errors.documentoactual}
                    label="Tipo documento actual"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <DocumentScannerRounded />
                        </InputAdornment>
                      )
                    }}
                    variant="standard" />
                )}
              />
            </Typography>
            <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
              Folio Interno:{valueFolioInternoDocumento}
            </Typography>

          </div>

          {errorPrueba &&
            <Alert onClose={() => setErrorPrueba(false)} variant="outlined" severity="error">
              {errorText} alerta — revisar!
            </Alert>
          }

        </DialogTitle>
        <Dialog
          open={openDialogSaldo}
         onClose={handleCloseNoSaldo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Comportamiento saldos"}
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText id="alert-dialog-description">
              Existen saldo negativo. desea agregar de todos modos?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNoSaldo}>No</Button>
         
            <Button color="primary" onClick={handleCloseDialogSaldo} autoFocus>
              Si
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDialogDetallePrecio}
          onClose={handleCloseDialogPrecio}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Herramienta calculo precio"}
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText id="alert-dialog-description">
              Determina si el precio es basado por: (Total o Precio)
            </DialogContentText>

            <RadioGroup
              ref={radioGroupRef}
              aria-label="ringtone"
              name="ringtone"
              value={valueDialogPrecio}
              onChange={handleChangeDialogPrecio}
            >
              {optionsPrecio.map((option) => (
                <FormControlLabel
                  value={option}
                  key={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            <TextField
              autoFocus
              required
              margin="dense"
              id="valorDialogoPrecio"
              name="valorDialogoPrecio"
              label="valor"
              type="number"
              fullWidth
              value={valorDialogoPrecio}
              variant="standard"
              onChange={handleChangeDialogValorPrecioTotal}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleCloseDialogPrecio} autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>

        {/*dialogo ila */}
        <Dialog
          open={openDialogDetalleIla}
          onClose={handleCloseDialogIla}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Herramienta % Ila"}
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText id="alert-dialog-description">
              Seleccione afecto Impuesto Ila
            </DialogContentText>

            <br></br>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 8, sm: 6, md: 1 }}>

              <Grid item xs={8}>

                <Select
                  multiple
                  native
                  value={valorDialogoTasaIla}
                  onChange={handleChangeMultiple}

                  inputProps={{
                    id: 'select-multiple-native',
                  }}
                >
                  {inicialTablaIla.map((name) => (
                    <option key={name.descripcion} value={name}>
                      {name.descripcion}
                    </option>
                  ))}


                </Select>
              </Grid>
              <Grid item xs={4}>
                tasa % {valorDialogoTasaIla}
              </Grid>

              <TextField
                autoFocus
                required
                margin="dense"
                id="valorDialogoIla"
                name="valorDialogoIla"
                label="valor ILA"
                type="number"
                fullWidth
                value={valorDialogoIla}
                variant="standard"
                onChange={handleChangeDialogValorIla}
              />
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleCloseDialogIla} autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>

        <DialogContent dividers >

          <form onSubmit={formik.handleSubmit}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >

              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  {swVista.swEncabezadoDocumentoActual &&
                    <Box sx={{ display: 'flex', gap: '1rem' }}>

                      <TextField
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Filter1 />
                            </InputAdornment>
                          ),
                        }}

                        hidden={true}
                        id="foliodocumentoactual"
                        name="foliodocumentoactual"
                        label="Folio documento actual"
                        autoComplete='off'

                        value={valueFolioDocumentoActual}
                        onChange={handleChangeFolioDocumentoActual}
                        error={formik.touched.foliodocumentoactual && Boolean(formik.errors.foliodocumentoactual)}
                        helperText={formik.touched.foliodocumentoactual && formik.errors.foliodocumentoactual}

                        variant="standard"
                      />


                    </Box>
                  }

                  {swVista.swEncabezadoProveedor &&
                    <Box sx={{ display: 'box', gap: '1rem' }}>

                      <Autocomplete
                        options={inicialProveedores}
                        getOptionLabel={(option) => option.rut + " " + option.razonsocial}
                        id="proveedor"
                        clearOnEscape
                        value={valueInputProveedor}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            console.log("setValueInputProvedores ", newValue);
                            setValueInputProveedor(newValue);
                            formik.setFieldValue("proveedor", newValue.razonsocial);
                          } else {

                            formik.setFieldValue("proveedor", '');
                            setValueInputProveedor(null);

                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Proveedor"
                            error={formik.touched.proveedor && Boolean(formik.errors.proveedor)}
                            helperText={formik.touched.proveedor && formik.errors.proveedor}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AccountCircle />
                                </InputAdornment>
                              )
                            }}
                            variant="standard" />
                        )}
                      />

                    </Box>
                  }
                  {swVista.swEncabezadoDocumentoRelacionado &&
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                      <Autocomplete

                        style={{ width: "210px" }}
                        options={listaDocumentosRelacionados}
                        getOptionLabel={(option) => option.descripcion}
                        id="docrelacionado"
                        clearOnEscape
                        value={valueInputDocumentoRelacionado}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setValueInputDocumentoRelacionado(newValue);
                            formik.setFieldValue("documentorelacionado", newValue.descripcion);
                          } else {
                            formik.setFieldValue("documentorelacionado", '');
                            setValueInputDocumentoRelacionado(null);

                          }
                        }}

                        renderInput={(params) => (
                          <TextField
                            {...params}

                            error={formik.touched.documentorelacionado && Boolean(formik.errors.documentorelacionado)}
                            helperText={formik.touched.documentorelacionado && formik.errors.documentorelacionado}

                            label="Documento Relacionado"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <TextSnippetOutlined />
                                </InputAdornment>
                              )
                            }}
                            variant="standard" />
                        )}
                      />

                      <TextField
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Filter1 />
                            </InputAdornment>
                          ),
                        }}
                        id="foliodocumentorelacionado"
                        name="foliodocumentorelacionado"
                        label="Folio documento relacionado"
                        autoComplete='off'
                        value={valueFolioDocumentoRelacionado}
                        onChange={handleChangeFolioDocumentoRelacionado}
                        error={formik.touched.foliodocumentorelacionado && Boolean(formik.errors.foliodocumentorelacionado)}
                        helperText={formik.touched.foliodocumentorelacionado && formik.errors.foliodocumentorelacionado}
                        variant="standard"
                      />

                    </Box>
                  }
                </Grid>
                <Grid item xs={6}>

                  <Box sx={{ display: 'flex', gap: '1rem' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}  >
                      <DatePicker
                 
                      //   autoOk={true}
                         hintText="Seleccione Fecha"
                         label="Fecha"
        
                          format='YYYY-MM-DD'
                          value={valueDate}
                          onChange={
                             (fe)=>{

                                 setValueDate(fe)
                               }
                            }

                      />
                    </LocalizationProvider>


                    {swVista.swEncabezadoVencimiento &&
                      <LocalizationProvider dateAdapter={AdapterDayjs}  >
                        <DatePicker
                          format='YYYY-MM-DD'
                
                          hintText="Seleccione Fecha"
                          label="Vencimiento"
                          value={valueVencimiento}
         
                          onChange={(fe)=>{
                            setValueVencimiento(fe)
                          }}

                        />
                      </LocalizationProvider>
                    }

                  </Box>


                  <Box sx={{ display: 'flex', gap: '3rem' }}>
                    {swVista.swEncabezadoCentroProduccion &&
                      <Autocomplete
                        style={{ width: "210px" }}
                        options={inicialCentroProduccion}
                        getOptionLabel={(option) => option.descripcion}
                        id="centroproduccion"
                        clearOnEscape
                        value={valueInputCentroProduccion}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setValueInputCentroProduccion(newValue);
                            formik.setFieldValue("centroproduccion", newValue.descripcion);
                          } else {
                            formik.setFieldValue("centroproduccion", '');
                            setValueInputCentroProduccion(null);
                          }
                        }}

                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={formik.touched.centroproduccion && Boolean(formik.errors.centroproduccion)}
                            helperText={formik.touched.centroproduccion && formik.errors.centroproduccion}
                            label="Centro Produccion"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BlenderRounded />
                                </InputAdornment>
                              )
                            }}
                            variant="standard" />
                        )}
                      />
                    }

                    {swVista.swEncabezadoCentroConsumo &&
                      <Autocomplete
                        style={{ width: "210px" }}
                        options={inicialCentroConsumo}
                        getOptionLabel={(option) => option.descripcion}
                        id="centroconsumo"
                        clearOnEscape
                        value={valueInputCentroConsumo}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setValueInputCentroConsumo(newValue);
                            formik.setFieldValue("centroconsumo", newValue.descripcion);
                          } else {


                            formik.setFieldValue("centroconsumo", '');
                            setValueInputCentroConsumo(null);
                          }
                        }}

                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={formik.touched.centroconsumo && Boolean(formik.errors.centroconsumo)}
                            helperText={formik.touched.centroconsumo && formik.errors.centroconsumo}
                            label="Centro Consumo"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocalDiningRounded />
                                </InputAdornment>
                              )
                            }}
                            variant="standard" />
                        )}
                      />
                    }
                  </Box>

                  <Box sx={{ display: 'box', gap: '1rem' }}>
                    {swVista.swEncabezadoBodega &&
                      <Autocomplete
                        options={inicialBodega}
                        getOptionLabel={(option) => option.descripcion}
                        id="bodegaencabezado"
                        clearOnEscape
                        value={valueInputBodEncabezado}
                        onChange={(event, newValue) => {
                          console.log("setValueInputBoEnc", newValue);
                          if (newValue) {
                            setValueInputBodEncabezado(newValue);
                            formik.setFieldValue("bodegaenc", newValue.descripcion);
                          } else {
                            formik.setFieldValue("bodegaenc", '');
                            setValueInputBodEncabezado(null);
                          }
                        }}

                        renderInput={(params) => (
                          <TextField
                            {...params}

                            error={formik.touched.bodegaenc && Boolean(formik.errors.bodegaenc)}
                            helperText={formik.touched.bodegaenc && formik.errors.bodegaenc}

                            label="Bodega e/s"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <ShoppingCartCheckoutRounded />
                                </InputAdornment>
                              )
                            }}
                            variant="standard" />
                        )}
                      />
                    }
                  </Box>

                </Grid>
              </Grid>

              <MaterialReactTable
                displayColumnDefOptions={{
                  'mrt-row-actions': {
                    muiTableHeadCellProps: {
                      align: 'center',
                    },
                    size: 50,
                  },
                }}

                columns={columns}


                data={valueMov}

                localization={MRT_Localization_ES}
                enableTopToolbar={true} //hide top toolbar

                // enableBottomToolbar={true}
                enablePagination={false}

                enableColumnFilters={false}
                enableSorting={false}
                enableColumnActions={false}
                enableFilters={false}
                editingMode="modal" //default
                enableColumnOrdering={false}

                //botones superior derecha
                enableEditing={true}
                enableFullScreenToggle={false}
                enableHiding={false}
                enableDensityToggle={false}

                enable

                state={{
                  columnVisibility,
                  isLoading,
                  showProgressBars: isRefetching
                }}
                onColumnVisibilityChange={setColumnVisibility}
                renderRowActions={({ row, table }) => (
                  <Box sx={{ display: 'flex', gap: '1rem' }}>


                    <Tooltip arrow placement="right" title="Delete">
                      <span>
                        <IconButton disabled={deshabilitado} color="error" onClick={() => handleDeleteRow(row)}>
                          <Delete />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                )}
                renderTopToolbarCustomActions={() => {
                  return (
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      placement: "rigth"

                    }}>
                      {!deshabilitado &&
                        <>


                          {swVista.swDetalleExento &&
                            <>

                              <Typography variant="h9" >{valueAfecto}</Typography>
                              <Checkbox color="success" checked={checked} onChange={handleChange} />
                            </>
                          }


                          {swVista.swDetalleProducto &&
                            <Stack spacing={1} sx={{ width: 150 }}>

                              <Autocomplete
                                id="producto"
                                options={inicialProducto}
                                getOptionLabel={(option) => option.descripcion}

                                value={inputProducto}
                                onChange={(event, newValue) => {
                                  if (newValue) {

                                    console.log("onChange setInputValueProducto", newValue);

                                    setInputValueProducto(newValue);

                                    setValuePrecio(newValue.precio);

                                    setValueNeto(newValue.precio * valueCantidad);
                                    if (newValue.tasaila > 0) {
                                      setValueIla(Math.round((newValue.tasaila / 100) * ((newValue.precio * valueCantidad) - valueDescuentoLinea)));
                                    };
                                    setValueTasaIlaLabel(`Ila %${newValue.tasaila}`);
                                    setValueTasaIla(parseInt(newValue.tasaila));

                                  } else {
                                    setDetalleReset();

                                  };
                                }}

                                inputValue={valueProducto}
                                onInputChange={(event, newInputValue) => {
                                  console.log(newInputValue);
                                  setValueProducto(newInputValue);

                                }}

                                renderInput={(params) => (
                                  <TextField
                                    {...params}

                                    label="Producto"
                                    error={isFieldInError("valueProducto")}
                                    helperText={getErrorsInField("valueProducto")}
                                    InputProps={{
                                      ...params.InputProps,
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <SoupKitchen />
                                        </InputAdornment>
                                      )
                                    }}
                                    variant="standard" />
                                )}
                              />

                            </Stack>
                          }

                          {swVista.swDetalleArticulo &&
                            <Stack spacing={1} sx={{ width: 150 }}>

                              <Autocomplete
                                id="articulo"
                                options={inicialArticulo}
                                getOptionLabel={(option) => option.codigoproveedor ? option.codigoproveedor.trim() + " " + option.descripcion : option.descripcion}

                                value={inputArticulo}
                                onChange={(event, newValue) => {
                                  if (newValue) {


                                    console.log("onChange setInputValueArticulo", newValue);

                                    setValidaNegativoProduccion(newValue.produccioninterna);


                                    //cunipromedio
                                    //valueInputDocumentoActual.ensa

                     
                                    setInputValueArticulo(newValue);


                                    //es entrada y agrega ultimo precio
                                   // console.log("cunipromedio :",newValue.cunipromedio);
                                   // console.log("valueInputDocumentoActual.ensa :",valueInputDocumentoActual.ensa);

                                    if (valueInputDocumentoActual.ensa==="E"){
                                      setValuePrecio(newValue.precio);
                                    }else{
                                      //solo si es mayor a 0 
                                      if (newValue.cunipromedio>0){;
                                          setValuePrecio(newValue.cunipromedio);
                                      }else{
                                           setValuePrecio(newValue.precio);
                                      };    
                                    }
                                   
                                    setValueNeto(newValue.precio * valueCantidad);
                                    if (newValue.tasaila < 0) {
                                      setValueIla(Math.round((newValue.tasaila / 100) * ((newValue.precio * valueCantidad) - valueDescuentoLinea)));

                                    };

                                    setValueTasaIlaLabel(`Ila %${newValue.tasaila}`);
                                    setValueTasaIla(parseInt(newValue.tasaila));

                                  } else {
                                    setDetalleReset();

                                  };
                                }}

                                inputValue={valueArticulo}
                                onInputChange={(event, newInputValue) => {
                                  console.log(newInputValue);
                                  setValueArticulo(newInputValue);

                                }}

                                renderInput={(params) => (
                                  <TextField
                                    {...params}

                                    label="Articulo"
                                    error={isFieldInError("valueArticulo")}
                                    helperText={getErrorsInField("valueArticulo")}

                                    variant="standard" />
                                )}
                              />
                            </Stack>
                          }
                          {swVista.swDetalleBodega &&
                            <Stack spacing={1} sx={{ width: 125 }}>
                              <Autocomplete
                                options={inicialBodega}
                                getOptionLabel={(option) => option.descripcion}
                                id="bodegamov"
                                clearOnEscape
                                value={valueInputBod}
                                onChange={(event, newValue) => {
                                  console.log("setValueBod", newValue);
                                  if (newValue) {
                                    setValueInputBod(newValue);
                                  } else {
                                    setValueInputBod(null);
                                  }
                                }}


                                inputValue={valueBodega}
                                onInputChange={(event, newInputValue) => {
                                  console.log(newInputValue);
                                  setValueBodega(newInputValue);

                                }}

                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={isFieldInError("valueBodega")}
                                    helperText={getErrorsInField("valueBodega")}
                                    InputProps={{
                                      ...params.InputProps,
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <ShoppingCartCheckoutRounded />
                                        </InputAdornment>
                                      )
                                    }}

                                    label="Bodega"
                                    variant="standard" />
                                )}
                              />
                            </Stack>
                          }
                          <Stack spacing={1} sx={{ width: 80 }}>
                            <TextField
                              id="cantidad"
                              name="cantidad"
                              label="cantidad"
                              autoComplete='off'
                              value={valueCantidad}
                              type='number'
                              onChange={(e) => {
                                setValueCantidad(e.target.value);
                                setValueNeto(e.target.value * valuePrecio);
                                if (valueTasaIla > 0) {
                                  setValueIla(Math.round((valueTasaIla / 100) * ((e.target.value * valuePrecio) - valueDescuentoLinea)));
                                };


                              }}
                              error={isFieldInError("valueCantidad")}
                              helperText={getErrorsInField("valueCantidad")}

                              variant="standard"
                            />
                          </Stack>

                          {/*usar precio promedio si no actualiza precio*/}

                          <Stack spacing={1} sx={{ width: 80 }}>
                            <TextField
                              hidden
                              id="precio"
                              name="precio"
                              label="precio"
                              autoComplete='off'
                              value={valuePrecio}
                              type='number'
                              disabled={!editaPrecio}
                              onChange={(e) => {
                                calculosHandlePrecio(e.target.value);
                                /*
                                  setValuePrecio(e.target.value);
                                  setValueNeto(e.target.value*valueCantidad);
                                  setValueIla(Math.round((valueTasaIla/100)*((e.target.value*valueCantidad)-valueDescuentoLinea  )));  

                                */
                              }}
                              error={isFieldInError("valuePrecio")}
                              helperText={getErrorsInField("valuePrecio")}
                              variant="standard"
                              onKeyUp={(event) => {
                                console.log(event.key);
                                //debe ser mayor a 0
                                if (!valueCantidad > 0) {
                                  return;
                                }
                                if (event.key === 'F9')

                                  handleClickOpenDialogPrecio();


                              }}


                            />
                          </Stack>

                          {swVista.swDetalleNeto &&
                            <Stack spacing={1} sx={{ width: 80 }}>
                              <TextField
                                inputRef={inputRefNeto}
                                hidden
                                id="neto"
                                name="neto"
                                label="neto"
                                autoComplete='off'
                                value={valueNeto}
                                type='number'
                                onChange={(e) => {
                                  calculosNetoDetalle(e.target.value);
                                  /*
                                   setValueNeto(e.target.value);
                                   setValueCantidad(e.target.value/valuePrecio);
                                   setValueIla(Math.round((valueTasaIla/100)*(e.target.value)));  
                                   */
                                }}
                                error={isFieldInError("valueNeto")}
                                helperText={getErrorsInField("valueNeto")}
                                variant="standard"


                              />
                            </Stack>
                          }

                          {swVista.swDetalleIla &&
                            <Stack spacing={1} sx={{ width: 80 }}>
                              <TextField
                                hidden
                                id="ila"
                                name="ila"
                                label={valueTasaIlaLabel}
                                autoComplete='off'
                                value={valueIla}
                                type='number'
                                onChange={(e) => {
                                  setValueIla(e.target.value);

                                }}
                                error={isFieldInError("valueIla")}
                                helperText={getErrorsInField("valueIla")}
                                variant="standard"

                                onKeyUp={(event) => {
                                  console.log(event.key);

                                  if (event.key === 'F9')

                                    handleClickOpenDialogIla();
                                }}
                              />
                            </Stack>
                          }
                          {swVista.swDetalleDescuento &&
                            <Stack spacing={1} sx={{ width: 80 }}>
                              <TextField
                                hidden
                                id="descuentolinea"
                                name="descuentolinea"
                                label='descuento'
                                autoComplete='off'
                                value={valueDescuentoLinea}
                                type='number'
                                onChange={(e) => {
                                  setValueDescuentoLinea(e.target.value);

                                }}
                                error={isFieldInError("valueDescuentoLinea")}
                                helperText={getErrorsInField("valueDescuentoLinea")}
                                variant="standard"
                              />
                            </Stack>
                          }

                          {swVista.swDetalleRecargo &&
                            <Stack spacing={1} sx={{ width: 80 }}>
                              <TextField
                                hidden
                                id="recargolinea"
                                name="recargolinea"
                                label='recargo'
                                autoComplete='off'
                                value={valueRecargoLinea}
                                type='number'
                                onChange={(e) => {
                                  setValueRecargoLinea(e.target.value);

                                }}
                                error={isFieldInError("valueRecargoLinea")}
                                helperText={getErrorsInField("valueRecargoLinea")}
                                variant="standard"
                              />
                            </Stack>
                          }
                          {swVista.swDetalleRetencion &&
                            <Stack spacing={1} sx={{ width: 80 }}>
                              <TextField
                                hidden
                                id="retencion"
                                name="retencion"
                                label='retencion'
                                autoComplete='off'
                                value={valueRetencionLinea}
                                type='number'
                                onChange={(e) => {
                                  setValueRetencionLinea(e.target.value);

                                }}
                                //error= {isFieldInError("valueRetencionLinea")  }
                                //helperText={getErrorsInField("valueRetencionLinea")}
                                variant="standard"
                              />
                            </Stack>
                          }

                          <Stack spacing={1} sx={{ width: 10 }}>
                            <Button disabled={!isFormValid}
                              color="secondary"
                              onClick={handleSaveMov} variant="contained">

                              <Add />

                            </Button>
                          </Stack>
                        </>

                      }

                    </div>
                  )

                }}

                renderBottomToolbarCustomActions={() => {

                  return (
                    <>
                      {swVista.swEncabezadoDescuento &&
                        <TextField

                          id="descuentoglobal"
                          name="descuentoglobal"
                          label="Dcto.Global"
                          autoComplete='off'
                          value={valueGlobalDescuento}
                          type='number'
                          onChange={(e) => {
                            if (e.target.value) {
                              setValueGlobalDescuento(e.target.value);
                              handleSumaTotalGlobalGlobal({ tipo: 'd', valor: e.target.value });
                            };
                          }}
                        />
                      }
                      {swVista.swDetalleDescuento &&
                        <TextField label="Total Dcto.Linea" value={valueGlobalDescuentoLinea} />
                      }
                      {swVista.swDetalleExento &&
                        <TextField label="Total Exento" value={valueGlobExento} />
                      }

                      {swVista.swDetalleNeto &&
                        <>
                          <TextField label="Total Neto" value={valueGlobalNeto} />
                          <TextField label="Total Iva" value={valueGlogIva} />
                        </>
                      }

                      {swVista.swDetalleIla &&
                        <TextField label="Total ILA" value={valueGlobIla} />
                      }

                      {swVista.swDetalleRetencion &&
                        <TextField label="Total Retencion" value={valueGlobRetencion} />
                      }
                      {swVista.swDetalleRecargo &&
                        <TextField label="Total Recargo.Linea" value={valueGlobRecargoLinea} />
                      }
                      {swVista.swEncabezadoRecargo &&
                        <TextField
                          id="recargos"
                          name="recargos"
                          label="Recargo Global"
                          autoComplete='off'
                          value={valueGlobRecargo}
                          type='number'
                          onChange={(e) => {
                            if (e.target.value) {
                              setGlobRecargo(e.target.value);

                              handleSumaTotalGlobalGlobal({ tipo: 'r', valor: e.target.value });

                            };

                          }}
                        />
                      }
                      <TextField label="Total General" value={valueGlobTotalFormat} />

                    </>
                  )
                }}

              />

              <DialogActions sx={{ p: '1.25rem' }}>
                <Button color="secondary" onClick={() => {
                  onClose();
                }}>
                  Cancel
                </Button>

                <Button disabled={deshabilitado} color="primary" type="submit" variant="contained">
                  Submit
                </Button>

              </DialogActions>

            </Stack>
          </form>
        </DialogContent>

      </Dialog>
    </>
  );
};


export default ModalEncabezadoDoc;
