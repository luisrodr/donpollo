import React, { useCallback, useMemo, useState ,useEffect,useContext} from 'react';
import axios from "axios";
import Papa from "papaparse";
import Swal from "sweetalert2"; 

import Header from "../../components/Header";
// import ReactFileReader from 'react-file-reader';

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
import { inicialIp} from '../../data/makeDataCrud';
import CloudDownload from "@mui/icons-material/CloudDownload";
import Print from "@mui/icons-material/Print";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import {  ActionIcon } from '@mantine/core';

import {ModalIp} from './modal/ModalIp';

import { AuthContext } from "../../mycontext";

const URL_BASE=process.env.REACT_APP_URL_BASE;

//const API_SEL_TDE=process.env.REACT_APP_API_SEL_TDE;
const API_SEL_LUG=process.env.REACT_APP_API_SEL_LUG;


const API_SEL=process.env.REACT_APP_API_SEL_IPE;
const API_INS=process.env.REACT_APP_API_INS_IPE;
const API_UPD=process.env.REACT_APP_API_UPD_IPE;
const API_DEL=process.env.REACT_APP_API_DEL_IPE;



const Ip= () => {


    const {user} = useContext(AuthContext);
    
    const { token } = user;  

    const [titulomod, setTitulomod] = useState('');
  
    const [title, setTitle] = useState('');
  
    const [subTitle, setSubTitle] = useState('');
  
    const [isRefetching, setIsRefetching] = useState(false);
  
    const [isLoading, setIsLoading] = useState(false);
   ///////////////
    const [total, setTotal] = useState(0);

   // Paginación y ordenamiento
   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
   const [sorting, setSorting] = useState([]);
   const [globalFilter, setGlobalFilter] = useState('');
 
   //columnas
   const [columnFilters, setColumnFilters] = useState([]);



   /////////********    
     
    const [isOtrasTab, setIsOtrasTab] = useState(true);

    const [errorPrueba, setErrorPrueba] = useState(false);
    
    const [errorText, setErrorText] = useState("");

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [tableData, setTableData] = useState([]);

  
    const [lugarData, setLugarData] = useState([]);

    const [rowData, setRowData] = useState([]);

    const [inicial, setInicial] = useState(inicialIp); 

    const [deshabilitado, setDeshabilitado] = useState(false);

    //const [parsedData, setParsedData] = useState([]);


    //snack
    const [state] = useState({
      vertical: 'top',
      horizontal: 'center',
    });

    const { vertical, horizontal } = state;
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState(false);

    const filterTableData = (data, columnFilters) => {
      return data.filter(row => {
        return columnFilters.every(({ id, value }) => {
          const filterValue = value.toString().toLowerCase();

          if (id === 'lugar.descripcion') {
            // filtro en campo anidado
            return row.lugar?.descripcion?.toLowerCase().includes(filterValue);
          } else {
            // filtro en campo plano
            const cellValue = (row[id] ?? '').toString().toLowerCase();
            return cellValue.includes(filterValue);
          }
        });
      });
    };    

    const filteredData = useMemo(() => filterTableData(tableData, columnFilters), [tableData, columnFilters]);

    const handleCreateNewRow = (values) => {
    
  
          setIsLoading(true);
          setIsRefetching(true);
          

          const idlug=lugarData.find(element=>element.descripcion===values.lugar);
          console.log("id lugar ",idlug);


          axios
              .post(`${URL_BASE}${API_INS}`, {

                data: {

                  nombre:values.nombre,
                  equipo:values.equipo,
                  ip:values.ip,
                  detalle:values.detalle ,
                  lugar:idlug.id

                  
                },
              },{    headers:{
                Authorization:`Bearer  ${token}`
              }})
              .then((response) => {
          

                values.id=response.data.data.id;
                values.lugar=response.data.data.lugar;
                console.log("reemplazando tipodescuento =========>",values.lugar);                  


                            
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


        console.log("modifica=====ok los VALUES ", values);
           
        setIsLoading(true);
        setIsRefetching(true);
      


         const idlug=lugarData.find(element=>element.descripcion===values.lugar);
         console.log("id lugar ",idlug);
         values.lugar={id:idlug.id,descripcion:idlug.descripcion};


        tableData[rowData.index] = values;

          axios
          .put(`${URL_BASE}${API_UPD}${rowData.getValue('id')}`, {
            data: {
             
 
               
                nombre:values.nombre,
                equipo:values.equipo,
                ip:values.ip,
                detalle:values.detalle ,
                lugar:idlug.id

                
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


   const handleDeleteRow = useCallback(

      (row) => {
      
        console.log("id a borrar: ",row.getValue('id'));


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
          header: 'id',
          enableColumnOrdering: false,
          enableEditing: false, //disable editing on this column
          enableSorting: false,
          size: 80,
        },

        {
          accessorKey: 'nombre',
          header: 'nombre',
          size: 140,

        },        
        {
          accessorKey: 'equipo',
          header: 'equipo',
          size: 140,

        },
        {
          accessorKey: 'ip',
          header: 'ip',
          size: 140,

        },                        
        {
          accessorKey: 'detalle',
          header: 'detalle',
          size: 140,

        },        
        {
          accessorKey: 'lugar.descripcion',
          header: 'lugar',
          size: 140,

        },                
                
      ],
      [],
    );

  
  //  accessorKey: 'familia_producto.descripcion',
  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);

  };

 
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
                   nombre: tableData[i].nombre,
                   equipo: tableData[i].equipo,
                   ip: tableData[i].ip,
                   detalle:tableData[i].detalle,
                   lugar:tableData[i].lugar.descripcion

                    };
       dataCsv=[...dataCsv,fila];
      
    };
 
    csvExporter.generateCsv(dataCsv);
  };


  const get_data_to_pdf=()=>{
    let dataPdf=[];



    for(let i = 0;i<tableData.length;i++) { 

       const fila=[ tableData[i].id, 
                    tableData[i].nombre ,
                    tableData[i].equipo ,
                    tableData[i].ip,
                    tableData[i].idetalle,
                    tableData[i].lugar.descripcion
                
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




  const cargaLugar=async()=>{
  
    await axios
    .get(`${URL_BASE}${API_SEL_LUG}`,{    headers:{
      Authorization:`Bearer  ${token}`
    }})
    .then(({ data }) => {
 

      setLugarData(data.data);

      setIsLoading(false);
      setIsRefetching(false);

    })
    .catch((error) => {
      console.log("error")
      setErrorPrueba(true)
      setErrorText(JSON.stringify(error))
     
    });

  };  


  function handleColumnDrag(event)  {
    let columnOrder = [];


  };

const buildFilterQuery = (searchTerm) => {
  if (!searchTerm) return '';

  const encoded = encodeURIComponent(searchTerm);

    return (
      `&filters[$or][0][id][$containsi]=${encoded}` +
      `&filters[$or][1][nombre][$containsi]=${encoded}` +
      `&filters[$or][2][equipo][$containsi]=${encoded}` +
      `&filters[$or][3][ip][$containsi]=${encoded}` +
      `&filters[$or][4][detalle][$containsi]=${encoded}`
    );
  };
  const buildColumnFiltersQuery = (filters) => {
    if (!filters.length) return '';

    return filters
      .map((filter, index) => {
        const key = encodeURIComponent(filter.id);
        const value = encodeURIComponent(filter.value);
        return `&filters[$and][${index}][${key}][$containsi]=${value}`;
      })
      .join('');
  };




  useEffect(() => { 


   setTitulomod(''); 
   setTitle(inicialIp.title);
   setSubTitle(inicialIp.subtitle);
   setIsLoading(true);
   setIsRefetching(true);


   const urlapi=`${URL_BASE}${API_SEL}`
   console.log(urlapi);

   const cargaStrapi=async()=>{
        const { pageIndex, pageSize } = pagination;
        const sort = sorting[0]
          ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}`
          : '';

        const filterQuery = buildFilterQuery(globalFilter);
        

        const urlapi =
        `${URL_BASE}${API_SEL}?` +
        `pagination[page]=${pageIndex + 1}` +
        `&pagination[pageSize]=${pageSize}` +
        `${sort ? `&sort=${encodeURIComponent(sort)}` : ''}` +
        `&populate=lugar` + // trae relación lugar para mostrar pero no filtrar en backend
        `&fields[0]=id&fields[1]=nombre&fields[2]=equipo&fields[3]=ip&fields[4]=detalle` +
        `${filterQuery || '' }`

        await axios
          .get(urlapi, {
            headers: { Authorization: `Bearer ${token}` },
          })
       .then(({ data }) => {

        setTableData(data.data);
        setTotal(data.meta.pagination.total);
        setIsLoading(false);
        setIsRefetching(false);

        if (isOtrasTab){
            cargaLugar();
            setIsOtrasTab(false);
        }
        

       })
       .catch((error) => {
         console.log("error")
         setErrorPrueba(true)
         setErrorText(JSON.stringify(error))
       
       });

  }; 

   cargaStrapi();

  
 },[pagination, sorting, globalFilter,columnFilters] );  
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


     {/* <input
        type="file"
        name="file"
        onChange={changeHandler}
        accept=".csv"
        style={{ display: "block", margin: "10px auto" }}
      />  */}

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
        data={filteredData}
        manualPagination
        manualSorting
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onColumnFiltersChange={setColumnFilters}  // Actualiza filtros por columna
        enableColumnFilters
        rowCount={total}
        manualFiltering
        enableRowSelection={false}
        muiTablePaginationProps={{
          rowsPerPageOptions: [10, 25, 50],
          showFirstButton: true,
          showLastButton: true,
        }}
        state={{
          columnVisibility:{imagen:false},
          isLoading,
          showProgressBars: isRefetching,
          pagination, 
          sorting,
          columnFilters,
      
        }}     

        manualGlobalFilter
        onGlobalFilterChange={setGlobalFilter}
   

        onDraggingColumnChange={handleColumnDrag}
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
    
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() =>{

                 console.log("modificando");
                 setTitulomod(`${title} Modifica registro Id ${row.original.id}`);
                 setRowData(row);  

                 const modificar={
                  // id: row.original.id,
                  // codigo: row.original.codigo,
                  // descripcion:  row.original.descripcion,
                  // tipodescuento:  row.original.tipodescuento,
                  id: row.original.id,
                  nombre:  row.original.nombre,
                  equipo:  row.original.equipo,
                  ip:  row.original.ip,
                  detalle:  row.original.detalle,
                  lugar:  row.original.lugar,
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
              setInicial(inicialIp);
              setTitulomod(`${title} Nuevo registro`);
              
              setCreateModalOpen(true)}}
            variant="contained"
          >
              <Add/>
          </Button>
        )}
      />
      
      <ModalIp
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        onEdit={handleEdit}
 
        lugarData={lugarData}
        inicial={inicial}
        tableData={tableData}
        titulomod={titulomod}
        deshabilitado={deshabilitado}
        

      />

    </>
  );
};

export default Ip;
