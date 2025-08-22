import React, { useCallback, useMemo, useState ,useEffect} from 'react';
import axios from "axios";
import { Alert } from '@mui/material';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

import { data, states } from '../../data/makeDataCrud';
//import { states } from '../../data/makeDataCrud';

import { useGetAxios } from '../../hooks/useGetAxios';
import { isValidDate } from '@fullcalendar/core';

import { useFormik } from 'formik';
import * as Yup from 'yup'


const CrudAxiosb = () => {

    const [createModalOpen, setCreateModalOpen] = useState(false);
 //   const [tableData, setTableData] = useState(() => data);
    const [tableData, setTableData] = useState([]);
        
    const [validationErrors, setValidationErrors] = useState({});

    const [errorPrueba, setErrorPrueba] = useState(false);

    const [errorText, setErrorText] = useState('');

    const handleCreateNewRow = (values) => {
      axios
          .post(`http://127.0.0.1:1337/api/crudpruebas`, {
            data: {
             
              firstName:values.firstName,
              lastName:values.lastName,
              age:values.age,
              email:values.email,
              state:values.state,
            },
          })
          .then((response) => {
       
            console.log("reemplazando id =========>");  
            values.id=response.data.data.id;
            console.log(values.id);  
            tableData.push(values);
            setTableData([...tableData]);

           
        });


    };

    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        tableData[row.index] = values;
        console.log("valores A MODIFICAR");
        console.log(values);  

        //send/receive api updates here, then refetch or update local table data for re-render
          /*            data: {
              age:row.getValue('age'),
              
              firstName:row.getValue('firstName'),
             
            }, */
          axios
          .put(`http://127.0.0.1:1337/api/crudpruebas/${row.getValue('id')}`, {
            data: {
             
              firstName:values.firstName,
              lastName:values.lastName,
              age:values.age,
              email:values.email,
              state:values.state,

            },
          })
          .then((response) => {
            console.log(response);
        });
          
        setTableData([...tableData]);
        exitEditingMode(); //required to exit editing mode and close modal
      }
    };

    const handleCancelRowEdits = () => {
      setValidationErrors({});
    };

    const handleDeleteRow = useCallback(
      (row) => {
        if (
          !window.confirm(`Seguro quiere borrar ${row.getValue('firstName')}`)
          //!confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
        ) {
          return;
        }

        //send api delete request here, then refetch or update local table data for re-render
 
        axios
        .delete(`http://127.0.0.1:1337/api/crudpruebas/${row.getValue('id')}`)
        //.delete(`http://127.0.0.1:1337/api/crudpruebas/${row.index}`)  
        .then((response) => {
            console.log(response);
            tableData.splice(row.index, 1);
            setTableData([...tableData]);
            
        })
        .catch((error) => {

          console.log(error);
          setErrorPrueba(true);
           setErrorText(error.message);

        });
  
      },
      [tableData],
    );

    const getCommonEditTextFieldProps = useCallback(
      (cell) => {
        return {
          error: !!validationErrors[cell.id],
          helperText: validationErrors[cell.id],
          onBlur: (event) => {
            const isValid =
              cell.column.id === 'email'
                ? validateEmail(event.target.value)
                : cell.column.id === 'age'
                ? validateAge(+event.target.value)
                : validateRequired(event.target.value);
            if (!isValid) {
              //set validation error for cell if invalid
              setValidationErrors({
                ...validationErrors,
                [cell.id]: `${cell.column.columnDef.header} es requerido`,
              });
            } else {
              //remove validation error for cell if valid
              delete validationErrors[cell.id];
              setValidationErrors({
                ...validationErrors,
              });
            }
          },
        };
      },
      [validationErrors],
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
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'email',
        }),
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',
        }),
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
    ],
    [getCommonEditTextFieldProps],
  );
  


  useEffect(() => {   
    /*
    data.map(({id}) => {
      
      axios
        .delete(`http://127.0.0.1:1337/api/crudpruebas/${id}`)
        .then((response) => {
            console.log(response);
            
        })
        .catch((error) => {

          console.log(error);

        });
    
    });

    data.map(({firstName,lastName,email,age,state}) => {
      const  modifiedData={firstName,lastName,email,age,state};
       axios
         .post("http://127.0.0.1:1337/api/crudpruebas", { data: modifiedData })
         .then((response) => {
             console.log(response);
             
         })
         .catch((error) => {
 
           console.log(error);
 
         });
     
     });   
    */
    const cargaStrapi=async()=>{
      await axios
      .get("http://localhost:1337/api/crudpruebas")
      .then(({ data }) => {
        //console.log(data.data);
        setTableData(data.data);        
      }  )
      .catch((error) => console.log("error"));
   } 

    cargaStrapi();
     

  },[] );

  {/*
  if (error) {
    // Print errors if any
    return <div>An error occured: {error.message}</div>;
  }
  if (loading) {
    // Print errors if any
    return <div>Cargando...</div>;
  }  
  
   */}
  // <Alert severity="error">{errorText} This is an error alert — check it out!</Alert> 
  return (
    <>
  
      {  errorPrueba   &&
        <Alert onClose={() => setErrorPrueba(false)} variant="outlined" severity="error">
            {errorText} This is an error alert — check it out!
        </Alert>
      }      
      
       
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
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
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
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Crea nuevo registro
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}

      />
   
    </>
  );
};


