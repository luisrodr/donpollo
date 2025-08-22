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
import { inicialCondicionPago} from '../../data/makeDataCrud';
import CloudDownload from "@mui/icons-material/CloudDownload";
import Print from "@mui/icons-material/Print";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import {  ActionIcon } from '@mantine/core';

import {ModalCondicionPago} from './modal/ModalCondicionPago';


import getRelacion from './helpers/getRelacion';
import { AuthContext } from "../../mycontext";

const URL_BASE=process.env.REACT_APP_URL_BASE;
const API_SEL=process.env.REACT_APP_API_SEL_CPA;
const API_INS=process.env.REACT_APP_API_INS_CPA;
const API_UPD=process.env.REACT_APP_API_UPD_CPA;
const API_DEL=process.env.REACT_APP_API_DEL_CPA;


const CondicionPago = () => {

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

    const [inicial, setInicial] = useState(inicialCondicionPago); 

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

          setIsLoading(true);
          setIsRefetching(true);

          console.log("No existe codigo====>",);
      
          axios
              .post(`${URL_BASE}${ API_INS}`, {

                data: {
                
                  codigo: values.codigo,
                  descripcion: values.descripcion,
                  dias:values.dias

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
                dias:values.dias
                
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
         
        const re = getRelacion(tableData, row.getValue('id'));
 
        console.log("registro a borrar : ",re);

        //existe elemento
        if ( re.listaprecios){
            console.log("busqueda de id a borrar",re.listaprecios); 
            console.log("largo", re.listaprecios );
          
            if  ( re.listaprecios.length >0){
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
          accessorKey: 'dias',
          header: 'dias',
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
    let dataCsv=[];

    for(let i = 0;i<tableData.length;i++) { 

       const fila={codigo: tableData[i].codigo ,
                  descripcion: tableData[i].descripcion,
                  dias: tableData[i].dias,};
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
                    tableData[i].dias,
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
   setTitle(inicialCondicionPago.title);
   setSubTitle(inicialCondicionPago.subtitle);
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
        
         setTableData(data.data);   

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
                  dias:row.original.dias,

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
              setInicial(inicialCondicionPago);
              setTitulomod(`${title} Nuevo registro`);
              setCreateModalOpen(true)}}
            variant="contained"
          >
              <Add/>
          </Button>
        )}
      />
      <ModalCondicionPago
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



export default CondicionPago;
