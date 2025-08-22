

import React, { useCallback, useMemo, useState, useEffect, useContext, useRef } from 'react';
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import MaterialReactTable,
{
  MRT_FullScreenToggleButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import {
  Alert,
  Box,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import { Delete, ViewColumn, Add } from '@mui/icons-material';

import CloudDownload from "@mui/icons-material/CloudDownload";
import Print from "@mui/icons-material/Print";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import { ActionIcon } from '@mantine/core';
import { inicialDocumento } from '../../data/makeDataCrud';
import { inicialEncabezadoDoc } from '../../data/makeDataCrud';

import { ModalEncabezadoDoc } from './modal/ModalEncabezadoDoc';
import {getMesAnoCierre ,getAaaaMmAnterior} from "./helpers/getMesAnoCierre";
import runCierreReport0 from "./helpers/runCierreReport0";

//import esUnico from './helpers/esUnico';
import { AuthContext } from "../../mycontext";
import dayjs from 'dayjs';
//import CircularProgress from '@mui/material/CircularProgress';

const URL_BASE = process.env.REACT_APP_URL_BASE;
const API_SEL = process.env.REACT_APP_API_SEL_EDO_All_REL;
const API_INS = process.env.REACT_APP_API_INS_EDO;
//const API_UPD=process.env.REACT_APP_API_UPD_EDO;
const API_DEL = process.env.REACT_APP_API_DEL_EDO;
const API_INS_MDO = process.env.REACT_APP_API_INS_MDO;
const API_DEL_MDO = process.env.REACT_APP_API_DEL_MDO;
const API_SEL_MDO_REL = process.env.REACT_APP_API_SEL_MDO_REL;

//documentos
const API_SEL_DOC = process.env.REACT_APP_API_SEL_DOC;
//proveedor
const API_SEL_PRO = process.env.REACT_APP_API_SEL_PRO;
//centro produccion
const API_SEL_CPR = process.env.REACT_APP_API_SEL_CPR;
//centro de consumo
const API_SEL_CCO = process.env.REACT_APP_API_SEL_CCO;
//bodegas
const API_SEL_BOD = process.env.REACT_APP_API_SEL_BOD;
//articulos
const API_SEL_ART = process.env.REACT_APP_API_SEL_ART;
const API_UPD_ART = process.env.REACT_APP_API_UPD_ART;

//productos
const API_SEL_PRD = process.env.REACT_APP_API_SEL_PRD;
//subfamilia-articulos
const APP_API_UPD_SFA = process.env.REACT_APP_API_UPD_SFA;

//folio usuario
const API_UPD_FUD = process.env.REACT_APP_API_UPD_FUD;

//Tabla ila
const API_SEL_TIL = process.env.REACT_APP_API_SEL_TIL;

//tabla cierrestock
const API_SPA_CST1=process.env.REACT_APP_API_SPA_CST1;
const API_SPA_CST2=process.env.REACT_APP_API_SPA_CST2;

const API_INS_CST=process.env.REACT_APP_API_INS_CST;
const API_UPD_CST=process.env.REACT_APP_API_UPD_CST;
const API_SEL_CST=process.env.REACT_APP_API_SEL_CST;

//parametros
const API_SEL_PAR=process.env.REACT_APP_API_SEL_PAR;

//movimientos
const API_SEL_MDO=process.env.REACT_APP_API_SEL_MDO;

const Encabezadodoc = () => {
  const timer = useRef();
  const { user } = useContext(AuthContext);
  const { token } = user;

  const [titulomod, setTitulomod] = useState('');

  const [title, setTitle] = useState('');

  const [subTitle, setSubTitle] = useState('');

  const [isRefetching, setIsRefetching] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [errorPrueba, setErrorPrueba] = useState(false);

  const [errorText, setErrorText] = useState("");

 // const [errorSaldoNegativo, setErrorSaldoNegativo] = useState("");
 

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [rowData, setRowData] = useState([]);

  const [inicial, setInicial] = useState(inicialEncabezadoDoc);

  const [inicialDocumentos, setInicialDocumentos] = useState([]);

  const [inicialProveedores, setInicialProveedores] = useState([]);

  const [inicialCentroProduccion, setInicialCentroProduccion] = useState([]);

  const [inicialCentroConsumo, setInicialCentroConsumo] = useState([]);

  const [inicialBodega, setInicialBodega] = useState([]);

  const [inicialArticulo, setInicialArticulo] = useState([]);

  const [inicialProducto, setInicialProducto] = useState([]);

  const [inicialTablaIla, setInicialTablaIla] = useState([]);

  const [deshabilitado, setDeshabilitado] = useState(false);

  const [swVista, setSwVista] = useState(inicialDocumento);

  // const [valueAno, setValueAno] = useState("");

  // const [valueMes, setValueMes] = useState("");

  const [valorMesProceso, setValorMesProceso] = useState("");
  const [valorMesAnterior, setValorMesAnterior] = useState("");

  const [valueCierre, setValueCierre] = useState([]);
  const [valueMovimientosPeriodo, setValueMovimientosPeriodo] = useState([]);
  
  const [valueDiasadicionalperiodoactual,setValueDiasadicionalperiodoactual] = useState(0);

  const [valueComportamiento,setValueComportamiento] = useState("");

  //snack
  const [state] = useState({
    vertical: 'top',
    horizontal: 'center',
  });

  const { vertical, horizontal } = state;
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState(false);
  // actualizar contador de folio interno

  const actFolioDocUser = (idusrdoc, vsiguiente) => {

    axios
      .put(`${URL_BASE}${API_UPD_FUD}${idusrdoc}`, {
        data: {

          siguiente: vsiguiente + 1,


        },
      }, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then((response) => {
        //console.log(response);
        setIsLoading(false);
        setIsRefetching(false);
        setMessage(`actualizado siguiente ${idusrdoc}`);
        setOpenSnack(true);

      }).catch((error) => {

        console.log(error);
        setErrorPrueba(true)
        setErrorText(JSON.stringify(error));

      });

  };

  const actPrecioPromedioArticulo = (item,doc) => {
   console.log("ITEM evaluado ",item);


    console.log("inicialArticulo=======> ",inicialArticulo);
    const tableDataArticulo=inicialArticulo.filter((element) => element.id===item.articulo.id);


  
  //  console.log("valorMesAnterior  ===>>>      ",valorMesAnterior);
  //   console.log("valorMesProceso  ===>>>      ",valorMesProceso);
  //   console.log("tableDataArticulo ===>>>     ",tableDataArticulo);
  //   console.log("valueCierre ===>>>           ",valueCierre);
  //   console.log("valueMovimientosPeriodo ===>>>",valueMovimientosPeriodo);


    const resultadoPrecio=runCierreReport0(
    valorMesAnterior,
    valorMesProceso,
    tableDataArticulo,
    valueCierre,
    valueMovimientosPeriodo);

    console.log("a grabar");
    console.log(resultadoPrecio[0]);
    console.log("movimientos");
    console.table(resultadoPrecio[1]);
    console.log("error ");
    console.table(resultadoPrecio[2]);
     
    console.log("actualizando precio promedio ....",resultadoPrecio[0][0].preciopromedio);
    
    //agregar o restar el movimiento actual
    let sValor=resultadoPrecio[0][0].saldovalor;
    let sUnidad=resultadoPrecio[0][0].saldoUnidad;
    let precioPromedioPonderado=0;

    if (doc.ensa==="E"){
        sValor=sValor+item.costototal;
        sUnidad=sUnidad+item.cantidad;
        precioPromedioPonderado=sValor/sUnidad;

    }else{
        // es salida  
        //   
        if (!sUnidad>=item.unidad){;
            console.log("Saldo insuficiente para calculo de Precio Promedio");

        };
        return;

    };

    //solo se actualiza el PPP solo si es entrada


    axios
      .put(`${URL_BASE}${API_UPD_ART}${item.articulo.id}`, {
        data: {

          cunipromedio:precioPromedioPonderado,

        },
      }, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then((response) => {
        //console.log(response);
        setIsLoading(false);
        setIsRefetching(false);
        setMessage(`actualizado precio promedio${item.articulo.id}`);
        setOpenSnack(true);

      }).catch((error) => {

        console.log(error);
        setErrorPrueba(true)
        setErrorText(JSON.stringify(error));

      });

  };


  const actPrecioArticulo = (idArt, precioArt) => {


    axios
      .put(`${URL_BASE}${API_UPD_ART}${idArt}`, {
        data: {

          precio: precioArt,

        },
      }, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then((response) => {
        //console.log(response);
        setIsLoading(false);
        setIsRefetching(false);
        setMessage(`actualizado precio ${idArt}`);
        setOpenSnack(true);

      }).catch((error) => {

        console.log(error);
        setErrorPrueba(true)
        setErrorText(JSON.stringify(error));

      });

  };

  const actCostoUnitArticulo = (idArt, costo, fecha) => {

    axios
      .put(`${URL_BASE}${API_UPD_ART}${idArt}`, {
        data: {
          fechacumayor: fecha,
          cunitmayor: costo,
        },
      }, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then((response) => {
        //console.log(response);
        setIsLoading(false);
        setIsRefetching(false);
        setMessage(`actualizado precio ${idArt}`);
        setOpenSnack(true);

      }).catch((error) => {

        console.log(error);
        setErrorPrueba(true)
        setErrorText(JSON.stringify(error));

      });

  };
  const procesaCierreStockDele= (item,per)=>{
    
    const urlapicst  = `${URL_BASE}${API_SPA_CST1}${per}${API_SPA_CST2}${item.articulo.id}`;
    console.log("procesaCierreStock api",urlapicst);
    axios
    .get(urlapicst, {
      headers: {
        Authorization: `Bearer  ${token}`
      }
    })
    .then(({ data }) => {
        //no existe , agrega actualiza
     
        console.log("response data procesaCierreStock",{data});
        if (data.data.length > 0){
          const ncostotoal=data.data[0].compras-item.costototal;

          actualizaCierreStock(ncostotoal,data.data);
          
          return; 
        };
    })
    .catch((error) => {
      console.log("error" ,error)
      setErrorPrueba(true)
      setErrorText(JSON.stringify(error))

    });
};


  const procesaCierreStockAgrega= (item,per)=>{

    const urlapicst  = `${URL_BASE}${API_SPA_CST1}${per}${API_SPA_CST2}${item.articulo.id}`;
        console.log("procesaCierreStock api",urlapicst);
        axios
        .get(urlapicst, {
          headers: {
            Authorization: `Bearer  ${token}`
          }
        })
        .then(({ data }) => {
            //no existe , agrega actualiza
         
            console.log("response data procesaCierreStock",data.data);
            if (data.data.length > 0){
              const ncostotoal=data.data[0].compras+item.costototal;

              actualizaCierreStock(ncostotoal,data.data);

              return; 
            };

            agregaCierreStock(item,per);        

        })
        .catch((error) => {
          console.log("error")
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });
  };

  // articulo: item.articulo,
  // producto: item.producto,
  // glosa: item.glosa,
  // bodega: item.bodega,
  // cantidad: item.cantidad,
  // precio: item.precio,
  // exento: item.exento,
  // neto: item.neto,
  // tila: item.tila,
  // descuento: item.descuento,
  // recargo: item.recargo,
  // costounitario: item.costounitario,
  // recargoglobal: item.recargoglobal,
  // costototal: item.costototal,
  // retencion: item.retencion,

  const agregaCierreStock=(item,per)=>{
          console.log("agregaCierreStock");
          setIsLoading(true);
          setIsRefetching(true);
      
          axios
              .post(`${URL_BASE}${API_INS_CST}`, {

                data: {
                
                  periodo: per,
                  articulo: item.articulo.id,
                  compras:item.costototal,
                  preciopromedio:item.costototal/item.cantidad,
                  saldounitario:item.cantidad,
                  saldovalor:item.costototal,
                  //la suma de lo mensual de los periodos anteriores
                  comprasacumuladas:0,
                  comprasacumuladasunitanterior:0,
                  comprasacumuladasvaloranterior:0,
                  comprasperiodounit:0,
                  comprasperiodovalor:0,
                  salidasperiodounit:0,
                  salidasperiodovalor:0

                },
              },{    headers:{
                Authorization:`Bearer  ${token}`
              }})
              .then((response) => {
          
                console.log("response :",API_INS_CST,response);
                
                //setMessage(`Agregado ${response.id}`);
                setMessage(`Agregado `);
                setOpenSnack(true);
                setIsLoading(false);
                setIsRefetching(false);
              
            }).catch((error) => {

              console.log(error);
              setErrorPrueba(true);
              setErrorText(JSON.stringify(error));
              setIsLoading(false);
              setIsRefetching(false);

          });
  };
  
  const actualizaCierreStock=(ncostotoal,data)=>{
    console.log("//actualiza CIERRE STOCK");
    setIsLoading(true);
    setIsRefetching(true);


    axios
        .put(`${URL_BASE}${API_UPD_CST}${data[0].id}`, {

          data: {

            compras:ncostotoal,


          },
        },{    headers:{
          Authorization:`Bearer  ${token}`
        }})
        .then((response) => {
    
          console.log("response :",API_INS_CST,response);
          
          //setMessage(`Agregado ${response.id}`);
          setMessage(`Agregado`);
          setOpenSnack(true);
          setIsLoading(false);
          setIsRefetching(false);
        
      }).catch((error) => {

        console.log(error);
        setErrorPrueba(true);
        setErrorText(JSON.stringify(error));
        setIsLoading(false);
        setIsRefetching(false);

    });

};
  const saveMovApi = (values) => {

    values.movimientodocs.forEach((item) => {

      axios
        .post(`${URL_BASE}${API_INS_MDO}`, {

          data: {

            encabezadodoc: values.id,

            articulo: item.articulo,
            producto: item.producto,
            glosa: item.glosa,
            bodega: item.bodega,
            cantidad: item.cantidad,
            precio: item.precio,
            exento: item.exento,
            neto: item.neto,
            tila: item.tila,
            descuento: item.descuento,
            recargo: item.recargo,
            costounitario: item.costounitario,
            recargoglobal: item.recargoglobal,
            costototal: item.costototal,
            retencion: item.retencion,

          },
        }, {
          headers: {
            Authorization: `Bearer  ${token}`
          }
        })
        .then((response) => {

          console.log("Movimiento grabado...", response);
          //actualizando precio

          console.log("actPrecioArticulo", item.articulo.id);
          console.log("actPrecioArticulo", item.precio);

          //solo actualiza ActualizaPrecio si es true
          if (values.documento.swEncabezadoActualizaPrecio) {
            actPrecioArticulo(item.articulo.id, item.precio);
          };
          //si es stock , calcula y actualiza precio promedio ,
          // por ahora y estadistica de compracompra 
          if (values.documento.swEncabezadoStock) {

            //para todos los articulos
            actPrecioPromedioArticulo(item,values.documento);  

            // actualiza costo unitario con fecha cu
            if (item.articulo.cunitmayor < item.precio) {
              actCostoUnitArticulo(
                item.articulo.id,
                item.precio,
                values.fechadoc
              );
            };

            //actualizar cierre yestadistica de compra si es stock
            procesaCierreStockAgrega(item,values.periodo);

          };

        }).catch((error) => {

          console.log(error);
          setErrorPrueba(true);
          setErrorText(JSON.stringify(error));
          setIsLoading(false);
          setIsRefetching(false);

        });
    });

    setOpenSnack(true);
    setIsLoading(false);
    setIsRefetching(false);

  };

  const haySaldoNegativo=async (values)=>{
    if (values.documento.ensa==="S"){
          console.log(" evaluando  haySaldoNegativo ",values);  
          let swRespuesta=false;
          let txtArticulo="";
          for (const ele of values.movimientodocs) {

            const tableDataArticulo=inicialArticulo.filter((element) => element.id===ele.articulo.id);

            await Promise.all([
         
             runCierreReport0(
               valorMesAnterior,
               valorMesProceso,
               tableDataArticulo,
               valueCierre,
               valueMovimientosPeriodo)]).
         
             then(result=>{
         
              // console.log("termina la promesa runCierreReport0 s ======>",result)
             
               let sUnidad=result[0][0][0].saldounitario;
               
               console.log("saldo unidad ========> sUnidad ",sUnidad );
              // console.log("item.unidad ",Number(item.cantidad));
         
               if (  Number(sUnidad) <  Number(ele.cantidad) ){;
                   console.log("Saldo insuficiente para calculo de Precio Promedio"   ,ele.articulo.descripcion);
 
                   txtArticulo=`Articulo :  ${ele.articulo.descripcion}`;
           
                   swRespuesta=true;
              
               };
             });
            
          };

          return {respuesta:swRespuesta,texto:txtArticulo};
    };

    console.log("haySaldoNegativo  no se evalua saldo");

    return false;
  };
  
   
  const handleCreateNewRow = (values) => {

    Promise.all([haySaldoNegativo(values)]).
      then(result=>{
           console.log("result ",result); 

            console.log("proceso de promesa finalizado ",result[0].respuesta);  
            console.log("ahora a grabar .....");

            
         
            //es entrada siempre graba
            if (values.documento.ensa==="E"){

               grabarNewRow(values) ;
               return;
            };

            //es salida y no hay saldo negativo
            if (!result[0].respuesta){
                grabarNewRow(values) ;
                return;
            };

            //es salida y hay saldo negativo
            //sin comportamiento , graba siempre     
            if(!valueComportamiento.length>0){
              console.log("no hay caracteres...... se graba.......");
              grabarNewRow(values) ;
              return;
            };



            //con N no se graba si hay saldo negativo
            if (valueComportamiento.indexOf("N")>-1){
              console.log("Tiene N , no se graba si hay saldo negativo");

              setErrorPrueba(true);
              setErrorText(`No se puede grabar , saldo negativo ! ${result[0].texto}`);
              setIsLoading(false);
              setIsRefetching(false);

              Swal.fire({
                icon: "error",
                title: `saldo insuficiente...${result[0].texto}`,
                text: "no se puede grabar !",
                //footer: '<a href="#">Why do I have this issue?</a>'
              });

              return ;
            };

            //con n Existen saldo negativo. quiere grabar de todos modos?
            if (valueComportamiento.indexOf("n")>-1){
                  //setea dialogo que pregunta si graba de todos modos  
                  Swal.fire({
                    title: 'Existen saldo negativo. quiere grabar de todos modos?',
            
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'No',
                    confirmButtonText: 'Si!'
            
                  }).then(response => {
            
                    if (response.isConfirmed) {

                        grabarNewRow(values) ;
                    
                    };
            
                  });
            
                return ;
            };  
      });
  
 };



 const grabarNewRow = (values) => {

  setIsLoading(true);
  setIsRefetching(true);
  console.log("Grabando api====>", values);
  console.log("movimientos ====>", values);
  console.log("fecha:", values.fechadoc);

  axios
    .post(`${URL_BASE}${API_INS}`, {

      data: {
        users_permissions_user:user.id,
        fechadoc: values.fechadoc,
        periodo: values.periodo,
        vencimiento: values.vencimiento,
        foliodoc: values.foliodoc,
        documento: values.documento,
        proveedor: values.proveedor,
        centroproduccion: values.centroproduccion,
        centroconsumo: values.centroconsumo,
        bodega: values.bodega,
        neto: values.neto,
        total: values.total,
        siva: values.siva,
        sila: values.sila,
        exento: values.exento,
        sdescuento: values.sdescuento,
        descuentoglobal: values.descuentoglobal,
        documentosrelacionado: values.documentosrelacionado,
        foliodocrel: values.foliodocrel,
        srecargo: values.srecargo,
        recargoglobal: values.recargoglobal,
        sretencion: values.sretencion,
        foliointerno: values.foliointerno.toString(),

      },
    }, {
      headers: {
        Authorization: `Bearer  ${token}`
      }
    })
    .then((response) => {

      console.log("reemplazando id =========>", response);
      values.id = response.data.data.id;

      tableData.push(values);
      setTableData([...tableData]);


      ///// agregando el movimiento
      saveMovApi(values);



      //actualizando folio interno
      actFolioDocUser(values.idfoliointerno, Number(values.foliointerno));

      //setMessage(`Agregado ${values.id}`);
      setMessage(`Agregado`);
      setOpenSnack(true);

      setIsLoading(false);
      setIsRefetching(false);

 

    }).catch((error) => {

      console.log(error);
      setErrorPrueba(true);
      setErrorText(JSON.stringify(error));
      setIsLoading(false);
      setIsRefetching(false);

    });
};

  
  const handleEdit = async (values) => {
    //eliminar y crear
  };


  const deleMovApi = (idEncabezado,periodo) => {

    const urlapiidEncabezado = `${URL_BASE}${API_SEL_MDO_REL}${idEncabezado}`;

    console.log("borrado url documento", urlapiidEncabezado);

    axios
      .get(urlapiidEncabezado, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then(({ data }) => {

        console.log("MOVIMIENTOS DATOS====>" + urlapiidEncabezado, data.data);
        const values = data.data;

        values.forEach((item) => {


          console.log("borrando", `${URL_BASE}${API_DEL_MDO}${item.id}`);

          axios
            .delete(`${URL_BASE}${API_DEL_MDO}${item.id}`, {
              headers: {
                Authorization: `Bearer  ${token}`
              }
            })
            .then((response) => {
              console.log("borrado movimiento ",item, response);
              procesaCierreStockDele(item,periodo);
              setMessage(`Movimientos eliminado ${item.id}`);

  
              setOpenSnack(true);

            })
            .catch((error) => {
              setIsLoading(false);
              setIsRefetching(false);

              console.log(error);
              setErrorPrueba(true);
              setErrorText(JSON.stringify(error))

            });
        });

        setIsLoading(false);
        setIsRefetching(false);

      })
      .catch((error) => {
        console.log("error")
        setErrorPrueba(true)
        setErrorText(JSON.stringify(error))

      });

  };


  const handleDeleteRow = useCallback(

    (row) => {

      if (!getValidPeriodo(row.getValue('fechadoc'))){
        setErrorPrueba(true);
        setErrorText("Fecha de documento periodo cerrado!");
        return;

      };

      console.log("id a borrar: ", row.getValue('id'));

      Swal.fire({
        title: 'Seguro quiere borrar?',

        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Si!'

      }).then(response => {

        if (response.isConfirmed) {
          //borra moviientos relacionados
          deleMovApi(row.getValue('id'),row.getValue('periodo'));
          setIsLoading(true);
          setIsRefetching(true);

          //send api delete request here, then refetch or update local table data for re-render
          axios
            .delete(`${URL_BASE}${API_DEL}${row.getValue('id')}`, {
              headers: {
                Authorization: `Bearer  ${token}`
              }
            })

            .then((response) => {
              console.log(response);

              tableData.splice(row.index, 1);
              setTableData([...tableData]);

            })
            .catch((error) => {
              setIsLoading(false);
              setIsRefetching(false);

              console.log(error);
              setErrorPrueba(true);
              setErrorText(JSON.stringify(error))

            });

        };

      });

    },
    [tableData, deleMovApi],
  );

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
        accessorKey: 'documento.descripcion',
        header: 'documento',
        size: 140,

      },
      {
        accessorKey: 'foliodoc',
        header: 'foliodocumento',
        size: 140,

      },
      {
        accessorKey: 'periodo',
        header: 'periodo',
        size: 140,

      },
      {
        accessorKey: 'fechadoc',
        header: 'fechadoc',
        size: 140,

      },
      {
        accessorKey: 'vencimiento',
        header: 'vencimiento',
        size: 140,

      },            
      {
        accessorKey: 'proveedor.razonsocial',
        header: 'proveedor',
        size: 140,

      },
      {
        accessorKey: 'centroproduccion.descripcion',
        header: 'centroproduccion',
        size: 140,

      },
      {
        accessorKey: 'centroconsumo.descripcion',
        header: 'centroconsumo',
        size: 140,

      },
      {
        accessorKey: 'bodega.descripcion',
        header: 'bodega',
        size: 140,

      },
      {
        accessorKey: 'documentosrelacionado.descripcion',
        header: 'doc relac',
        size: 140,

      },
      {
        accessorKey: 'foliodocrel',
        header: 'doc relac',
        size: 140,

      },
      {
        accessorKey: 'neto',
        header: 'neto',
        size: 140,

      },
      {
        accessorKey: 'siva',
        header: 'iva',
        size: 140,

      },
      {
        accessorKey: 'sila',
        header: 'ila',
        size: 140,

      },
      {
        accessorKey: 'sretencion',
        header: 'sretencion',
        size: 140,

      },
      {
        accessorKey: 'total',
        header: 'total',
        size: 140,

      },
      {
        accessorKey: 'sdescuento',
        header: 'suma descuento',
        size: 140,

      },
      {
        accessorKey: 'descuentoglobal',
        header: 'descuento global',
        size: 140,

      },
      {
        accessorKey: 'srecargo',
        header: 'suma recargo',
        size: 140,

      },
      {
        accessorKey: 'recargoglobal',
        header: 'recargo global',
        size: 140,

      },
      {
        accessorKey: 'movimientodocs',
        header: 'movimientodocs',
        size: 140,

      },
      {
        accessorKey: 'foliointerno',
        header: 'foliointerno',
        size: 140,

      },
      {
        accessorKey: 'users_permissions_user.username',
        header: 'usuario',
        size: 140,

      },      
    ],
    [],
  );

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);

  };

  //const columnsCsv=['First Name','Last Name','Addres','City','State']
  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportData = () => {
    let dataCsv = [];

    for (let i = 0; i < tableData.length; i++) {

      const fila = {
        codigo: tableData[i].codigo,
        descripcion: tableData[i].descripcion,
      };
      dataCsv = [...dataCsv, fila];

    };

    csvExporter.generateCsv(dataCsv);
  };


  const get_data_to_pdf = () => {
    let dataPdf = [];

    for (let i = 0; i < tableData.length; i++) {

      const fila = [tableData[i].id,
      tableData[i].codigo,
      tableData[i].descripcion,
      ];
      dataPdf = [...dataPdf, fila];

    };

    return dataPdf;

  }


  const get_column_to_pdf = () => {
    let columnPdf = [];

    for (let i = 0; i < columns.length; i++) {

      columnPdf = [...columnPdf, columns[i].header];

    };

    return columnPdf;
  }

  const downloadPdf = () => {
    const doc = new jsPDF()

    autoTable(doc, { html: '#my-table' })

    doc.text(title, 15, 10);
    autoTable(doc, {

      head: [get_column_to_pdf()],
      body: get_data_to_pdf(),

    })

    doc.save('table.pdf')
  };

  const getValidPeriodo=(fdoc)=>{

    const numeroPeridoFecha=Number(dayjs(String(fdoc).substring(0,7).replace("-","")));
    const numeroPeriodoProceso=Number(valorMesProceso);

    return  numeroPeridoFecha >= numeroPeriodoProceso  ?   true : false;
  };

  const getMovimientos=async ()=>{
          const urlapselimdo  = `${URL_BASE}${API_SEL_MDO}`;
          //    movimientos
          await  axios
          .get(urlapselimdo, {
            headers: {
              Authorization: `Bearer  ${token}`
            }
          })
          .then(({ data }) => {
            
            console.log("movimientos del periodo =======>",data.data);
            setValueMovimientosPeriodo([... data.data]); 
              
          })
          .catch((error) => {
            console.log("error ",error)
            setErrorPrueba(true)
            setErrorText(JSON.stringify(error))
        
          });

  };

  const getArticulos=async ()=>{
      const urlapiart = `${URL_BASE}${API_SEL_ART}`;
      //articulos
      await axios
        .get(urlapiart, {
          headers: {
            Authorization: `Bearer  ${token}`
          }
        })
        .then(({ data }) => {

          console.log("ART ====>" + urlapiart, data.data);
          setInicialArticulo([...data.data]);

        })
        .catch((error) => {
          console.log("error")
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });    
  };


  useEffect(() => {

    setTitulomod('');
    setTitle(inicialEncabezadoDoc.title);
    setSubTitle(inicialEncabezadoDoc.subtitle);
    setIsLoading(true);
    setIsRefetching(true);

    const urlapi = `${URL_BASE}${API_SEL}`;
    const urlapidoc = `${URL_BASE}${API_SEL_DOC}`;
    const urlapipro = `${URL_BASE}${API_SEL_PRO}`;
    const urlapicpr = `${URL_BASE}${API_SEL_CPR}`;
    const urlapicco = `${URL_BASE}${API_SEL_CCO}`;
    const urlapibod = `${URL_BASE}${API_SEL_BOD}`;

    const urlapiprd = `${URL_BASE}${API_SEL_PRD}`;
    const urlapitil = `${URL_BASE}${API_SEL_TIL}`;
    const urlapipar = `${URL_BASE}${API_SEL_PAR}`;
    const urlapicst  = `${URL_BASE}${API_SEL_CST}`;

    
    const cargaStrapi = async () => {

        //cierres
        console.log("url cierres",urlapicst);
        axios
        .get(urlapicst, {
          headers: {
            Authorization: `Bearer  ${token}`
          }
        })
        .then(({ data }) => {
          console.log("todos los cierres",data.data);
        
          setValueCierre([...data.data]); 
            
        })
        .catch((error) => {
          console.log("error ",error)
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))
    
        });



        //parametros
        await axios
        .get(urlapipar,{    headers:{
          Authorization:`Bearer  ${token}`
        }})
        .then(({ data }) => {
         

          setValorMesProceso(data.data[0].mesproceso);

          console.log("mes proceso ",data.data[0].mesproceso);
          
          const {valueAnoR, valueMesR} =getMesAnoCierre(data.data[0].mesproceso);
    
          // setValueAno(valueAnoR);
          // setValueMes(valueMesR);
          setValueDiasadicionalperiodoactual(data.data[0].diasadicionalperiodoactual);
          setValueComportamiento(data.data[0].comportamientogeneral);

          const apar=data.data[0].mesproceso.substring(0,4);
          const mpar=data.data[0].mesproceso.substring(4,7);
          const fechaParaBuscarAnterior=`${apar}-${mpar}-02`;

          console.log("fechaParaBuscarAnterior ",fechaParaBuscarAnterior);
          const pAnterior=getAaaaMmAnterior(fechaParaBuscarAnterior);
          console.log("pAnterior  ::=====>",pAnterior);
          setValorMesAnterior(pAnterior);
   


          getMovimientos();
          getArticulos();


        })
        .catch((error) => {
          console.log("error")
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))
         
        });
    
    
      //documento
      await axios
        .get(urlapidoc, {
          headers: {
            Authorization: `Bearer  ${token}`
          }
        })
        .then(({ data }) => {

          console.log("DOC ====>" + urlapidoc, data.data);
          setInicialDocumentos([...data.data]);

        })
        .catch((error) => {
          console.log("error")
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });

      //proveedor
      await axios
        .get(urlapipro, {
          headers: {
            Authorization: `Bearer  ${token}`
          }
        })
        .then(({ data }) => {

          console.log("PRO ====>" + urlapipro, data.data);
          setInicialProveedores([...data.data]);

        })
        .catch((error) => {
          console.log("error")
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });

      //centroproduccion
      await axios
        .get(urlapicpr, {
          headers: {
            Authorization: `Bearer  ${token}`
          }
        })
        .then(({ data }) => {

          console.log("CPR ====>" + urlapicpr, data.data);
          setInicialCentroProduccion([...data.data]);

        })
        .catch((error) => {
          console.log("error")
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });

      //centroconsumo
      await axios
        .get(urlapicco, {
          headers: {
            Authorization: `Bearer  ${token}`
          }
        })
        .then(({ data }) => {

          console.log("CCO ====>" + urlapicco, data.data);
          setInicialCentroConsumo([...data.data]);

        })
        .catch((error) => {
          console.log("error")
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });
      //bodega
      await axios
        .get(urlapibod, {
          headers: {
            Authorization: `Bearer  ${token}`
          }
        })
        .then(({ data }) => {

          console.log("BOD ====>" + urlapicco, data.data);
          setInicialBodega([...data.data]);

        })
        .catch((error) => {
          console.log("error")
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });

      //productos
      await axios
        .get(urlapiprd, {
          headers: {
            Authorization: `Bearer  ${token}`
          }
        })
        .then(({ data }) => {

          console.log("PRD ====>" + urlapiprd, data.data);
          setInicialProducto([...data.data]);

        })
        .catch((error) => {
          console.log("error")
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });
      //todos los documentos 
      await axios
        .get(urlapi, {
          headers: {
            Authorization: `Bearer  ${token}`
          }
        })
        .then(({ data }) => {

          console.log("DATOS====>" + urlapi, data.data);
          setTableData([...data.data]);
          setIsLoading(false);
          setIsRefetching(false);

        })
        .catch((error) => {
          console.log("error")
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });

      //tabla ila
      await axios
        .get(urlapitil, {
          headers: {
            Authorization: `Bearer  ${token}`
          }
        })
        .then(({ data }) => {

          console.log("DATOS====>" + urlapi, data.data);
          setInicialTablaIla([...data.data]);
          setIsLoading(false);
          setIsRefetching(false);

        })
        .catch((error) => {
          console.log("error")
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });

    };

    cargaStrapi();
  

  }, []);
  return (
    <>

      {errorPrueba &&
        <Alert onClose={() => setErrorPrueba(false)} variant="outlined" severity="error">
          {errorText} This is an error alert — check it out!
        </Alert>
      }

      <Snackbar open={openSnack}
        autoHideDuration={3000}
        onClose={handleClose}

        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      <Box m="20px">
        <Header
          title={title}
          subtitle={subTitle}
        />
      </Box>

      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns}
        initialState={{ columnVisibility: { movimientodocs: false } }} //id no visible

        // data={get_solo_para_tabla()}
        data={tableData}
        localization={MRT_Localization_ES}
        enableTopToolbar={true} //hide top toolbar
        enableBottomToolbar={true} //hide bottom toolbar
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing


        renderToolbarInternalActions={({ table }) => (
          <>
            <ActionIcon
              onClick={() => {

                // window.print();
                downloadPdf();

              }}
            >
              <Print />
            </ActionIcon>

            <ActionIcon
              onClick={() => {
                handleExportData();
              }}
            >
              <CloudDownload />
            </ActionIcon>

            {/* built-in buttons (must pass in table prop for them to work!) */}
            <MRT_ToggleGlobalFilterButton table={table} />
            <MRT_ShowHideColumnsButton table={table} />
            <MRT_FullScreenToggleButton table={table} />
          </>
        )}

        state={{
          isLoading,
          showProgressBars: isRefetching
        }}

        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="View">
              <IconButton onClick={() => {

     
                console.log("modificando");
                console.log("row.original.users_permissions_user ",row.original.users_permissions_user); 


                setTitulomod(`${title} Modifica registro Id ${row.original.id} user:${row.original.users_permissions_user.username}`);
                setRowData(row);

                const modificar = {
                  id: row.original.id,
                  codigo: row.original.codigo,
                  fechadoc:row.original.fechadoc,
                  vencimiento:row.original.vencimiento,
                  descripcion: row.original.descripcion,
                  documento: row.original.documento,
                  foliodoc: row.original.foliodoc,
                  proveedor: row.original.proveedor,
                  documentosrelacionado: row.original.documentosrelacionado,
                  foliodocrel: row.original.foliodocrel,
                  centroproduccion: row.original.centroproduccion,
                  centroconsumo: row.original.centroconsumo,
                  bodega: row.original.bodega,
                  movimientodocs: row.original.movimientodocs,
                  exento: row.original.exento,
                  neto: row.original.neto,
                  siva: row.original.siva,
                  sila: row.original.sila,
                  sretencion: row.original.sretencion,
                  total: row.original.total,
                  sdescuento: row.original.sdescuento,
                  descuentoglobal: row.original.descuentoglobal,
                  srecargo: row.original.srecargo,
                  recargoglobal: row.original.recargoglobal,
                  foliointerno: row.original.foliointerno,
                 

                };

                console.log(modificar);
                setSwVista(row.original.documento);
                setInicial(modificar);
                setDeshabilitado(true);
                setCreateModalOpen(true);

              }

              }>
                <ViewColumn />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => {
              //actualiza todos los movimientos
              getMovimientos();
              //actualiza todos los articulos
              getArticulos();
              
              // console.log("doc add",inicialDocumentos);
              setIsLoading(true);
              setIsRefetching(true);
              setSwVista(inicialDocumento);
              timer.current = window.setTimeout(() => {

                setDeshabilitado(false);
                setInicial(inicialEncabezadoDoc);
                setTitulomod(`${title} Nuevo registro`);
                setCreateModalOpen(true)
              }, 2000);


            }}
            variant="contained"
          >
            <Add />
          </Button>
        )}
      />
      <ModalEncabezadoDoc

        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={grabarNewRow}

        //onSubmit={handleCreateNewRow}
        onEdit={handleEdit}
        inicial={inicial}
        tableData={tableData}
        titulomod={titulomod}
        deshabilitado={deshabilitado}
        ofProgress={() => {

          setIsLoading(false);
          setIsRefetching(false);
        }}
        inicialDocumentos={inicialDocumentos}
        inicialProveedores={inicialProveedores}
        inicialCentroProduccion={inicialCentroProduccion}
        inicialCentroConsumo={inicialCentroConsumo}
        inicialBodega={inicialBodega}
        inicialArticulo={inicialArticulo}
        inicialProducto={inicialProducto}
        inicialTablaIla={inicialTablaIla}
        swVista={swVista}
        setSwVista={setSwVista}
        valorMesProceso={valorMesProceso}
        valueDiasadicionalperiodoactual={valueDiasadicionalperiodoactual}
        valorMesAnterior={valorMesAnterior}
        valueCierre={valueCierre}
        valueMovimientosPeriodo={valueMovimientosPeriodo}
        valueComportamiento={valueComportamiento}
      />

    </>
  );
};



export default Encabezadodoc;