//example of creating a mui dialog modal for creating new rows
/*
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [errorNew,setErrorNew]=useState(false);
  const [errorNewtext,setErrorNewText]=useState("");


  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {
    //put your validation logic here
    
    console.log("la validacion "+values.email);
    console.log(validateRequired(values.email));

   if (validateRequired(values.email)){

        onSubmit(values);

        //inicia valores
        setValues(() =>
            columns.reduce((acc, column) => {
              acc[column.accessorKey ?? ''] = '';
              return acc;
            }, {}),
            );
            
        onClose();
   }else{
        setErrorNew(true);
        setErrorNewText("Falta algo");
   }


  };

  return (
    <>
   
   
      <Dialog open={open}>
        <DialogTitle textAlign="center">Create New Account</DialogTitle>
        <DialogContent>
          
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >
              {columns.map((column) => (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              ))}
            </Stack>
          </form>
          
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" onClick={handleSubmit} variant="contained">
            Create New Account
          </Button>
        </DialogActions>
        {  errorNew   &&
        <Alert onClose={() => setErrorNew(false)} variant="outlined" severity="error">
            {errorNewtext} This is an error alert — check it out!
        </Alert>
      }   
      </Dialog>
    </>
  );
};
*/
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [errorNew,setErrorNew]=useState(false);
  const [errorNewtext,setErrorNewText]=useState("");


  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {
    //put your validation logic here
    
    console.log("la validacion "+values.email);
    console.log(validateRequired(values.email));

   if (validateRequired(values.email)){

        onSubmit(values);

        //inicia valores
        setValues(() =>
            columns.reduce((acc, column) => {
              acc[column.accessorKey ?? ''] = '';
              return acc;
            }, {}),
            );
            
        onClose();
   }else{
        setErrorNew(true);
        setErrorNewText("Falta algo");
   }


  };

  return (
    <>
  
      <Dialog open={open}>
        <DialogTitle textAlign="center">Create New Account</DialogTitle>
        <DialogContent>
          
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >
              {columns.map((column) => (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              ))}
            </Stack>
          </form>
          
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" onClick={handleSubmit} variant="contained">
            Create New Account
          </Button>
        </DialogActions>
        {  errorNew   &&
        <Alert onClose={() => setErrorNew(false)} variant="outlined" severity="error">
            {errorNewtext} This is an error alert — check it out!
        </Alert>
      }   
      </Dialog>
    </>
  );
};


const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default CrudAxiosb;
