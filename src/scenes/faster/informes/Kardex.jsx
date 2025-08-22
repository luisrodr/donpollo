import React, {  useMemo, useState, useEffect, useContext } from 'react';
import axios from "axios";


import Swal from "sweetalert2";

import Header from "../../../components/Header";

import runCierreReport0 from "../helpers/runCierreReport0";
import { getMesAnoCierre, getAaaaMmAnterior, getAaaaMmSiguiente, } from "../helpers/getMesAnoCierre";
import { getDateTime } from "../helpers/getDateTime";

import { mesesNumero } from '../../../data/makeDataCrud';

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

  Grid,

  MenuItem,

  Select,

  Stack,
  TextField,

} from '@mui/material';

import InputLabel from '@mui/material/InputLabel';

import LinearProgress from '@mui/material/LinearProgress';

import Snackbar from '@mui/material/Snackbar';
import {Print,Send } from '@mui/icons-material';

import CloudDownload from "@mui/icons-material/CloudDownload";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import { ActionIcon } from '@mantine/core';

import { AuthContext } from "../../../mycontext";
// import { headers } from 'next/dist/client/components/headers';

import Autocomplete from '@mui/material/Autocomplete';

const URL_BASE = process.env.REACT_APP_URL_BASE;

//tabla cierrestock
const APP_API_SEL_CST = process.env.REACT_APP_API_SEL_CST;


//movimientos documentos
const REACT_APP_API_SEL_MDO = process.env.REACT_APP_API_SEL_MDO;


//sel articulos
const API_SEL_ART = process.env.REACT_APP_API_SEL_ART;

//parametros
const API_SEL_PAR = process.env.REACT_APP_API_SEL_PAR;
// const API_UPD_PAR = process.env.REACT_APP_API_UPD_PAR;

//bodega cierre stock
const API_SEL_BCS = process.env.REACT_APP_API_SEL_BCS; 
const API_INS_BCS = process.env.REACT_APP_API_INS_BCS;
const API_UPD_BCS = process.env.REACT_APP_API_UPD_BCS;
const API_DEL_BCS = process.env.REACT_APP_API_DEL_BCS;

