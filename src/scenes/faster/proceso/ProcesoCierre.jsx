import React, { useCallback, useMemo, useState, useEffect, useContext } from 'react';
import axios from "axios";


import Swal from "sweetalert2";

import Header from "../../../components/Header";
//import dayjs from 'dayjs';
//import getPeriodo from '../helpers/getPeriodo';
import runCierreReport0 from "../helpers/runCierreReport0";
import { getMesAnoCierre, getAaaaMmAnterior, getAaaaMmSiguiente } from "../helpers/getMesAnoCierre";
import { mesesNumero } from '../../../data/makeDataCrud';
//import runCierre from "../helpers/runCierre";
//import BasicDocument from "../helpers/pdfView";
import MaterialReactTable,
{
  MRT_FullScreenToggleButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  Grid,
 // IconButton,
 // TextField,
  MenuItem,

  Select,
  //SelectChangeEvent,
  Stack,
  //Tooltip,
} from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { Delete, Edit, Add } from '@mui/icons-material';
import InputLabel from '@mui/material/InputLabel';

import LinearProgress from '@mui/material/LinearProgress';

import Snackbar from '@mui/material/Snackbar';
import { RestaurantRounded, Save } from '@mui/icons-material';

import CloudDownload from "@mui/icons-material/CloudDownload";
import Print from "@mui/icons-material/Print";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import { ActionIcon } from '@mantine/core';

// import { data } from '../../../data/makeDataCrud';

// import { ModalGen } from '../modal/ModalGen';

//import esUnico from '../helpers/esUnico';
import { AuthContext } from "../../../mycontext";
//import { headers } from 'next/dist/client/components/headers';


//consulta maestro de articulos completo stock true
//consultar movimiento anterior de cierre con saldo mayor a 0
//saldo inicial de uninades y valores
//consulta movimientos del periodo. indexando por fecha :
//prioridad documentos de entrada y despues salida diaria
//borra registros existentes y graba resultado en periodo actual de cierre. 


const URL_BASE = process.env.REACT_APP_URL_BASE;

//tabla cierrestock
const APP_API_SEL_CST = process.env.REACT_APP_API_SEL_CST;
//const API_SPA_CST1 = process.env.REACT_APP_API_SPA_CST1;
//const API_SPA_CST2 = process.env.REACT_APP_API_SPA_CST2;
const API_DEL_CST = process.env.REACT_APP_API_DEL_CST;
const API_INS_CST = process.env.REACT_APP_API_INS_CST;


//bodega cierre stock
const API_SEL_BCS = process.env.REACT_APP_API_SEL_BCS; 
const API_INS_BCS = process.env.REACT_APP_API_INS_BCS;
const API_UPD_BCS = process.env.REACT_APP_API_UPD_BCS;
const API_DEL_BCS = process.env.REACT_APP_API_DEL_BCS;

//movimientos documentos
const REACT_APP_API_SEL_MDO = process.env.REACT_APP_API_SEL_MDO;
//movimientos documentos periodo articulo
//const REACT_APP_API_SEP_MDO_REL_PER1 = process.env.REACT_APP_API_SEP_MDO_REL_PER1;
//const REACT_APP_API_SEP_MDO_REL_PER2 = process.env.REACT_APP_API_SEP_MDO_REL_PER2;

//sel articulos
const API_SEL_ART = process.env.REACT_APP_API_SEL_ART;

//parametros
const API_SEL_PAR = process.env.REACT_APP_API_SEL_PAR;
const API_UPD_PAR = process.env.REACT_APP_API_UPD_PAR;


//Bodegas
const API_SEL_BOD=process.env.REACT_APP_API_SEL_BOD;
const API_INS_BOD=process.env.REACT_APP_API_INS_BOD;
const API_UPD_BOD=process.env.REACT_APP_API_UPD_BOD;
const API_DEL_BOD=process.env.REACT_APP_API_DEL_BOD;




