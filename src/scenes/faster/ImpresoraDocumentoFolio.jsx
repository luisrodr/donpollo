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
import { inicialImpresoraDocumentoFolio} from '../../data/makeDataCrud';
import CloudDownload from "@mui/icons-material/CloudDownload";
import Print from "@mui/icons-material/Print";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import {  ActionIcon } from '@mantine/core';



//import esUnico   from './helpers/esUnico';
import ModalImpresoraDocumentoFolio from './modal/ModalImpresoraDocumentoFolio';
import { AuthContext } from "../../mycontext";
const URL_BASE=process.env.REACT_APP_URL_BASE;

const API_SEL_DOC=process.env.REACT_APP_API_SEL_DOC;

const API_SEL_IMP=process.env.REACT_APP_API_SEL_IMP;

const API_SEL=process.env.REACT_APP_API_SEL_IDF;
const API_INS=process.env.REACT_APP_API_INS_IDF;
const API_UPD=process.env.REACT_APP_API_UPD_IDF;
const API_DEL=process.env.REACT_APP_API_DEL_IDF;

const ImpresoraDocumentoFolio = () => {
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

    const [impresoraData, setImpresoraData] = useState([]);

    const [documentoData, setDocumentoData] = useState([]);

    const [rowData, setRowData] = useState([]);

    const [inicial, setInicial] = useState( inicialImpresoraDocumentoFolio); 


    //snack
    const [state] = useState({
      vertical: 'top',
      horizontal: 'center',
    });

    const { vertical, horizontal } = state;
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState(false);
   
    const existeCodigo=(code)=>{
       return tableData.find(({ codigo }) => codigo === code);
    };

    const getElemento=(arrData,ele)=>{
      return arrData.find(element=>element.descripcion===ele);
    };

    const handleCreateNewRow = (values) => {
    
      
        setIsLoading(true);
        setIsRefetching(true);
        
        const idimpresora=getElemento(impresoraData,values.impresora);
        const iddocumento=getElemento(documentoData,values.documento);
    
        console.log("id impresora ",idimpresora);
        console.log("id documento",iddocumento);

        axios
            .post(`${URL_BASE}${API_INS}`, {

              data: {
                
                folioinicial:values.folioinicial,
                foliofinal:values.foliofinal,
                siguiente:values.siguiente,
                impresora: idimpresora.id,
                documento:iddocumento.id
    
              },
            },{    headers:{
              Authorization:`Bearer  ${token}`
            }})
            .then((response) => {
        
              console.log("reemplazando id =========>",response.data.data.id);  
              values.id=response.data.data.id;
              values.impresora=response.data.data.impresora;
              console.log("reemplazando impresora =========>",values.impresora);  
      
              values.documento=response.data.data.documento;
              console.log("reemplazando documento =========>",values.documento);  
                      
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
        const idimpresora=getElemento(impresoraData,values.impresora);
        const iddocumento=getElemento(documentoData,values.documento);
    
        console.log("id impresora ",idimpresora);
        console.log("id documento",iddocumento);
       

       
        values.impresora={id:idimpresora.id,descripcion:idimpresora.descripcion};

        values.documento={id:iddocumento.id,descripcion:iddocumento.descripcion};

        tableData[rowData.index] = values;

          axios
          .put(`${URL_BASE}${API_UPD}${rowData.getValue('id')}`, {
            data: {

                folioinicial:values.folioinicial,
                foliofinal:values.foliofinal,
                siguiente:values.siguiente,
                impresora: idimpresora.id,
                documento:iddocumento.id

            },
          },{    headers:{
            Authorization:`Bearer  ${token}`
          }})
          .then((response) => {
            console.log(response);

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

   const getSubfamilia_productos=(laid)=>{
        return tableData.find(({ id }) => id === laid);
   };

   const handleDeleteRow = useCallback(

      (row) => {
      
        console.log("id a borrar: ",row.getValue('id'));
         
        const re = getSubfamilia_productos(row.getValue('id'));
 
        console.log("registro a borrar : ",re);

        //existe elemento
        if ( re.subfamilia_productos){
            console.log("busqueda de id a borrar",re.subfamilia_productos); 
            console.log("largo", re.subfamilia_productos );
          
            if  ( re.subfamilia_productos.length >0){
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
      [tableData],
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
          header: 'siguento',
          size: 140,

        },        
        {
          accessorKey: 'impresora.descripcion',
          header: 'impresora',
          size: 140,

        },
        {
          accessorKey: 'documento.descripcion',
          header: 'documento',
          size: 140,

        },        
        
      ],
      [],
    );
  //       accessorFn: (row) => `${row.familia_producto.codigo} ${row.familia_producto.descripcion}`,
  
  //  accessorKey: 'familia_producto.descripcion',
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

       const fila={id: tableData[i].id ,
                   folioinicial: tableData[i].foliofinal,
                   foliofinal: tableData[i].foliofinal,    
                   siguiente:tableData[i].siguiente, 
                   impresora: tableData[i].impresora.descripcion,
                   documento:tableData[i].documento.descripcion,};
       dataCsv=[...dataCsv,fila];
      
    };
 
    csvExporter.generateCsv(dataCsv);
  };


  const get_data_to_pdf=()=>{
    let dataPdf=[];

    for(let i = 0;i<tableData.length;i++) { 

       const fila=[ tableData[i].id, 
                    tableData[i].folioinicial,
                    tableData[i].final,
                    tableData[i].siguiente,
                    tableData[i].impresora.descripcion,
                    tableData[i].documento.descripcion
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
   setTitle(inicialImpresoraDocumentoFolio.title);
   setSubTitle(inicialImpresoraDocumentoFolio.subtitle);
   setIsLoading(true);
   setIsRefetching(true);

   const cargaImpresora=async()=>{
  
    await axios
    .get(`${URL_BASE}${API_SEL_IMP}`,{    headers:{
      Authorization:`Bearer  ${token}`
    }})
    .then(({ data }) => {
     
      setImpresoraData(data.data);

      setIsLoading(false);
      setIsRefetching(false);

    })
    .catch((error) => {
      console.log("error")
      setErrorPrueba(true)
      setErrorText(JSON.stringify(error))
     
    });

  };

  const cargaDocumento=async()=>{
  
    await axios
    .get(`${URL_BASE}${API_SEL_DOC}`,{    headers:{
      Authorization:`Bearer  ${token}`
    }})
    .then(({ data }) => {
     
      setDocumentoData(data.data);

      setIsLoading(false);
      setIsRefetching(false);

    })
    .catch((error) => {
      console.log("error")
      setErrorPrueba(true)
      setErrorText(JSON.stringify(error))
     
    });

  };
  
   const urlapi=`${URL_BASE}${API_SEL}`
   console.log(urlapi);

   const cargaStrapi=async()=>{

       await axios
       .get(urlapi,{    headers:{
        Authorization:`Bearer  ${token}`
      }})
       .then(({ data }) => {

         console.log(data.data);
        
         setTableData(data.data);   
 
         cargaImpresora();
         cargaDocumento();

       })
       .catch((error) => {
         console.log("error")
         setErrorPrueba(true)
         setErrorText(JSON.stringify(error))
       
       });

  }; 

   cargaStrapi();
   
 },[] );  
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
                  folioinicial:row.original.folioinicial,
                  foliofinal:row.original.foliofinal,
                  siguiente:row.original.siguiente,
                  impresora:  row.original.impresora,
                  documento: row.original.documento,

                };
                
                console.log(modificar);
                setInicial(modificar);
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
              setInicial(inicialImpresoraDocumentoFolio);
              setTitulomod(`${title} Nuevo registro`);
              
              setCreateModalOpen(true)}}
            variant="contained"
          >
              <Add/>
          </Button>
        )}
      />
      
      <ModalImpresoraDocumentoFolio
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        onEdit={handleEdit}
        impresoraData={impresoraData}
        documentoData={documentoData}
        inicial={inicial}
        tableData={tableData}
        titulomod={titulomod}

      />

    </>
  );
};

export default  ImpresoraDocumentoFolio;