const Kardex = () => {

  const { user } = useContext(AuthContext);
  const { token } = user;
  const [title, setTitle] = useState('Proceso periodo');


  const [errorPrueba, setErrorPrueba] = useState(false);
  const [errorText, setErrorText] = useState("");


  const [isLoading, setIsLoading] = useState(false);


  const [valorPeriodoAnterior, setValorPeriodoAnterior] = useState("");
  const [valorPeriodoCerrar, setValorPeriodoCerrar] = useState("");
  const [valueEstado, setValueEstado] = useState("");

  const [progress, setProgress] = useState(0);

  const [tableDataArticulo, setTableDataArticulo] = useState([]);
  const [valueCierre, setValueCierre] = useState([]);
  const [valueCierreBodega, setValueCierreBodega] = useState([]);
  const [valueAAno, setValueAAno] = useState([]);

  const [valueParametroEmpresa, setValueParametroEmpresa] = useState("");
  const [valueAno, setValueAno] = useState("");
  const [valueMes, setValueMes] = useState("");
  const [valueMovimientosPeriodo, setValueMovimientosPeriodo] = useState([]);

  const [valueProgres, setValueProgres] = useState(true);
  const [valueIdParametro, setValueIdParametro] = useState(0);
 

  const [tableData, setTableData] = useState([]);
  const [otrosDatos, setOtrosDatos] = useState([]);

  const [isRefetching, setIsRefetching] = useState(false);

  const [valueArticulo, setValueArticulo] = useState('');
  const [inputArticulo, setInputValueArticulo] = useState([]);


  const columnsReport = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 50,
      },
  
      {

        header: 'periodo',
        accessorKey: 'periodo',
        size: 50,

      },
      {
        header: 'fecha',
        accessorKey: 'fecha',
        size: 50,
      },
      {
        header: 'documento',
        accessorKey: 'documento',
        size: 10,    
      },

      {
        header: 'glosa',
        accessorKey: 'glosa',
        size: 50,             
      },

      {
        header: 'entrada_Unidad',
        accessorKey: 'entradaMovimientoUnidad',
        size: 30,            
        style: {
          textAlign: 'left'
        },

        Cell:({cell}) => "".concat(Intl.NumberFormat('en-US').format(cell.getValue())) 
      },
      {
        header: 'entrada_Valor',
        accessorKey: 'entradaMovimientoValor',
        size: 30,      
        style: {
          textAlign: 'left'
        },
     
        Cell:({cell}) => "$".concat(Intl.NumberFormat('en-US').format(cell.getValue())) 

      },
      {
        header: 'salida_Unidad',
        accessorKey: 'salidaMovimientoUnidad',
        size: 30, 
        style: {
          textAlign: 'left'
        },

        Cell:({cell}) => "".concat(Intl.NumberFormat('en-US').format(cell.getValue())) 
        

      },
      {
        header: 'salida_Valor',
        accessorKey: 'salidaMovimientoValor',
        size: 30,        
        style: {
          textAlign: 'left'
        },

        Cell:({cell}) => "$".concat(Intl.NumberFormat('en-US').format(cell.getValue())) 
      },
      {
        header: 'precio_Promedio',
        accessorKey: 'precioPromedio',
        size: 30,              
        style: {
          textAlign: 'left'
        },

        Cell:({cell}) => "$".concat(Intl.NumberFormat('en-US').format(cell.getValue())) 
      },
      {
        header: 'saldo_Unidad',
        accessorKey: 'saldoUnidad',
        size: 30,         
        style: {
          textAlign: 'left'
        },

        Cell:({cell}) => "".concat(Intl.NumberFormat('en-US').format(cell.getValue())) 
      },
      {
        header: 'saldo_Valor',
        accessorKey: 'saldoValor',
        size: 50,      
        style: {
          textAlign: 'left'
        },

        Cell:({cell}) => "$".concat(Intl.NumberFormat('en-US').format(cell.getValue()))       

      },
    
      ],
  );

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columnsReport.map((c) => c.header),
  };
  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportData = () => {
    let dataCsv = [];

    for (let i = 0; i < tableData.length; i++) {

      const fila = {
        id:tableData[i].id,
        documento:tableData[i].documento,
        fecha:tableData[i].fecha,
        glosa:tableData[i].glosa,
        periodo:tableData[i].periodo,
        entradaUnidad:tableData[i].entradaMovimientoUnidad,
        entradaValor:tableData[i].entradaMovimientoValor,
        salidaUnidad:tableData[i].salidaMovimientoUnidad,
        salidaValor:tableData[i].salidaMovimientoValor,
        precioPromedio:tableData[i].precioPromedio,
        saldoUnidad:tableData[i].saldoUnidad,
        saldoValor:tableData[i].saldoValor,
  
      };
      dataCsv = [...dataCsv, fila];

    };

    csvExporter.generateCsv(dataCsv);
  };

  const getFormatNumberPdf=(value)=>{
    return "$".concat(Intl.NumberFormat('en-US').format(value));
  };

  const get_data_to_pdf = () => {
    let dataPdf = [];

    for (let i = 0; i < tableData.length; i++) {
      console.log("haciendo pdf", tableData[i]);
      const fila = [tableData[i].id,
      tableData[i].periodo,
      tableData[i].fecha,
      tableData[i].documento,
     
      tableData[i].glosa,
      tableData[i].entradaMovimientoUnidad,
      getFormatNumberPdf(tableData[i].entradaMovimientoValor),
      tableData[i].salidaMovimientoUnidad,
      getFormatNumberPdf(tableData[i].salidaMovimientoValor),
      getFormatNumberPdf(tableData[i].precioPromedio),
      tableData[i].saldoUnidad,
      getFormatNumberPdf(tableData[i].saldoValor),


      ];
      dataPdf = [...dataPdf, fila];

    };

    return dataPdf;

  }

  const get_column_to_pdf = () => {
    let columnPdf = [];

    for (let i = 0; i < columnsReport.length; i++) {

      columnPdf = [...columnPdf, columnsReport[i].header];

    };

    return columnPdf;
  }


  const getComprasAcumuladasUnit=()=>{
     return Number(otrosDatos[0].comprasacumuladasunitanterior)+Number(otrosDatos[0].comprasperiodounit);
  };

  const getComprasAcumuladasValor=()=>{
    return Number(otrosDatos[0].comprasacumuladasvaloranterior)+Number(otrosDatos[0].comprasperiodovalor);
 };


  const downloadPdf = () => {
 
    const addFooters = doc => {
      const pageCount = doc.internal.getNumberOfPages()

      doc.setFont('helvetica', 'italic')
      doc.setFontSize(8)
      for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        // orientation: 'p'
        // doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 2, 287, {
        //   align: 'center'
        // })
        doc.text(`fecha hora actual:${getDateTime()}`, 15, 200 );
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 2, 200, {
          align: 'center'
        })        
      }
    }   
    const doc = new jsPDF({
      fontSize:12,
      orientation: 'l',
      unit: 'mm',
      format: 'a4',
      //putOnlyUsedFonts: true
    });

    autoTable(doc, { html: '#my-table' })

    //let titulo = `${valueParametroEmpresa} :${`${inputArticulo.codigo}-${inputArticulo.descripcion}`}  ${title}`;
    
    doc.text(`${valueParametroEmpresa} :${`${inputArticulo.codigo}-${inputArticulo.descripcion}`}  ${title} `, 15, 10 );
    //doc.setFontSize(8);
    //doc.text(`fecha hora actual:${getDateTime()}`, 245, 16 );
    doc.setFontSize(6);
    doc.text(`Compras acumuladas unit anterior : ${otrosDatos[0].comprasacumuladasunitanterior} `,15,18);
    doc.text(`Ultimo precio promedio :${"$".concat(Intl.NumberFormat('en-US').format(otrosDatos[0].preciopromedio))}`,80,18);

    doc.text(`Compras periodo unit                      : ${otrosDatos[0].comprasperiodounit}`,15,22);
    doc.text(`Precio :${"$".concat(Intl.NumberFormat('en-US').format(inputArticulo.precio))}`,80,22);

    doc.text(`Compras acumuladas unit               : ${getComprasAcumuladasUnit()}`, 15, 26);
    doc.text(`Costo unitario mayor :${"$".concat(Intl.NumberFormat('en-US').format(inputArticulo.cunitmayor))}  Fecha: ${inputArticulo.fechacumayor}`,80,26);


    doc.text(`Compras acumuladas valor anterior: ${"$".concat(Intl.NumberFormat('en-US').format(otrosDatos[0].comprasacumuladasvaloranterior))} `,15,32);
    doc.text(`Compras periodo valor                     : ${"$".concat(Intl.NumberFormat('en-US').format(otrosDatos[0].comprasperiodovalor))}`,15,36);
    doc.text(`Compras acumuladas valor              : ${"$".concat(Intl.NumberFormat('en-US').format(getComprasAcumuladasValor()))}  `, 15, 40);
   

    
    autoTable(doc, {
      startY: 44,
      styles: { },
      fontSize: 6,
      margin: { top: 10 },
      head: [get_column_to_pdf()],
      body: get_data_to_pdf(),

    })
    addFooters(doc);
    doc.save('table.pdf')
  };


