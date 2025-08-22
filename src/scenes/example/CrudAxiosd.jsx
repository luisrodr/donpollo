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



import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import { Delete, Edit } from '@mui/icons-material';

import { data, states } from '../../data/makeDataCrud';
//import { states } from '../../data/makeDataCrud';
/*
import { useGetAxios } from '../../hooks/useGetAxios';
import { isValidDate } from '@fullcalendar/core';
*/
import { useFormik } from 'formik';
import * as yup from 'yup'




const CrudAxiosd = () => {

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [tableData, setTableData] = useState([]);
        
    const [validationErrors, setValidationErrors] = useState({});

    const [state, setState] = useState({
      
      vertical: 'top',
      horizontal: 'center',
    });
    const { vertical, horizontal } = state;

    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState(false);


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
            //alert(`Agregado ${values.campo}` );
            setMessage(`Agregado ${values.campo}`);
            setOpenSnack(true);

           
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
         // setErrorPrueba(true);
          // setErrorText(error.message);

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

    cargaStrapi();
     

  },[] );

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);

  };

  return (
    <>
      {/*
      {  errorPrueba   &&
        <Alert onClose={() => setErrorPrueba(false)} variant="outlined" severity="error">
            {errorText} This is an error alert — check it out!
        </Alert>
      }  
       
       <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
        
      />
      */}    
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




const checkoutSchema = yup.object().shape({
  campo: yup.string().required("required")

});

const inicial={
  campo: "",

};

export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  
  const [initValues,setinitValues] = useState(inicial);

  const formik = useFormik({
    
    initialValues: initValues,
    validationSchema: checkoutSchema ,
    onSubmit: (values) => {
      //alert(JSON.stringify(values, null, 2));
      handleSubmit(values);
      formik.resetForm();
    },
  });

  const handleSubmit = (values) => {
    //put your validation logic here
    
    onSubmit(values);
    
    onClose();
   
  };


  return (
    <>
  
      <Dialog open={open}>

        <DialogTitle textAlign="center">Create New Account</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >

            <TextField
              fullWidth
              id="campo"
              name="campo"
              label="Campo"
              value={formik.values.campo}
              onChange={formik.handleChange}
              error={formik.touched.campo && Boolean(formik.errors.campo)}
              helperText={formik.touched.campo && formik.errors.campo}
            />
            

            </Stack>

            <DialogActions sx={{ p: '1.25rem' }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button color="primary" type="submit" variant="contained">
                Submit
              </Button>
          </DialogActions>
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

export default CrudAxiosd;
