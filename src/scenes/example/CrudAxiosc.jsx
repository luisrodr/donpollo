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
  Typography
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

import { data, states } from '../../data/makeDataCrud';
//import { states } from '../../data/makeDataCrud';
/*
import { useGetAxios } from '../../hooks/useGetAxios';
import { isValidDate } from '@fullcalendar/core';
*/
import { useFormik } from 'formik';
import * as Yup from 'yup'





const CrudAxiosc = () => {

    const [createModalOpen, setCreateModalOpen] = useState(false);
 //   const [tableData, setTableData] = useState(() => data);
    const [tableData, setTableData] = useState([]);
        
    const [validationErrors, setValidationErrors] = useState({});

    const [errorPrueba, setErrorPrueba] = useState(false);

    const [errorText, setErrorText] = useState('');

    const handleCreateNewRow = (values) => {
      axios
          .post(`http://127.0.0.1:1337/api/pruebaunos`, {
            data: {
             
              campo:values.campo,

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
          .put(`http://127.0.0.1:1337/api/pruebaunos/${row.getValue('id')}`, {
            data: {
             
              campo:values.campo,
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
        .delete(`http://127.0.0.1:1337/api/pruebaunos/${row.getValue('id')}`)
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
        accessorKey: 'campo',
        header: 'Campo',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
     
    ],
    [getCommonEditTextFieldProps],
  );
  


  useEffect(() => {   

    const cargaStrapi=async()=>{
      await axios
      .get("http://localhost:1337/api/pruebaunos")
      .then(({ data }) => {
        //console.log(data.data);
        setTableData(data.data);        
      }  )
      .catch((error) => console.log("error"));
   } 

   // cargaStrapi();
     

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


const validationSchema = Yup.object({
  email: Yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});


export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  

  const formik = useFormik({
    initialValues: {
      email: 'foobar@example.com',
      password: 'foobar',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      onClose();
    },
  });


  return (
    <>
  
      <Dialog open={open}>

        <DialogTitle textAlign="center">Create New Account</DialogTitle>
        <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button color="primary" variant="contained" fullWidth type="submit">
            Submit
          </Button>
        </form>
         </DialogContent>
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

export default CrudAxiosc;