/*
const regCierre={
      articulo:item.id,
      comprasacumuladasunitanterior:comprasacumuladasunitanteriorP,
      comprasacumuladasvaloranterior:comprasacumuladasvaloranteriorP,
      comprasperiodounit:sumUniEntrada,    
      comprasperiodovalor:sumCostoEntrada,
      periodo:pCerrar,
      preciopromedio:precioPromedioFinal,
      saldounitario:acumuladoUnidad,
      saldovalor:acumuladoValor,
      salidasperiodounit:acumuladoSalidaUnidad,
      salidasperiodovalor:acumuladoSalidaValor,

  };
*/

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



  const handleInforme = () => {

    Swal.fire({
      title: `Consulta de articulo :${`${inputArticulo.codigo}-${inputArticulo.descripcion}`} ${title} esta seguro?  `,
      //icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si!'

    }).then(response => {

      if (response.isConfirmed) {

       // setIsEnableButton(false);
        setProgress(true);

        informe();

        return;
      };

    });
  };

  const informe = () => {
    
    const swBodega=true;
    const idBodega=1;

   console.log("inputArticulo.id ",inputArticulo.id);


    const valorCierreBodega =swBodega? valueCierreBodega.filter((artiCierreBod=>
        {
          return  artiCierreBod.articulo.id===inputArticulo.id && artiCierreBod.bodega.id===idBodega;
        })
    ):[];

    const valueMovimientosPeriodoBodega=swBodega? valueCierreBodega.filter((movper=>
      {
        return  movper.articulo.id===inputArticulo.id && movper.bodega.id===idBodega;
      })
     ):[];
     
    console.log("valueMovimientosPeriodoBodega....",valueMovimientosPeriodoBodega);
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

    //const tableDataArticuloFilter = tableDataArticulo.filter((element) => String(element.codigo) ===inputArticulo.codigo);
    const tableDataArticuloFilter = tableDataArticulo.filter((element) => element.id ===inputArticulo.id);

    console.log("inicio proceso.... ",); 
    const aGrabarCierre = runCierreReport0(
      pAnterior,
      pCerrar,
      tableDataArticuloFilter,
      swBodega ? valorCierreBodega : valueCierre,
      swBodega ? valueMovimientosPeriodoBodega : valueMovimientosPeriodo
    );

    console.log("proceso finalizado   0 ... ",aGrabarCierre[0]); 
    console.table(aGrabarCierre[0]);
    setOtrosDatos([...aGrabarCierre[0]]);
    console.table(aGrabarCierre[1]);
    console.log("proceso finalizado   1 ... ",aGrabarCierre[1]); 
    setTableData([...aGrabarCierre[1]]);

  };


  const handleChangeAno = (event) => {
    console.log(event.target.value);
    setValueAno(event.target.value);
    setTitulo(valueMes, event.target.value);
  };

  
  const handleChangeMes = (event) => {
    console.log(event.target.value);
    setValueMes(event.target.value);
    setTitulo(event.target.value, valueAno);
  };

  const setTitulo = (mest, anot) => {
    setTitle(`Kardex periodo  : ${mest} ${anot}  `);

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

  const getArticulos =  () => {

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

       // setInicialArticulo([...data.data]);

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
  const resetArticulo=()=>{
    setInputValueArticulo(null);

    setValueArticulo('');

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

        setValueCierreBodega([...data.data]);

      })
      .catch((error) => {
        console.log("error ", error)
        setErrorPrueba(true)
        setErrorText(JSON.stringify(error))

      });
  };


  useEffect(() => {


    resetArticulo();


    getArticulos();
    getMovimientos();


    getParametro();
    getCierres();
    getCierreBodega();

    anoList();


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
          title={`${valueParametroEmpresa}`}
          subtitle={ `${ inputArticulo ?`${inputArticulo.codigo}-${inputArticulo.descripcion} ` :""}  ${title}`}
        />

      </Box>
      <Box sx={{ flexGrow: 1, p: 4 }}>
      <Grid container spacing={3}>

        <Grid  item xs={0}>
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
        {/* <Stack spacing={1} sx={{ width: 150 }}> */}
             <Grid item xs={1}>
        
                <Autocomplete
                  id="articulo"
                  options={tableDataArticulo}
                  getOptionLabel={(option) => option.descripcion}

                  value={inputArticulo}
                  onChange={(event, newValue) => {
                    if (newValue) {

                      console.log("onChange setInputValueArticulo", newValue);

                      setInputValueArticulo(newValue);

                    } else {

                       resetArticulo();
                    

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
                      //error={isFieldInError("valueArticulo")}
                      //helperText={getErrorsInField("valueArticulo")}

                      variant="standard" />
                  )}
                />
               

              </Grid>
            {/* </Stack> */}
        <Grid item sx={{ pl: 2 }}>
          <InputLabel id="meses-proceso">Informe</InputLabel>
          <Button
            disabled={!inputArticulo}
            color="secondary"
            onClick={handleInforme}
            variant="contained"
            size="large"
           
          >

            <Send />

          </Button>
        </Grid>
      </Grid>
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
        columns={columnsReport}
        data={ tableData}
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


      />



      {valueProgres &&
        <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
          <LinearProgress color="secondary" />
          <LinearProgress color="success" />
          <LinearProgress color="inherit" />
        </Stack>

      }


    </>
  );
};

export default Kardex;