// const mesesNumero=
// [ {id:1  ,mes:'Enero' ,numeromes:'01'},
//   {id:2  ,mes:'Febrero' ,numeromes:'02'},
//   {id:3  ,mes:'Marzo' ,numeromes:'03'},
//   {id:4  ,mes:'Abril' ,numeromes:'04'},
//   {id:5  ,mes:'Mayo' ,numeromes:'05'},
//   {id:6  ,mes:'Junio' ,numeromes:'06'},
//   {id:7  ,mes:'Julio' ,numeromes:'07'},
//   {id:8  ,mes:'Agosto' ,numeromes:'08'},
//   {id:9  ,mes:'Septiembre' ,numeromes:'09'},
//   {id:10 ,mes:'Octubre' ,numeromes:'10'},
//   {id:11 ,mes:'Noviembre' ,numeromes:'11'},
//   {id:12 ,mes:'Diciembre' ,numeromes:'12'},

// ];
/*
id:ide,
documento:doc,
fecha:fec,
articulo:art,
descripcion:ades,
glosa:glo,
periodo:per,
entradaMovimientoUnidad:emu,
entradaMovimientoValor:emv,
salidaMovimientoUnidad:smu,
salidaMovimientoValor:smv,
precioPromedio:pre,
saldoUnidad:sun,
saldoValor:sva,
*/
const head = [
  {
    header: 'ID',

  }
  , {
    header: "periodo",

  }
  , {
    header: "articulo",

  },
  {
    header: "precio Promedio",

  },
  {
    header: "saldo Unitario",

  }, {
    header: "saldo valor",
  }];

const columns = [
  {
    header: 'ID',
  },
  {
    header: 'documento',

  },
  {
    header: 'fecha',
  },
  {
    header: 'articulo',
  },
  {
    header: 'descripcion',
  },
  {
    header: 'glosa',
  },
  {
    header: 'periodo',
  },
  {
    header: 'entradaMovimientoUnidad',
  },
  {
    header: 'entradaMovimientoValor',
  },
  {
    header: 'salidaMovimientoUnidad',
  },
  {
    header: 'salidaMovimientoValor',
  },
  {
    header: 'precioPromedio',
  },
  {
    header: 'saldoUnidad',
  },
  {
    header: 'saldoValor',
  },

];

