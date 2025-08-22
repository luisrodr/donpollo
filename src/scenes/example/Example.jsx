//https://www.youtube.com/watch?v=4YLa9iuN43c     validacion form
// https://mui.com/store/ templates

import React, { useMemo } from 'react';

import Header from "../../components/Header";
//import { useTheme } from "@mui/material";
import { Box } from "@mui/material";
//import { tokens } from "../../theme";

import MaterialReactTable, 
{ MRT_FullScreenToggleButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton, } from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import {  ActionIcon } from '@mantine/core';
//import { IconCloudDownload} from '@tabler/icons-react';
import CloudDownload from "@mui/icons-material/CloudDownload";
import Print from "@mui/icons-material/Print";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here


//nested data is ok, see accessorKeys in ColumnDef below
const data = [
  {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    name: {
      firstName: 'Jane',
      lastName: 'Doe',
    },
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    name: {
      firstName: 'Joe',
      lastName: 'Doe',
    },
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    name: {
      firstName: 'Kevin',
      lastName: 'Vandy',
    },
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    name: {
      firstName: 'Joshua',
      lastName: 'Rolluffs',
    },
    address: '32188 Larkin Turnpike',
    city: 'Charleston',
    state: 'South Carolina',
  },
];



const Example = () => {
 // const theme = useTheme();
 // const colors = tokens(theme.palette.mode);

  //should be memoized or stable
  const columnsTable = useMemo(
    () => [
      {
        accessorKey: 'name.firstName', //access nested data with dot notation
        header: 'First Name',
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address', //normal accessorKey
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ],
    [],
  );
 
 //const columnsCsv=['First Name','Last Name','Addres','City','State']

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

    for(let i = 0;i<data.length;i++) { 

       const fila={firstName: data[i].name.firstName ,
                  lastName: data[i].name.lastName,
                  city:  data[i].city,
                  state: data[i].state };
       dataCsv=[...dataCsv,fila];
      
    };
 
    csvExporter.generateCsv(dataCsv);
  };


  const get_data_to_pdf=()=>{
    let dataPdf=[];

    for(let i = 0;i<data.length;i++) { 

       const fila=[ data[i].name.firstName ,
                   data[i].name.lastName,
                   data[i].address,
                   data[i].city,
                   data[i].state ];
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

    
    doc.text( "Personas",15,10);
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
          title="Simple"
          subtitle="Lista de contactos para futura referencia"
        />
      
    
      </Box>



        <MaterialReactTable 
        columns={columnsTable} 
        data={data} 
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
 
    </>
 

  );
};

export default Example;
