import React, {  useMemo, useState ,useEffect,useContext} from 'react';
import axios from "axios";


import Header from "../../components/Header";


import MaterialReactTable ,
{ MRT_FullScreenToggleButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton, } from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import {
  Alert,
  Box,

  IconButton,
  Tooltip,
} from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import {  ViewAgenda } from '@mui/icons-material';

import { inicialFacturas} from '../../data/makeDataCrud';

import CloudDownload from "@mui/icons-material/CloudDownload";
import Print from "@mui/icons-material/Print";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import {  ActionIcon } from '@mantine/core';
//import PdfViewerModal1 from '../donpollo/PdfViewerModal1';

//import PDFViewer from 'pdf-viewer-reactjs'
import { AuthContext } from "../../mycontext";

const URL_BASE=process.env.REACT_APP_URL_BASE;
const API_SEL=process.env.REACT_APP_API_SEL_FAC;

const URL_IMG=process.env.REACT_APP_URL_IMG_CHOROMBO;

const Facturas= () => {
    const {user} = useContext(AuthContext);
    const { token } = user;  

 //   const [titulomod, setTitulomod] = useState('');
  
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
   
    const [errorPrueba, setErrorPrueba] = useState(false);
    
    const [errorText, setErrorText] = useState("");

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [tableData, setTableData] = useState([]);

    const [tipodescuentoData, setTipodescuentoData] = useState([]);
  
    const [rowData, setRowData] = useState([]);

    const [inicial, setInicial] = useState(inicialFacturas); 

    const [deshabilitado, setDeshabilitado] = useState(false);

    const [open, setOpen] = useState(false);
    
    const [pdfUrl, setpdfUrl] = useState('');

    const [state] = useState({
      vertical: 'top',
      horizontal: 'center',
    });

    const { vertical, horizontal } = state;
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState(false);
   

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
          accessorKey: 'tipo',
          header: 'tipo',
          size: 40,

        },
        {
          accessorKey: 'numero',
          header: 'numero',
          size: 40,

        },
        {
          accessorKey: 'fecha',
          header: 'fecha',
          size: 40,

        },
        {
          accessorKey: 'periodo',
          header: 'periodo',
          size: 40,

        },
        {
          accessorKey: 'codpro',
          header: 'codpro',
          size: 140,

        },                    
        {
          accessorKey: 'razonsocia',
          muiTableBodyCellProps: { sx: { textAlign: "left" } }, 
          header: 'razonsocia',
          size: 140,

        },                
        {
          accessorKey: 'rut',
          header: 'rut',
          size: 40,

        },                
        {
          accessorKey: 'total',
          muiTableBodyCellProps: { sx: { textAlign: "left" } }, 
          header: 'total',
          Cell: ({ cell }) =>
            new Intl.NumberFormat("es-ES").format(cell.getValue()),



          size: 40,

        },                
        {
          accessorKey: 'imagen',
          header: 'imagen',
          size: 40,

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

 const csvOptions = {
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  useBom: true,
  useKeysAsHeaders: false,
  headers: columns.filter( (h) => !(h.header==="imagen")).
                   map((c) => c.header ),
};
  
  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportData = () => {
    let dataCsv=[];

    for(let i = 0;i<tableData.length;i++) { 

       const fila={id: tableData[i].id ,
                   tipo: tableData[i].tipo ,
                   numero: tableData[i].numero,
                   fecha: tableData[i].fecha,
                   periodo: tableData[i].periodo,
                   codpro: tableData[i].codpro,
                   razonsocia: tableData[i].razonsocia,
                   rut: tableData[i].rut,
                   total: tableData[i].total,
         
                    };
       dataCsv=[...dataCsv,fila];
      
    };



    csvExporter.generateCsv(dataCsv);
  };


  const get_data_to_pdf=()=>{
    let dataPdf=[];

    for(let i = 0;i<tableData.length;i++) { 

       const fila=[ tableData[i].id, 
                    tableData[i].tipo ,
                    tableData[i].numero,
                    tableData[i].fecha,
                    tableData[i].periodo,
                    tableData[i].codpro,
                    tableData[i].razonsocia,
                    tableData[i].rut,
                    tableData[i].total,
            

                
       ];
       dataPdf=[...dataPdf,fila];
      
    };

    return dataPdf;
 
  }

  const get_column_to_pdf=()=>{


    let columnPdf=columns.filter( (h) => !(h.header==="imagen")).
                   map((c) => c.header );

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

  const buildFilterQuery = (searchTerm) => {
    if (!searchTerm) return '';

    const encoded = encodeURIComponent(searchTerm);

    return (
      `&filters[$or][0][tipo][$containsi]=${encoded}` +
      `&filters[$or][1][numero][$containsi]=${encoded}` +
      `&filters[$or][2][razonsocia][$containsi]=${encoded}` +
      `&filters[$or][3][rut][$containsi]=${encoded}` +
      `&filters[$or][4][codpro][$containsi]=${encoded}` +
      `&filters[$or][5][periodo][$containsi]=${encoded}` +
      `&filters[$or][6][fecha][$containsi]=${encoded}`
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

   setIsLoading(true);
   setIsRefetching(true);

   const cargaStrapi=async()=>{

        const { pageIndex, pageSize } = pagination;
        const sort = sorting[0]
          ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}`
          : '';

        const filterQuery = buildFilterQuery(globalFilter);
        const columnFilterQuery = buildColumnFiltersQuery(columnFilters); 

      const urlapi =
        `${URL_BASE}${API_SEL}?pagination[page]=${pageIndex + 1}&pagination[pageSize]=${pageSize}` +
        `${sort ? `&sort=${sort}` : ''}` +
        `&fields[0]=tipo&fields[1]=numero&fields[2]=fecha&fields[3]=periodo` +
        `&fields[4]=codpro&fields[5]=razonsocia&fields[6]=rut&fields[7]=total&fields[8]=imagen` +
        `${filterQuery}` +
        `${columnFilterQuery}`;

       
        console.log("llamando a strapi",urlapi);

        await axios
          .get(urlapi, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(({ data }) => {
           setTableData([...data.data]);

            console.log("data:     ",data)
            console.log("Total ",data.meta.pagination.total) 

           
            setTotal(data.meta.pagination.total);

            setIsLoading(false);
            setIsRefetching(false);
          })
          .catch((error) => {
            setErrorPrueba(true);
            setErrorText(JSON.stringify(error));
          });

  }; 
   cargaStrapi();
   
 },[pagination, sorting, globalFilter,columnFilters]);  
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
        rowCount={total}
        manualPagination
        manualSorting
        manualFiltering
        onColumnFiltersChange={setColumnFilters}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
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
   
        localization={MRT_Localization_ES}
        enableTopToolbar={true} //hide top toolbar
        enableBottomToolbar={true} //hide bottom toolbar
        renderToolbarInternalActions={({ table }) => (
          <>
            <ActionIcon
                      onClick={() => {
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
            <Tooltip arrow placement="left" title="Imagen">
              {/* <IconButton onClick={() =>{
                //lo abre directo en el navegador*****************
                console.log(row.original.imagen);
                const link = document.createElement('a');
                link.href = `${URL_IMG}${row.original.imagen}`;
                link.download = 'archivo.pdf'; // Nombre del archivo
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}> 
                <ViewAgenda />
              </IconButton> */}
                <IconButton
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = `${URL_IMG}${row.original.imagen}`;
                    link.setAttribute("download", row.original.imagen); // 👈 fuerza descarga
                    link.setAttribute("target", "_self"); // 👈 evita nueva pestaña
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <ViewAgenda />
                </IconButton>
              
            </Tooltip>

          </Box>
        )}

      />

    </>
  );
};

export default Facturas;
