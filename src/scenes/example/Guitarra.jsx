

import React, { useMemo } from 'react';

import Header from "../../components/Header";

import { Box } from "@mui/material";

import MaterialReactTable, 
{ MRT_FullScreenToggleButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton, } from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import {  ActionIcon } from '@mantine/core';

import CloudDownload from "@mui/icons-material/CloudDownload";
import Print from "@mui/icons-material/Print";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import { useGetAxios } from '../../hooks/useGetAxios';

const Guitarra = () => {


  //should be memoized or stable
  const columnsTable = useMemo(
    () => [

      {
        accessorKey: 'nombre', //normal accessorKey
        header: 'Nombre',
      },
      {
        accessorKey: 'descripcion', //normal accessorKey
        header: 'Descripcion',
      },
      {
        accessorKey: 'imagen', //normal accessorKey
        header: 'Imagen',
      },
     
     
    ],
    [],
  );

  const {data:guitarras,loading,error}=useGetAxios("http://localhost:1337/api/guitarras");

  if (error) {
    // Print errors if any
    return <div>An error occured: {error.message}</div>;
  }
  if (loading) {
    // Print errors if any
    return <div>Cargando...</div>;
  }

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columnsTable.map((c) => c.header),
  };
  
  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportData = () => {
    let dataCsv=[];

    for(let i = 0;i<guitarras.length;i++) { 

       const fila={nombre: guitarras[i].nombre ,
                  descripcion: guitarras[i].descripcion,
                  city:  guitarras[i].imagen,
                   };
       dataCsv=[...dataCsv,fila];
      
    };
 
    csvExporter.generateCsv(dataCsv);
  };


  const get_data_to_pdf=()=>{
    let dataPdf=[];

    for(let i = 0;i<guitarras.length;i++) { 

       const fila=[ guitarras[i].nombre ,
                    guitarras[i].descripcion,
                    guitarras[i].imagen,
];
       dataPdf=[...dataPdf,fila];
      
    };

    return dataPdf;
 
  }

  const get_column_to_pdf=()=>{
    let columnPdf=[];

    for(let i = 0;i<columnsTable.length;i++) { 

       columnPdf=[...columnPdf,columnsTable[i].header];
      
    };

    return columnPdf;
  }  

  const downloadPdf=()=>{
    const doc = new jsPDF()


    autoTable(doc, { html: '#my-table' })

    
    doc.text( "Guitarras",15,10);
    autoTable(doc, {
      
      head: [get_column_to_pdf()],
      body: get_data_to_pdf(),
      
    })

    doc.save('table.pdf')


  };  


  return (
    <>   
      <Box m="20px">
        <Header
          title="Guitarra"
          subtitle="Lista de guitarras para futura referencia"
        />
      </Box>

        <MaterialReactTable 
        columns={columnsTable} 
        data={guitarras} 
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
      
      />


       <ul>
        {guitarras.map(({ id,nombre }) => (
          <li key={id}>{nombre}</li>
        ))}
      </ul>
 
    </>
 

  );
};

export default Guitarra;
