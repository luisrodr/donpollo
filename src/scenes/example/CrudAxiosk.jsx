import React, { useCallback, useMemo, useState ,useEffect} from 'react';
import axios from "axios";
import { Alert} from '@mui/material';
import MaterialReactTable ,
{ MRT_FullScreenToggleButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton, } from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Tooltip,
} from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import { Delete, Edit,Add } from '@mui/icons-material';
import { states,inicialUser} from '../../data/makeDataCrud';

import CloudDownload from "@mui/icons-material/CloudDownload";
import Print from "@mui/icons-material/Print";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import {  ActionIcon } from '@mantine/core';
//import {CreateNewAccountModal} from './CreateNewAccountModal';
import {CreateNewAccountModalB} from './CreateNewAccountModalB';




const CrudAxiosk = () => {
  
    const [titulo, setTitulo] = useState('');
    const [isRefetching, setIsRefetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [errorPrueba, setErrorPrueba] = useState(false);
    
    const [errorText, setErrorText] = useState("");

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [tableData, setTableData] = useState([]);

    const [ciudadData, setCiudadData] = useState([]);

    const [rowData, setRowData] = useState([]);

    const [inicialPersona, setInicialPersona] = useState(inicialUser); 

    //snack
    const [state] = useState({
      vertical: 'top',
      horizontal: 'center',
    });

    const { vertical, horizontal } = state;
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState(false);

    
    const handleCreateNewRow = (values) => {
      //buscando id ciudads 
      setIsLoading(true);
      setIsRefetching(true);
      
      const idciudad=ciudadData.find(element=>element.nombre===values.ciudad);
      console.log("id ciudad ")
      console.log(idciudad);
      axios
          .post(`${process.env.REACT_APP_URL_BASE}/api/crudpruebas?populate=*`, {

            data: {
             
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              age: values.age,
              state: values.state,
              ciudad: idciudad.id,
              urlimagen:values.urlimagen


            },
          })
          .then((response) => {
       
            console.log("reemplazando id =========>");  
            values.id=response.data.data.id;
            values.ciudad=response.data.data.ciudad;
            console.log("reemplazando ciudad =========>");  
            
            tableData.push(values);
            setTableData([...tableData]);
            setMessage(`Agregado ${values.id}`);
            setOpenSnack(true);

            setIsLoading(false);
            setIsRefetching(false);
           
        }).catch((error) => {

          console.log(error);
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });
    };

    const handleEdit= async (values ) => {

        setIsLoading(true);
        setIsRefetching(true);

        const idciudad=ciudadData.find(element=>element.nombre===values.ciudad);
        console.log("id ciudad modificar ")
        console.log(idciudad);   
        console.log("modificar reemplazando ciudad =========>");  
        values.ciudad={id:idciudad,nombre:values.ciudad};
        tableData[rowData.index] = values;

          axios
          .put(`${process.env.REACT_APP_URL_BASE}/api/crudpruebas/${rowData.getValue('id')}`, {
            data: {
             
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              age: values.age,
              state: values.state,
              ciudad:idciudad,
              urlimagen:values.urlimagen

            },
          })
          .then((response) => {
            //console.log(response);
            setIsLoading(false);
            setIsRefetching(false);
            setMessage(`Modificado ${values.id}`);
            setOpenSnack(true);
 
        }).catch((error) => {

          console.log(error);
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });
          
        setTableData([...tableData]);
   
    };



    const handleDeleteRow = useCallback(

      (row) => {
        setIsLoading(true);
        setIsRefetching(true);
        if (
          !window.confirm(`Seguro quiere borrar ${row.getValue('firstName')}`)
          //!confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
        ) {
          return;
        }

        //send api delete request here, then refetch or update local table data for re-render
 
        axios
        .delete(`${process.env.REACT_APP_URL_BASE}/api/crudpruebas/${row.getValue('id')}`)
        //.delete(`http://127.0.0.1:1337/api/crudpruebas/${row.index}`)  
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
          accessorKey: 'firstName',
          header: 'First Name',
          size: 140,

        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          size: 140,

        },
        {
          accessorKey: 'email',
          header: 'Email',

        },
        {
          accessorKey: 'age',
          header: 'Age',
          size: 80,

        },
        {
          accessorKey: 'state',
          header: 'State',
          muiTableBodyCellEditTextFieldProps: {
            select: true, //change to select for a dropdown
            children: states.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            )),
          },
        },
        {
          accessorKey: 'ciudad.nombre',
          header: 'Ciudad',
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

       const fila={firstName: tableData[i].firstName ,
                  lastName: tableData[i].lastName,
                  city: tableData[i].age,
                  state: tableData[i].state,
                  ciudad: tableData[i].ciudad.nombre};
       dataCsv=[...dataCsv,fila];
      
    };
 
    csvExporter.generateCsv(dataCsv);
  };


  const get_data_to_pdf=()=>{
    let dataPdf=[];

    for(let i = 0;i<tableData.length;i++) { 

       const fila=[ tableData[i].id, 
                    tableData[i].firstName ,
                    tableData[i].lastName,
                    tableData[i].email,
                    tableData[i].age,
                    tableData[i].state,
                    tableData[i].ciudad.nombre];
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

    
    doc.text( "Personas",15,10);
    autoTable(doc, {
      
      head: [get_column_to_pdf()],
      body: get_data_to_pdf(),
      
    })

    doc.save('table.pdf')


  };  
  useEffect(() => { 
    /*
   states.map((valor) => {
     console.log("valor");
     console.log(valor);
     
     const  modifiedData={nombre:valor};
      axios
        .post("http://127.0.0.1:1337/api/ciudads", { data: modifiedData })
        .then((response) => {
            console.log(response);
            
        })
        .catch((error) => {

          console.log(error);

        });
      
    
    });  
    
   */
   


   setTitulo(''); 
   setIsLoading(true);
   setIsRefetching(true);

   const cargaCiudad=async()=>{
  
     await axios
     .get(`${process.env.REACT_APP_URL_BASE}/api/ciudads`)
     .then(({ data }) => {
      
       setCiudadData(data.data);

       setIsLoading(false);
       setIsRefetching(false);


     }  )
     .catch((error) => {
       console.log("error")
       setErrorPrueba(true)
       setErrorText(JSON.stringify(error))
      
     });

   } 


   const cargaStrapi=async()=>{
  
       await axios
       .get(`${process.env.REACT_APP_URL_BASE}/api/crudpruebas?populate=*`)
       .then(({ data }) => {

         setInicialPersona(inicialUser);
         setTableData(data.data);    

         cargaCiudad();
        

       })
       .catch((error) => {
         console.log("error")
         setErrorPrueba(true)
         setErrorText(JSON.stringify(error))
       
       });

  } 

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
                 setTitulo(`Modifica registro Id ${row.original.id}`);
                 setRowData(row);  

                 const modificar={
                  id: row.original.id,
                  firstName: row.original.firstName,
                  lastName:  row.original.lastName,
                  email:  row.original.email,
                  age: row.original.age,
                  state: row.original.state,
                  ciudad: row.original.ciudad,
                  urlimagen:row.original.urlimagen
                };

                console.log(modificar);
                setInicialPersona(modificar);
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
              setInicialPersona(inicialUser);
              setTitulo("Nuevo registro");
              setCreateModalOpen(true)}}
            variant="contained"
          >
              <Add/>
          </Button>
        )}
      />
      <CreateNewAccountModalB
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        onEdit={handleEdit}
        ciudadData={ciudadData}
        inicialPersona={inicialPersona}
        titulo={titulo}
      />

    </>
  );
};



export default CrudAxiosk;
