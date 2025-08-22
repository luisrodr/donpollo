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
import { inicialCentroProduccion} from '../../data/makeDataCrud';
import CloudDownload from "@mui/icons-material/CloudDownload";
import Print from "@mui/icons-material/Print";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import {  ActionIcon } from '@mantine/core';

import {ModalCentroProduccion} from './modal/ModalCentroProduccion';


import { AuthContext } from "../../mycontext";

const URL_BASE=process.env.REACT_APP_URL_BASE;

const API_SEL_BOD=process.env.REACT_APP_API_SEL_BOD;

const API_SEL_IMP=process.env.REACT_APP_API_SEL_IMP;

const API_SEL=process.env.REACT_APP_API_SEL_CPR_All_REL;
const API_INS=process.env.REACT_APP_API_INS_CPR;
const API_UPD=process.env.REACT_APP_API_UPD_CPR;
const API_DEL=process.env.REACT_APP_API_DEL_CPR;


const  API_SEL_CPI_REL =process.env.REACT_APP_API_SEL_CPI_REL;

const API_INS_CPI=process.env.REACT_APP_API_INS_CPI;

const API_DEL_CPI=process.env.REACT_APP_API_DEL_CPI;

const CentroProduccion = () => {
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

    const [bodegaData, setBodegaData] = useState([]);

    const [rowData, setRowData] = useState([]);

    const [inicial, setInicial] = useState(inicialCentroProduccion); 

    const [deshabilitado, setDeshabilitado] = useState(false);

    //snack
    const [state] = useState({
      vertical: 'top',
      horizontal: 'center',
    });

    const { vertical, horizontal } = state;
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState(false);


      const deleMovApi2  = async(idEncabezado) => {
          
        const urlapiidEncabezado=`${URL_BASE}${API_SEL_CPI_REL}${idEncabezado}`;

        console.log("borrado mov de url ",urlapiidEncabezado);
        
        axios
        .get(urlapiidEncabezado,{    headers:{
        Authorization:`Bearer  ${token}`
      }})
        .then(({ data }) => {

          console.log("MOVIMIENTOS DATOS a borrar====>"+urlapiidEncabezado,data.data);
          const values=data.data;
          
          values.forEach((item) => {


              console.log("borrando",`${URL_BASE}${API_DEL_CPI}${item.id}`);   
              
                axios
                    .delete(`${URL_BASE}${API_DEL_CPI}${item.id}`,{headers:{
                      Authorization:`Bearer  ${token}`
                    }})
                    .then((response) => {
                        console.log("borrado movimiento ",response);

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
    

    const saveMovApiImp  = (values,idEncabezado) => {
      console.log("saveMovApiImp",values);



      values.forEach((item) => {

        console.log("item impresora",item);
        console.log("idencabezado",idEncabezado);

        axios
        .post(`${URL_BASE}${ API_INS_CPI}`, {
          
          data: {

            centroproduccion:idEncabezado,
            impresora:item.impresora.id


          },
        },{    headers:{
          Authorization:`Bearer  ${token}`
        }})
        .then((response) => {
          
          console.log("Movimiento grabado...",response);
        
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

    const handleCreateNewRow = (values) => {
      
          setIsLoading(true);
          setIsRefetching(true);
          
          //const idimpresora=impresoraData.find(element=>element.descripcion===values.impresora);
          const idbodega=bodegaData.find(element=>element.descripcion===values.bodega);
      
          //console.log("id impresora ",idimpresora);
          console.log("id bodega",idbodega);

          axios
              .post(`${URL_BASE}${API_INS}`, {

                data: {
                  codigo: values.codigo,
                  descripcion:values.descripcion,
                  //impresora: idimpresora.id,
                  bodega:idbodega.id
                  
      
                },
              },{ headers:{
                Authorization:`Bearer  ${token}`
              }})
              .then((response) => {



                //grabando movimiento de impresoras
                saveMovApiImp(values.centroproimps,response.data.data.id);

                console.log("reemplazando id =========>",response.data.data.id);  
                values.id=response.data.data.id;
                //values.impresora=response.data.data.impresora;
                //console.log("reemplazando impresora =========>",values.impresora);  
        
                values.bodega=response.data.data.bodega;
                console.log("reemplazando bodega =========>",values.bodega);  
                        
                
                //values.centroproimps=values.centroproimps
              
               
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
                
        //const idimpresora=impresoraData.find(element=>element.descripcion===values.impresora);
        const idbodega=bodegaData.find(element=>element.descripcion===values.bodega);
    
       // console.log("id impresora ",idimpresora);
        console.log("id bodega",idbodega);
       
       // values.impresora={id:idimpresora.id,descripcion:idimpresora.descripcion};

        values.bodega={id:idbodega.id,descripcion:idbodega.descripcion};

        tableData[rowData.index] = values;

          axios
          .put(`${URL_BASE}${API_UPD}${rowData.getValue('id')}`, {
            data: {
             
                codigo: values.codigo,
                descripcion:values.descripcion,
               // impresora: idimpresora.id,
                bodega:idbodega.id,
                

            },
          },{    headers:{
            Authorization:`Bearer  ${token}`
          }})
          .then((response) => {
            console.log(response);
            
            //borrando movimientos de impresora
            deleMovApi2(values.id); 
           
            //grabando movimiento de impresoras
            saveMovApiImp(values.centroproimps,values.id);

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
      
        const getSubfamilia_productos=(laid)=>{
          return tableData.find(({ id }) => id === laid);
        };
        
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

            if (!response.isConfirmed){
              return;
            };  


            setIsLoading(true);
            setIsRefetching(true);
            
            deleMovApi2(row.getValue('id'));
            //borrando encabezado
            
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
        /*
        {
          accessorKey: 'impresora.descripcion',
          header: 'impresora',
          size: 140,

        },*/
        {
          accessorKey: 'bodega.descripcion',
          header: 'bodega',
          size: 140,

        },        
        {
          accessorKey: 'centroproimps',
          header: 'dcentroproimps',
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
                   codigo: tableData[i].codigo ,
                   descripcion: tableData[i].descripcion,
                   //impresora: tableData[i].impresora.descripcion,
                   bodega:tableData[i].bodega.descripcion,};
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
                    //tableData[i].impresora.descripcion,
                    tableData[i].bodega.descripcion
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
   setTitle(inicialCentroProduccion.title);
   setSubTitle(inicialCentroProduccion.subtitle);
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

  const cargaBodega=async()=>{
  
    await axios
    .get(`${URL_BASE}${API_SEL_BOD}`,{    headers:{
      Authorization:`Bearer  ${token}`
    }})
    .then(({ data }) => {
     
      setBodegaData(data.data);

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
         cargaBodega();

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
        initialState={{ 
          columnVisibility: {   centroproimps: false ,
                           
                            }
                     }} 
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
                  //impresora:  row.original.impresora,
                  bodega: row.original.bodega,
                  centroproimps:row.original.centroproimps,


                };
                
                console.log(modificar);
                setInicial(modificar);
                setCreateModalOpen(true);
                setDeshabilitado(true);

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
              setInicial(inicialCentroProduccion);
              setTitulomod(`${title} Nuevo registro`);
              
              setCreateModalOpen(true)}}
            variant="contained"
          >
              <Add/>
          </Button>
        )}
      />
      
      <ModalCentroProduccion
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        onEdit={handleEdit}
        impresoraData={impresoraData}
        bodegaData={bodegaData}
        inicial={inicial}
        tableData={tableData}
        titulomod={titulomod}
        deshabilitado={deshabilitado}
        

      />

    </>
  );
};

export default  CentroProduccion;
