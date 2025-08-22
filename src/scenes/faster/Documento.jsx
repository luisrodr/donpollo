import React, { useCallback, useMemo, useState ,useEffect,useContext} from 'react';
import axios from "axios";

import Swal from "sweetalert2"; 

import Header from "../../components/Header";


import MaterialReactTable ,
{ MRT_FullScreenToggleButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton, } from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import {
  Alert,
  Box,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import { Delete, Edit,Add } from '@mui/icons-material';

import CloudDownload from "@mui/icons-material/CloudDownload";
import Print from "@mui/icons-material/Print";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import {  ActionIcon } from '@mantine/core';

import { inicialDocumento} from '../../data/makeDataCrud';
import {ModalDocumento} from './modal/ModalDocumento';


import getRelacion from './helpers/getRelacion';
import { AuthContext } from "../../mycontext";

const URL_BASE=process.env.REACT_APP_URL_BASE;
const API_SEL=process.env.REACT_APP_API_SEL_DOC;
const API_INS=process.env.REACT_APP_API_INS_DOC;
const API_UPD=process.env.REACT_APP_API_UPD_DOC;
const API_DEL=process.env.REACT_APP_API_DEL_DOC;

const Documento = () => {
    const {user} = useContext(AuthContext);
    const { token } = user;
  
    const [titulomod, setTitulomod] = useState('');
  
    const [title, setTitle] = useState('');
  
    const [subTitle, setSubTitle] = useState('');
  
    const [isRefetching, setIsRefetching] = useState(false);
  
    const [isLoading, setIsLoading] = useState(false);
    
    const [errorPrueba, setErrorPrueba] = useState(false);
    
    const [errorText, setErrorText] = useState("");

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [tableData, setTableData] = useState([]);

    const [rowData, setRowData] = useState([]);

    const [inicial, setInicial] = useState(inicialDocumento); 

    const [deshabilitado, setDeshabilitado] = useState(false);

    //snack
    const [state] = useState({
      vertical: 'top',
      horizontal: 'center',
    });

    const { vertical, horizontal } = state;
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState(false);

    const handleCreateNewRow = (values) => {
       console.log("Grabando");
       setIsLoading(true);
          setIsRefetching(true);

          console.log("No existe codigo====>",);
      
          axios
              .post(`${URL_BASE}${ API_INS}`, {

                data: {
                
                  codigo: values.codigo,
                  descripcion: values.descripcion,
                  folioinicial:values.folioinicial,
                  foliofinal:values.foliofinal,
                  siguiente:values.siguiente,
                  sistemaimpresora:values.sistemaimpresora,
                  
                  swEncabezadoVencimiento:values.swEncabezadoVencimiento,
                  swEncabezadoProveedor:values.swEncabezadoProveedor,
                  swEncabezadoDocumentoActual:values.swEncabezadoDocumentoActual,
                  swEncabezadoDocumentoRelacionado:values.swEncabezadoDocumentoRelacionado,
                  swEncabezadoBodega:values.swEncabezadoBodega,    
                  swEncabezadoCentroConsumo:values.swEncabezadoCentroConsumo,
                  swEncabezadoCentroProduccion:values.swEncabezadoCentroProduccion,
                  swEncabezadoDescuento:values.swEncabezadoDescuento,
                  swEncabezadoRecargo:values.swEncabezadoRecargo, 
                  swEncabezadoStock:values.swEncabezadoStock, 
                  swEncabezadoEntradaSalida:values.swEncabezadoEntradaSalida, 
                  //filtro para los relacionados , true aparacen disponibles   
                  swEncabezadoRelacionaDocumento:values.swEncabezadoRelacionaDocumento,
                  swEncabezadoActualizaPrecio:values.swEncabezadoRelacionaDocumento,

                  ensa:values.ensa,
                

                  //DETALLE
                  swDetalleExento:values.swDetalleExento,    
                  swDetalleBodega:values.swDetalleBodega,          
                  swDetalleNeto:values.swDetalleNeto, 
                  swDetalleIla:values.swDetalleIla, 
                  swDetalleDescuento:values.swDetalleDescuento,  
                  swDetalleRecargo:values.swDetalleRecargo,
                  swDetalleArticulo:values.swDetalleArticulo,    
                  swDetalleProducto:values.swDetalleProducto,   
                  swDetallePrecio:values.swDetallePrecio,

                  swDetalleCostounitario:values.swDetalleCostounitario,
                  swDetalleRecargoglobal:values.swDetalleRecargoglobal,
                  swDetalleCostototal:values.swDetalleCostototal,
                  swDetalleRetencion:values.swDetalleRetencion,
                  
                },
              },{    headers:{
                Authorization:`Bearer  ${token}`
              }})
              .then((response) => {
          
                console.log("reemplazando id =========>");  
                values.id=response.data.data.id;
                
                tableData.push(values);
                setTableData([...tableData]);
                
                setMessage(`Agregado ${values.id}`);
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

    const handleEdit= async (values ) => {
       
      console.log("modifica=====ok");

        setIsLoading(true);
        setIsRefetching(true);

        tableData[rowData.index] = values;

          axios
          .put(`${URL_BASE}${API_UPD}${rowData.getValue('id')}`, {
            data: {
             
                codigo: values.codigo,
                descripcion: values.descripcion,
                folioinicial:values.folioinicial,
                foliofinal:values.foliofinal,
                siguiente:values.siguiente,
                sistemaimpresora:values.sistemaimpresora,
                cosa:values.cosa,
                swEncabezadoVencimiento:values.swEncabezadoVencimiento,
                swEncabezadoProveedor:values.swEncabezadoProveedor,
                swEncabezadoDocumentoActual:values.swEncabezadoDocumentoActual,
                swEncabezadoDocumentoRelacionado:values.swEncabezadoDocumentoRelacionado,
                swEncabezadoBodega:values.swEncabezadoBodega,
                swEncabezadoCentroConsumo:values.swEncabezadoCentroConsumo,
                swEncabezadoCentroProduccion:values.swEncabezadoCentroProduccion,
                swEncabezadoDescuento:values.swEncabezadoDescuento,
                swEncabezadoRecargo:values.swEncabezadoRecargo,
                swEncabezadoStock:values.swEncabezadoStock,
                swEncabezadoEntradaSalida:values.swEncabezadoEntradaSalida, 
                //filtro para los relacionados , true aparacen disponibles      
                swEncabezadoRelacionaDocumento:values.swEncabezadoRelacionaDocumento,
                swEncabezadoActualizaPrecio:values.swEncabezadoRelacionaDocumento,

                ensa:values.ensa,
                
                //DETALLE
                swDetalleExento:values.swDetalleExento,  
                swDetalleBodega:values.swDetalleBodega, 
                swDetalleNeto:values.swDetalleNeto,                   
                swDetalleIla:values.swDetalleIla, 
                swDetalleDescuento:values.swDetalleDescuento,  
                swDetalleRecargo:values.swDetalleRecargo,   
                swDetalleArticulo:values.swDetalleArticulo,            
                swDetalleProducto:values.swDetalleProducto,  
                swDetallePrecio:values.swDetallePrecio,

                swDetalleCostounitario:values.swDetalleCostounitario,
                swDetalleRecargoglobal:values.swDetalleRecargoglobal,
                swDetalleCostototal:values.swDetalleCostototal,
                swDetalleRetencion:values.swDetalleRetencion,
    
                
            }, 
          },{    headers:{
            Authorization:`Bearer  ${token}`
          }})
          .then((response) => {
            //console.log(response);
            setIsLoading(false);
            setIsRefetching(false);
            setMessage(`Modificado ${values.id}`);
            setOpenSnack(true);
 
        }).catch((error) => {

          console.log(error);
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error));

        });
          
        setTableData([...tableData]);
   
    };



   const handleDeleteRow = useCallback(

      (row) => {
      
        console.log("id a borrar: ",row.getValue('id'));
         
        const re =getRelacion(tableData,row.getValue('id'));
 
        console.log("registro a borrar : ",re);

        //existe elemento
        if ( re.impresoradocumentofolios){
            console.log("busqueda de id a borrar",re.impresoradocumentofolios); 
            console.log("largo", re.impresoradocumentofolios );
          
            if  ( re.impresoradocumentofolios.length >0){
                console.log("no se puede borrar");
                setErrorPrueba(true);
                setErrorText(`ID ${row.getValue('id')} no se puede eliminar.Existen registros relacionados...`);
                return;
            };
        };


       Swal.fire({  
        title: 'Seguro quiere borrar?',  
        
        icon: 'warning',  
        showCancelButton: true,  
        confirmButtonColor: '#3085d6',  
        cancelButtonColor: '#d33',  
        cancelButtonText: 'No',
        confirmButtonText: 'Si!'  

      }).then(response=>{

          if (response.isConfirmed){
            setIsLoading(true);
            setIsRefetching(true);
    
            //send api delete request here, then refetch or update local table data for re-render
            
            axios
            .delete(`${URL_BASE}${API_DEL}${row.getValue('id')}`,{    headers:{
              Authorization:`Bearer  ${token}`
            }})
           
            .then((response) => {
                console.log(response);
    
                tableData.splice(row.index, 1);
                setTableData([...tableData]);
    
                setIsLoading(false);
                setIsRefetching(false);
    
                setMessage(`Eliminado ${row.getValue('id')}`);
                setOpenSnack(true);
                
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
      [tableData,token],
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
          accessorKey: 'codigo',
          header: 'codigo',
          size: 140,

        },
        {
          accessorKey: 'descripcion',
          header: 'descripcion',
          size: 140,

        },
        {
          accessorKey: 'folioinicial',
          header: 'folio inicial',
          size: 140,

        },
        {
          accessorKey: 'foliofinal',
          header: 'folio final',
          size: 140,

        },    
        {
          accessorKey: 'siguiente',
          header: 'siguiente',
          size: 140,

        },
        {
          accessorKey: 'swEncabezadoDocumentoActual',
          header: 'swEncabezadoDocumentoActual',
          size: 140,

        },         
        {
          accessorKey: 'swEncabezadoProveedor',
          header: 'swEncabezadoProveedor',
          size: 140,

        },   
        {
          accessorKey: 'swEncabezadoDocumentoRelacionado',
          header: ' swEncabezadoDocumentoRelacionado',
          size: 140,

        }, 
        {
          accessorKey: 'swEncabezadoBodega',
          header: ' swEncabezadoBodega',
          size: 140,

        }, 
        {
          accessorKey: 'swEncabezadoCentroConsumo',
          header: 'swEncabezadoCentroConsumo',
          size: 140,

        },        
        {
          accessorKey: 'swEncabezadoCentroProduccion',
          header: 'swEncabezadoCentroProduccion',
          size: 140,

        },       
        {
          accessorKey: 'swEncabezadoDescuento',
          header: 'swEncabezadoDescuento',
          size: 140,

        }, 
        {
          accessorKey: 'swEncabezadoRecargo',
          header: 'swEncabezadoRecargo',
          size: 140,

        }, 
        {
          accessorKey: 'swEncabezadoStock',
          header: 'swEncabezadoStock',
          size: 140,

        },       
        {
          accessorKey: 'swEncabezadoEntradaSalida',
          header: 'swEncabezadoEntradaSalida',
          size: 140,

        },   
        {
          accessorKey: 'swEncabezadoRelacionaDocumento',
          header: 'swEncabezadoRelacionaDocumento',
          size: 140,

        },  
        {
          accessorKey: 'swEncabezadoActualizaPrecio',
          header: 'swEncabezadoActualizaPrecio',
          size: 140,

        },    
        {
          accessorKey: 'swEncabezadoVencimiento',
          header: 'swEncabezadoVencimiento',
          size: 140,

        }, 
        {
          accessorKey: 'swDetalleArticulo',
          header: 'swDetalleArticulo',
          size: 140,

        },   
        {
          accessorKey: 'swDetalleProducto',
          header: 'swDetalleProducto',
          size: 140,

        },
           
        {
          accessorKey: 'swDetalleBodega',
          header: 'swDetalleBodega',
          size: 140,

        },         
        {
          accessorKey: 'swDetalleExento',
          header: 'swDetalleExento',
          size: 140,

        },   
        {
          accessorKey: 'swDetalleNeto',
          header: 'swDetalleNeto',
          size: 140,

        },           
        {
          accessorKey: 'swDetalleIla',
          header: 'swDetalleIla',
          size: 140,

        },
        {
          accessorKey: 'swDetalleDescuento',
          header: 'swDetalleDescuento',
          size: 140,

        },
        {
          accessorKey: 'swDetalleRecargo',
          header: 'swDetalleRecargo',
          size: 140,

        }, 
        {
          accessorKey: 'swDetalleCostounitario',
          header: 'swDetalleCostounitario',
          size: 140,

        }, 
        {
          accessorKey: 'swDetalleRecargoglobal',
          header: 'swDetalleRecargoglobal',
          size: 140,

        }, 

        {
          accessorKey: 'swDetalleCostototal',
          header: 'swDetalleCostototal',
          size: 140,

        }, 
        {
          accessorKey: 'swDetalleRetencion',
          header: 'swDetalleRetencion',
          size: 140,

        }, 

        {
          accessorKey: 'ensa',
          header: 'ensa',
          size: 140,

        }, 
        
        //no agrego lock porque es campo de sistema para eventual bloqueo
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
    let dataCsv=[];

    for(let i = 0;i<tableData.length;i++) { 

       const fila={codigo: tableData[i].codigo ,
                  descripcion: tableData[i].descripcion,

                  sistemaimpresora:tableData[i].sistemaimpresora,
                };
       dataCsv=[...dataCsv,fila];
      
    };
 
    csvExporter.generateCsv(dataCsv);
  };


  const get_data_to_pdf=()=>{
    let dataPdf=[];

    for(let i = 0;i<tableData.length;i++) { 

       const fila=[ tableData[i].id, 
                    tableData[i].codigo ,
                    tableData[i].descripcion,

                    tableData[i].sistemaimpresora,
       ];
       dataPdf=[...dataPdf,fila];
      
    };

    return dataPdf;
 
  }

  const get_column_to_pdf=()=>{
    let columnPdf=[];

    for(let i = 0;i<columns.length;i++) { 

       columnPdf=[...columnPdf,columns[i].header];
      
    };

    return columnPdf;
  }  

  const downloadPdf=()=>{
    const doc = new jsPDF()

    autoTable(doc, { html: '#my-table' })
   
    doc.text( title,15,10);
    autoTable(doc, {
      
      head: [get_column_to_pdf()],
      body: get_data_to_pdf(),
      
    })

    doc.save('table.pdf')
  };  

  useEffect(() => { 

   setTitulomod(''); 
   setTitle(inicialDocumento.title);
   setSubTitle(inicialDocumento.subtitle);
   setIsLoading(true);
   setIsRefetching(true);
  
   const urlapi=`${URL_BASE}${API_SEL}`
   console.log(urlapi);

   const cargaStrapi=async()=>{

       await axios
       .get(urlapi,{    headers:{
        Authorization:`Bearer  ${token}`
      }})
       .then(({ data }) => {

         console.log(data.data);
        
         setTableData([...data.data]);   

         setIsLoading(false);
         setIsRefetching(false);

       })
       .catch((error) => {
         console.log("error")
         setErrorPrueba(true)
         setErrorText(JSON.stringify(error))
       
       });

  } 

   cargaStrapi();
   
 },[token] );  
  return (
    <>
 
     {  errorPrueba   &&
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
        data={tableData}
        initialState={{
          columnVisibility: {
            folioinicial: false ,
            foliofinal:false,
            siguiente:false,
            swEncabezadoVencimiento:false,
            swEncabezadoDocumentoActual:false,
            swEncabezadoProveedor:false,
            swEncabezadoDocumentoRelacionado:false,
            swEncabezadoBodega:false,
            swEncabezadoCentroConsumo:false,
            swEncabezadoCentroProduccion:false,
            swEncabezadoDescuento:false,
            swEncabezadoRecargo:false,
            swEncabezadoStock:false,
            swEncabezadoEntradaSalida:false,

            swEncabezadoRelacionaDocumento:false,
            swEncabezadoActualizaPrecio:false,
          
            swDetalleBodega:false,
            swDetalleExento:false,
            swDetalleNeto:false,
            swDetalleIla:false,
            swDetalleDescuento:false,
            swDetalleRecargo:false,
            swDetalleArticulo:false,
            swDetalleProducto:false,
            swDetallePrecio:false,

            swDetalleCostounitario:false,
            swDetalleRecargoglobal:false,
            swDetalleCostototal:false,
            swDetalleRetencion:false,
            ensa:false

            } 
          }}

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
                <CloudDownload/>
            </ActionIcon>

            {/* built-in buttons (must pass in table prop for them to work!) */}
            <MRT_ToggleGlobalFilterButton table={table}/>
            <MRT_ShowHideColumnsButton table={table} />
            <MRT_FullScreenToggleButton table={table} />
          </>
        )}

        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        state={{
          isLoading,
          showProgressBars: isRefetching
        }}      
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() =>{


                 console.log("modificando");
                 setTitulomod(`${title} Modifica registro Id ${row.original.id}`);
                 setRowData(row);  

                 const modificar={
                  id: row.original.id,
                  codigo: row.original.codigo,
                  descripcion:  row.original.descripcion,
                  folioinicial: row.original.folioinicial,
                  foliofinal: row.original.foliofinal,
                  siguiente: row.original.siguiente,
                  sistemaimpresora:row.original.sistemaimpresora,
                  cosa:row.original.cosa,
                  swEncabezadoVencimiento:row.original.swEncabezadoVencimiento,
                  swEncabezadoProveedor:row.original.swEncabezadoProveedor,
                  swEncabezadoDocumentoActual:row.original.swEncabezadoDocumentoActual,
                  swEncabezadoDocumentoRelacionado:row.original.swEncabezadoDocumentoRelacionado,
                  swEncabezadoBodega:row.original.swEncabezadoBodega,
                  swEncabezadoCentroConsumo:row.original.swEncabezadoCentroConsumo,
                  swEncabezadoCentroProduccion:row.original.swEncabezadoCentroProduccion,
                  swEncabezadoDescuento:row.original.swEncabezadoDescuento,
                  swEncabezadoRecargo:row.original.swEncabezadoRecargo,
                  swEncabezadoStock:row.original.swEncabezadoStock,      
                  swEncabezadoEntradaSalida:row.original.swEncabezadoEntradaSalida, 
                  //filtro para los relacionados , true aparacen disponibles
                  swEncabezadoRelacionaDocumento:row.original.swEncabezadoRelacionaDocumento,
                  //es el precio de compra , LO ACTUALIZA
                  swEncabezadoActualizaPrecio:row.original.swEncabezadoActualizaPrecio,
                  ensa:row.original.ensa,
                 
                  //DETALLE            
                  swDetalleExento:row.original.swDetalleExento,     
                  swDetalleBodega:row.original.swDetalleBodega,    
                  swDetalleNeto:row.original.swDetalleNeto, 
                  swDetalleIla:row.original.swDetalleIla, 
                  swDetalleDescuento:row.original.swDetalleDescuento, 
                  swDetalleRecargo:row.original.swDetalleRecargo,   
                  swDetalleArticulo:row.original.swDetalleArticulo,
                  swDetalleProducto:row.original.swDetalleProducto, 
                  //MODIFICA O NO 
                  swDetallePrecio:row.original.swDetallePrecio,    
                  
                  swDetalleCostounitario:row.original.swDetalleCostounitario,
                  swDetalleRecargoglobal:row.original.swDetalleRecargoglobal,
                  swDetalleCostototal:row.original.swDetalleCostototal,
                  swDetalleRetencion:row.original.swDetalleRetencion,
                  
                
                  
                };

                console.log(modificar);
                setInicial(modificar);
                setDeshabilitado(true);
                setCreateModalOpen(true);

              }
               
              }> 
                <Edit />
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
              setDeshabilitado(false);
              setInicial(inicialDocumento);
              setTitulomod(`${title} Nuevo registro`);
              setCreateModalOpen(true)}}
            variant="contained"
          >
          <Add/>
          </Button>
        )}
      />
      <ModalDocumento
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        onEdit={handleEdit}
        inicial={inicial}
        tableData={tableData}
        titulomod={titulomod}
        deshabilitado={deshabilitado}
      />

    </>
  );
};

export default Documento;