const ProcesoCierre = () => {

  const { user } = useContext(AuthContext);
  const { token } = user;
  const [title, setTitle] = useState('Proceso periodo');
  const [subTitle, setSubTitle] = useState('Cierre stock');

  const [errorPrueba, setErrorPrueba] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isEnableButton, setIsEnableButton] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [valorPeriodoAnterior, setValorPeriodoAnterior] = useState("");
  const [valorPeriodoCerrar, setValorPeriodoCerrar] = useState("");
  //const [valueEstado, setValueEstado] = useState("");

  const [progress, setProgress] = useState(0);

  const [tableDataBodega, setTableDataBodega] = useState([]);
  const [tableDataArticulo, setTableDataArticulo] = useState([]);
  const [valueCierre, setValueCierre] = useState([]);
  const [valueCierreBodega, setValueCierreBodega] = useState([]);
  const [valueAAno, setValueAAno] = useState([]);

  const [valueParametroEmpresa, setValueParametroEmpresa] = useState("");
  const [valueAno, setValueAno] = useState("");
  const [valueMes, setValueMes] = useState("");
  const [valueMovimientosPeriodo, setValueMovimientosPeriodo] = useState([]);

  const [valueProgres, setValueProgres] = useState(true);

  //const [valuePeriodo, setValuePeriodo] = useState('');
  const [valueIdParametro, setValueIdParametro] = useState(0);


  const [tableData, setTableData] = useState([]);
  //const [tableDataCierres, setTableDataCierres] = useState([]);

  const [isRefetching, setIsRefetching] = useState(false);


  const handleCloseDialog = () => {

    setOpenDialog(false);

    downloadPdfError();
  };


  const columnsCierre = useMemo(
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
        accessorKey: 'periodo',
        header: 'periodo',
        size: 80,
      },
      {
        accessorKey: 'articulo.descripcion',
        header: 'articulo',
        size: 80,
      },
      {
        accessorKey: 'preciopromedio',
        header: 'precio promedio',
        size: 80,
      },
      {
        accessorKey: 'saldounitario',
        header: 'saldo unitario',
        size: 80,
      },
      {
        accessorKey: 'saldovalor',
        header: 'saldo valor',
        size: 80,
      },

    ],
    [],
  );
  const get_data_to_pdfError = () => {
    let dataPdf = [];

    for (let i = 0; i < tableData.length; i++) {
      console.log("haciendo pdf", tableData[i]);
      const fila = [tableData[i].id,
      tableData[i].documento,
      tableData[i].fecha,
      tableData[i].articulo,
      tableData[i].descripcion,
      tableData[i].glosa,
      tableData[i].periodo,
      tableData[i].entradaMovimientoUnidad,
      tableData[i].entradaMovimientoValor,
      tableData[i].salidaMovimientoUnidad,
      tableData[i].salidaMovimientoValor,
      tableData[i].precioPromedio,
      tableData[i].saldoUnidad,
      tableData[i].saldoValor,


      ];
      dataPdf = [...dataPdf, fila];

    };

    return dataPdf;

  }

  const get_column_to_pdfError = () => {
    let columnPdf = [];

    for (let i = 0; i < columns.length; i++) {

      columnPdf = [...columnPdf, columns[i].header];

    };

    return columnPdf;
  }


  // const downloadPdf=()=>{
  //   const doc = new jsPDF({
  //     unit: "pt",
  //     orientation: "p",
  //     lineHeight: 1.2
  //   });

  //   doc.addFont("Arimo-Regular.ttf", "Arimo", "normal");
  //   doc.addFont("Arimo-Bold.ttf", "Arimo", "bold");
  //   doc.setFont("Arimo");
  //   //doc.setFontType("normal");
  //   doc.setFontSize(28);
  //   doc.text("Hello, World!", 100, 100);
  //   //doc.setFontType("bold");
  //   doc.text("Hello, BOLD World!", 100, 150);
  //   doc.save("customFonts.pdf");
  // };
  const downloadPdfError = () => {
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });

    autoTable(doc, { html: '#my-table' })

    doc.text(`${valueParametroEmpresa} ${title}`, 15, 10);

    //[255, 0, 0] 
    //[0, 255, 0]
    autoTable(doc, {
      styles: { fillColor: [255, 0, 0] },
      columnStyles: { 0: { halign: 'center', fillColor: 255 } }, // Cells in first column centered and green


      fontSize: 6,

      margin: { top: 10 },
      head: [get_column_to_pdfError()],
      body: get_data_to_pdfError(),

    })

    doc.save('table.pdf')
  };


  //desde el año anterior
  const anoList = () => {

    const d = new Date();
    const n = d.getFullYear();

    for (let i = n; i >= d.getFullYear() - 1; i--) {


      const obano = { id: i, ano: i.toString() };
      console.log("obano: ", obano);
      valueAAno.push(obano);


      setValueAAno([...valueAAno]);

    };
    //console.log("value ano ",valueAAno);
  };

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);

  };

  const dialogoNoProcesa = () => {
    Swal.fire({
      title: `Genera informe de error ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si!'

    }).then(response => {

      if (response.isConfirmed) {
        setIsEnableButton(false);
        setProgress(true);

        cierre(false);


      };

    });
  };

  const handleCierre = () => {

    Swal.fire({
      title: `Se generaran registros de cierre de articulos : ${title} esta seguro?  `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si!'

    }).then(response => {

      if (response.isConfirmed) {

        setIsEnableButton(false);
        setProgress(true);

        cierre(true);

        return;
      };

      dialogoNoProcesa();

    });
  };

  const borraCierreFor = async (pActual) => {
    //solo los del periodo a cerrar
    const regCierrePeriodo = valueCierre.filter((arti => {
      return String(arti.periodo) === String(pActual)
    })
    );
    //borrando periodo  cierre  para grabar nuevos

    for (const item of regCierrePeriodo) {
      console.log("borrando =====>", item);

      await axios
        .delete(`${URL_BASE}${API_DEL_CST}${item.id}`, {
          headers: {
            Authorization: `Bearer  ${token}`
          }
        })

        .then(({ data }) => {
          console.log("borrado =>>>>>", data, data);


        })
        .catch((error) => {
          console.log("error", error)
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        }).finally(() => {
          // siempre sera executado

          console.log("fin borrado =====>", item);
        });
    };

    return "Fin borraCierreFor=============>";
    //getCierres();

  };
    const cierre = (graba) => {

    //cerrando junio
    //'2024-06-01'
    console.log("mes de cierre ", valueMes);
    console.log("ano cierre", valueAno);

    const foundMes = mesesNumero.find((element) => String(element.mes) === valueMes);

    console.log("foundMes ", foundMes);

    const mesDeCierre = `${valueAno}-${foundMes.numeromes}`;
    //const mesDeCierre='2024-06';
    console.log("mesDeCierre ", mesDeCierre);

    const fechaParaBuscarAnterior = `${mesDeCierre}-02`;
    const periodoSiguiente = getAaaaMmSiguiente(fechaParaBuscarAnterior);

    console.log("periodoSiguiente: ", periodoSiguiente);

    const pCerrar = (mesDeCierre.replace("-", ""));

    setValorPeriodoCerrar(pCerrar);

    const pAnterior = getAaaaMmAnterior(fechaParaBuscarAnterior);

    setValorPeriodoAnterior(pAnterior);

    //const aGrabarCierre=runCierre(pAnterior,pCerrar,tableDataArticulo,valueCierre,valueMovimientosPeriodo);
    console.log("Inicio de borrado cierre del periodo a cerrar=========> ");

    //borraCierreFor(pCerrar);
    Promise.all([borraCierreFor(pCerrar)]).

      then(result => {

        console.log("ahora vamos al cierre ======>", result)

        const aGrabarCierre = runCierreReport0(
          pAnterior,
          pCerrar,
          tableDataArticulo,
          valueCierre,
          valueMovimientosPeriodo);

        console.table(aGrabarCierre[2]);

        setTableData([...aGrabarCierre[2]]);

        if (aGrabarCierre[2].length > 0) {

          setOpenDialog(true);
          
        };

        if (graba) {

          grabaCierre(aGrabarCierre[0], periodoSiguiente,pAnterior,pCerrar);

        };

      });

  };

  const grabaCierre = (aGrabar, periodoSiguiente,pAnterior,pCerrar) => {

    aGrabar.forEach((item) => {

      cierrePeriodoArticulo(item,pAnterior,pCerrar);

    });
    //este lo actualiza parametros
    actualizaPeriodoProceso(periodoSiguiente);


    //proceso de cierre por bodega
    //cierreBodega(periodoSiguiente,pAnterior,pCerrar);
    
  };
  //cierre de articulo periodo 
  const cierrePeriodoArticulo = (dataCierre,pAnterior,pCerrar,) => {

    setIsLoading(true);

    axios
      .post(`${URL_BASE}${API_INS_CST}`, {

        data: dataCierre,
      }, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then((response) => {
        console.log("response cierrePeriodoArticulo ====>",response.data.data);
       
        


        //agregar aqui cierre por bodega 
        cierreBodega(pAnterior,pCerrar,response.data.data);
        
        
        
        setMessage(`Agregado `);
        setOpenSnack(true);

        setIsLoading(false);


      }).catch((error) => {

        console.log(error, error);
        setErrorPrueba(true);
        setErrorText(JSON.stringify(error));
        setIsLoading(false);


      });

  }; 


  const cierreBodega = (pAnterior,pCerrar,responseData) => {

    console.log("pAnterior Bodega", pAnterior);
    console.log("pCerrar Bodega",pCerrar);
 
     //obtener tODAS LAS BODEGas
     //loop por cada una 
     for (const elementBod of tableDataBodega) {
          console.log("procesando bodega ...",elementBod);
          Promise.all([borraCierreForBodega(pCerrar)]).
 
          then(result => {
    
                console.log("ahora vamos al cierre Bodega======>", result)

                console.log("Luis1 valueMovimientosPeriodo=======°",valueMovimientosPeriodo);
        
    
                const tableDataArticuloCierreBodega=tableDataArticulo.filter((artiSolo=>
                  {
              
                    return  artiSolo.id===responseData.articulo.id ;
                  })
                );

        
                //filtrar movimientos solo bodega en curso

                const regCierreAnteriorArticuloBodega = valueCierreBodega.filter((artiCierreBod=>
                    {
                      
                      //cierre bodega . arrticulo bodega
                      return  artiCierreBod.articulo.id===responseData.articulo.id && artiCierreBod.bodega.id===elementBod.id ;
                    })
                );

              //  console.log("regCierreAnteriorArticuloBodega array ===> ",regCierreAnteriorArticuloBodega); 

                const valueMovimientosPeriodoBodega= valueMovimientosPeriodo.filter((regArtBod=>
                  {
                    //console.log("artiCierreBod.articulo.id",artiCierreBod.articulo.id); 
                    return regArtBod.articulo.id===responseData.articulo.id && regArtBod.bodega.id===elementBod.id ;
                  })
                );


               if (responseData.articulo.id===56 && elementBod.id===1){
                   
                    console.log("Luis2 valueMovimientosPeriodoBodega====>>>> ",valueMovimientosPeriodoBodega);  

               };

                const aGrabarCierreBodega = runCierreReport0(
                  pAnterior,
                  pCerrar,
                  tableDataArticuloCierreBodega,
                  regCierreAnteriorArticuloBodega,
                  valueMovimientosPeriodoBodega);
              
                grabaCierreBodega(aGrabarCierreBodega[0],responseData.id,elementBod.id);

          });
 
     };
 
   };
   
   const grabaCierreBodega = (aGrabar,idCierreTotal,idBodega) => {

        aGrabar.forEach((item) => {

          item.cierrestock=idCierreTotal;
          item.bodega=idBodega;
          
          cierrePeriodoArticuloBodega(item);

        });

  };
  
  //cierre de articulo periodo 
  const cierrePeriodoArticuloBodega = (item) => {

    setIsLoading(true);

    axios
      .post(`${URL_BASE}${API_INS_BCS}`, {

        data: item,
      }, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then((response) => {
        console.log(response);
        setMessage(`Agregado `);
        setOpenSnack(true);

        setIsLoading(false);


      }).catch((error) => {

        console.log(error, error);
        setErrorPrueba(true);
        setErrorText(JSON.stringify(error));
        setIsLoading(false);

      });

  };
  


  const borraCierreForBodega = async (pActual) => {
    //solo los del periodo a cerrar
    const regCierrePeriodoBodega = valueCierreBodega.filter((arti => {
      return String(arti.periodo) === String(pActual)
    })
    );

    //borrando periodo  cierre bodega  para grabar nuevos

    for (const item of regCierrePeriodoBodega) {
      console.log("borrando =====>", item);

      await axios
        .delete(`${URL_BASE}${API_DEL_BCS}${item.id}`, {
          headers: {
            Authorization: `Bearer  ${token}`
          }
        })

        .then(({ data }) => {
          console.log("borrado =>>>>>", data, data);


        })
        .catch((error) => {
          console.log("error", error)
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        }).finally(() => {
          // siempre sera executado

          console.log("fin borrado =====>", item);
        });
    };

    return "Fin borraCierreFor=============>";
    //getCierres();

  };


  const handleChangeAno = (event) => {
    console.log(event.target.value);
    setValueAno(event.target.value);
    setTitulo(valueMes, event.target.value);
  };
  


  const actualizaPeriodoProceso = (mespro) => {
    axios
      .put(`${URL_BASE}${API_UPD_PAR}${valueIdParametro}`, {
        data: {
          mesproceso: mespro
        },
      }, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then((response) => {
        //console.log(response);
        setIsLoading(false);

        setMessage(`Modificado `);
        setOpenSnack(true);

        setProgress(false);

        getCierres();
    
        //actualiza proceso cierre titulos
        const { valueAnoR, valueMesR } = getMesAnoCierre(mespro);
        setValueAno(valueAnoR);
        setValueMes(valueMesR);

      }).catch((error) => {

        console.log(error);
        setErrorPrueba(true)
        setErrorText(JSON.stringify(error));

      }).finally(() => {
        // siempre sera executado

      });
  };

  const handleChangeMes = (event) => {
    console.log(event.target.value);
    setValueMes(event.target.value);
    setTitulo(event.target.value, valueAno);
  };

  const setTitulo = (mest, anot) => {
    setTitle(`proceso cierre periodo  : ${mest} ${anot}  `);

  };

  //snack
  const [state] = useState({
    vertical: 'top',
    horizontal: 'center',
  });

  const { vertical, horizontal } = state;
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState(false);

  const getCierres = () => {


    const urlapicst = `${URL_BASE}${APP_API_SEL_CST}`;
    console.log("url cierres", urlapicst);
    axios
      .get(urlapicst, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then(({ data }) => {
        console.log("todos los cierres", data.data);

        setValueCierre(data.data);

        getCierreBodega();

      })
      .catch((error) => {
        console.log("error ", error)
        setErrorPrueba(true)
        setErrorText(JSON.stringify(error))

      });
  };

  const getCierreBodega = () => {

    const urlapicst = `${URL_BASE}${API_SEL_BCS}`;
    console.log("url bodega cierra", urlapicst);
    axios
      .get(urlapicst, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then(({ data }) => {
        console.log("todos los cierres bodega", data.data);

        setValueCierreBodega(data.data);

      })
      .catch((error) => {
        console.log("error ", error)
        setErrorPrueba(true)
        setErrorText(JSON.stringify(error))

      });
  };


  const getParametro = async () => {

    await axios
      .get(`${URL_BASE}${API_SEL_PAR}`, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then(({ data }) => {

        console.log("parametros",data.data[0]);
        
        setValueParametroEmpresa(data.data[0].empresa);
        // setValuePeriodo(data.data[0].mesproceso);
        setValueIdParametro(data.data[0].id);

        const { valueAnoR, valueMesR } = getMesAnoCierre(data.data[0].mesproceso);
  
        setValueAno(valueAnoR);
        setValueMes(valueMesR);

        setTitulo(valueMesR, valueAnoR);


      })
      .catch((error) => {
        console.log("error")
        setErrorPrueba(true)
        setErrorText(JSON.stringify(error))

      });

  };

  const getArticulos = () => {

    const urlapiart = `${URL_BASE}${API_SEL_ART}`

    axios
      .get(urlapiart, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then(({ data }) => {
        console.log("articulos", data.data);
        setTableDataArticulo([...data.data]);

      })
      .catch((error) => {
        console.log("error", error);
        setErrorPrueba(true);
        setErrorText(JSON.stringify(error))

      });

  };

  const getMovimientos = () => {

    const urlapselimdo = `${URL_BASE}${REACT_APP_API_SEL_MDO}`;
    console.log("url movperiodo cerrar", urlapselimdo);
    axios
      .get(urlapselimdo, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then(({ data }) => {

        console.log("movimientos ", data.data);
        setValueMovimientosPeriodo([...data.data]);
        setValueProgres(false);

      })
      .catch((error) => {
        console.log("error ", error)
        setErrorPrueba(true)
        setErrorText(JSON.stringify(error))

      });
  };
  const getBodegas = () => {

    const urlapiart = `${URL_BASE}${API_SEL_BOD}`;

    axios
      .get(urlapiart, {
        headers: {
          Authorization: `Bearer  ${token}`
        }
      })
      .then(({ data }) => {
        console.log("bodegas", data.data);
        setTableDataBodega([...data.data]);

      })
      .catch((error) => {
        console.log("error", error);
        setErrorPrueba(true);
        setErrorText(JSON.stringify(error))

      });

  };
  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: head.map((c) => c.header),
  };
  //headers: columns.map((c) => c.header),
  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportData = () => {
    let dataCsv = [];

    for (let i = 0; i < valueCierre.length; i++) {

      const fila = {
        id: valueCierre[i].id,
        periodo: valueCierre[i].periodo,
        articulo: valueCierre[i].articulo.descripcion,
        preciopromedio: valueCierre[i].preciopromedio,
        saldounitario: valueCierre[i].saldounitario,
        saldovalor: valueCierre[i].saldovalor,
      };
      dataCsv = [...dataCsv, fila];

    };

    csvExporter.generateCsv(dataCsv);
  };


  const get_data_to_pdf = () => {
    let dataPdf = [];

    for (let i = 0; i < valueCierre.length; i++) {

      const fila = [valueCierre[i].id,
      valueCierre[i].periodo,
      valueCierre[i].articulo.descripcion,
      valueCierre[i].preciopromedio,
      valueCierre[i].saldounitario,
      valueCierre[i].saldovalor,

      ];
      dataPdf = [...dataPdf, fila];

    };

    return dataPdf;

  }

  const get_column_to_pdf = () => {
    let columnPdf = [];

    for (let i = 0; i < columnsCierre.length; i++) {

      columnPdf = [...columnPdf, columnsCierre[i].header];

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

  useEffect(() => {

    getArticulos();
    getMovimientos();
    getParametro();
    getCierres();
    getCierreBodega();
    getBodegas();
    anoList();


  }, []);


  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Errores en calculo de precio promedio"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            El proceso {title} ha generado errores.
            Se descarga un informe.
          </DialogContentText>
        </DialogContent>
        <DialogActions>

          <Button onClick={handleCloseDialog} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>


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
          title={`${valueParametroEmpresa} ${title}`}
          subtitle={subTitle}
        />

      </Box>
      <Grid container spacing={1}>
        <Grid item sx={{ pl: 2 }}>
          <InputLabel id="meses-proceso">Proceso</InputLabel>
          <Button
            disabled={isEnableButton}
            color="secondary"
            onClick={handleCierre}
            variant="contained"
          >

            <Save />

          </Button>
        </Grid>
        <Grid item xs={1}>
          <InputLabel id="meses-numero">Mes</InputLabel>
          <Select
            labelId="meses-numero"
            id="meses-numero"
            label="Mes"
            value={valueMes || ""}
            onChange={handleChangeMes}
          >
            {mesesNumero.map(option => (
              <MenuItem key={option.id} value={option.mes}>
                {option.mes}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={1}>
          <InputLabel id="ano-numero">Año</InputLabel>
          <Select
            labelId="ano-numero"
            id="ano-numero"
            label="Ano"
            value={valueAno || ""}
            onChange={handleChangeAno}
          >
            {valueAAno.map(option => (
              <MenuItem key={option.id} value={option.ano}>
                {option.ano}
              </MenuItem>
            ))}
          </Select>
        </Grid>

      </Grid>


      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columnsCierre}
        data={valueCierre}
        enableColumnActions= {false}
        localization={MRT_Localization_ES}
        enableTopToolbar={true} //hide top toolbar
        enableBottomToolbar={true} //hide bottom toolbar
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

        editingMode="modal" //default
      
        enableColumnOrdering
       // enableEditing
        state={{
          isLoading,
          showProgressBars: isRefetching
        }}


        // renderRowActions={({ row, table }) => (
        //   <Box sx={{ display: 'flex', gap: '1rem' }}>
        //     <Tooltip arrow placement="left" title="Edit">
        //       <IconButton onClick={() => {


        //         //  console.log("modificando");


        //       }

        //       }>
        //         {/* <Edit /> */}
        //       </IconButton>
        //     </Tooltip>
        //     <Tooltip arrow placement="right" title="Delete">
        //       <IconButton color="error" onClick={() => row}>
        //         {/* <Delete /> */}
        //       </IconButton>
        //     </Tooltip>
        //   </Box>
        // )}


      // renderTopToolbarCustomActions={() => (
      //   <Button
      //     color="secondary"
      //     onClick={() => {
      //       // setDeshabilitado(false);
      //       // setInicial(inicialOpcion);
      //       // setTitulomod(`${title} Nuevo registro`);
      //       // setCreateModalOpen(true)
      //     }
      //     }
      //     variant="contained"
      //   >
      //       {/* <Add/> */}
      //   </Button>
      // )}
      />



      {valueProgres &&
        <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
          <LinearProgress color="secondary" />
          <LinearProgress color="success" />
          <LinearProgress color="inherit" />
        </Stack>

      }
      {/* <BasicDocument /> */}

      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh' }}
      >

        <Grid item xs={6}>


        </Grid>

      </Grid>

    </>
  );
};



export default ProcesoCierre;
