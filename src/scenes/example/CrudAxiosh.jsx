import React, { useCallback, useMemo, useState ,useEffect} from 'react';
import axios from "axios";
import { Alert, InputLabel, Select } from '@mui/material';
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



import Snackbar from '@mui/material/Snackbar';
import { Delete, Edit } from '@mui/icons-material';


import { states,inicialUser} from '../../data/makeDataCrud';

import { useFormik } from 'formik';
import * as yup from 'yup'




const CrudAxiosh = () => {

  
    const [errorPrueba, setErrorPrueba] = useState(false);
    
    const [errorText, setErrorText] = useState("");

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [tableData, setTableData] = useState([]);

    const [ciudadData, setCiudadData] = useState([]);

    const [rowData, setRowData] = useState([]);

    const [inicialPersona, setInicialPersona] = useState(inicialUser); 
        
    //const [validationErrors, setValidationErrors] = useState({});


    //snack
    const [state] = useState({
      vertical: 'top',
      horizontal: 'center',
    });
    const { vertical, horizontal } = state;
    const [openSnack, setOpenSnack] = useState(false);
    const [message, setMessage] = useState(false);


    const handleCreateNewRow = (values) => {
      axios
          .post(`http://127.0.0.1:1337/api/crudpruebas`, {
            data: {
             
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              age: values.age,
              state: values.state,

            },
          })
          .then((response) => {
       
            console.log("reemplazando id =========>");  
            values.id=response.data.data.id;
            console.log(values.id);  
            tableData.push(values);
            setTableData([...tableData]);
            //alert(`Agregado ${values.campo}` );
            setMessage(`Agregado ${values.id}`);
            setOpenSnack(true);

           
        }).catch((error) => {

          console.log(error);
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });


    };


    const handleEdit= async (values ) => {
        console.log("valores A MODIFICAR=====>>>>>");
       
        console.log(values);       
        tableData[rowData.index] = values;
          axios
          .put(`http://127.0.0.1:1337/api/crudpruebas/${rowData.getValue('id')}`, {
            data: {
             
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              age: values.age,
              state: values.state,
            },
          })
          .then((response) => {
            console.log(response);

            setMessage(`Modificado ${values.id}`);
            setOpenSnack(true);
 
        }).catch((error) => {

          console.log(error);
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });
          
        setTableData([...tableData]);
   
    };

    /*
    const handleCancelRowEdits = () => {
      setValidationErrors({});
    };
    */

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
          setErrorPrueba(true)
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
      ],
      [],
    );
    


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

    const cargaCiudad=async()=>{
   
      await axios
      .get("http://localhost:1337/api/ciudads")
      .then(({ data }) => {
       
      
        setCiudadData(data.data);

 
      }  )
      .catch((error) => {
        console.log("error")
        setErrorPrueba(true)
        setErrorText(JSON.stringify(error))
       
      });

 

    } 


    const cargaStrapi=async()=>{
   
        await axios
        .get("http://localhost:1337/api/crudpruebas")
        .then(({ data }) => {
          //console.log(data.data);
          setInicialPersona(inicialUser);
          setTableData(data.data);    

          cargaCiudad();
         

        }  )
        .catch((error) => {
          console.log("error")
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))
        
        });

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
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        
       
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() =>{


                 console.log("modificando");
                 
                 setRowData(row);  

                 const modificar={
                  id: row.original.id,
                  firstName: row.original.firstName,
                  lastName:  row.original.lastName,
                  email:  row.original.email,
                  age: row.original.age,
                  state: row.original.state,
                };
                
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
        onEdit={handleEdit}
        ciudadData={ciudadData}
        inicialPersona={inicialPersona}
      />

    </>
  );
};

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup
  .string('Enter your email')
  .email('Enter a valid email')
  .required('Email is required'),
  age:yup.number().required("required"),
  state: yup.string().required("required")
});



export const CreateNewAccountModal = ({ open, onClose, onSubmit,onEdit ,ciudadData,inicialPersona}) => {
  
  const [initValues] = useState(inicialPersona);
  const [valuesciudad, setValuesciudad] = useState({  });
    
  const formik = useFormik({
    
    initialValues:initValues,
    validationSchema: checkoutSchema ,
    onSubmit: (values) => {
         
      if (values.id==="new" ){

          onSubmit(values);
          
          onClose();
      }else{
           console.log("formik edit============>"); 
           console.log(values); 
           onEdit(values);
             
           onClose();
      }  
 
      formik.resetForm();


    },
  });


  const handleChange = ( event) => {
  
    const vnombre=event.target.value;
    console.log(vnombre);
   
    setValuesciudad(vnombre);
    
    formik.setFieldValue("state", vnombre);
    
  };



  useEffect(() => {

    const cargaValores=(iniper)=>{
      console.log("Valores iniciales =====>");
      //console.log(iniper);
      
      //setinitValues(inicialPersona);
      formik.setFieldValue("id", iniper.id);
      formik.setFieldValue("firstName", iniper.firstName);
      formik.setFieldValue("lastName", iniper.lastName);
      formik.setFieldValue("email", iniper.email);
      formik.setFieldValue("age", iniper.age);
      formik.setFieldValue("state", inicialPersona.state);
      
      if (inicialPersona.id==="new" ){
          if (ciudadData.length>0){
            console.log("caerga primer ciudad");
            return setValuesciudad(ciudadData[0].nombre);
          }
      }
      //carga para modificar
      setValuesciudad(inicialPersona.state);
    }
    cargaValores(inicialPersona);

  }, [open]);


  return (
    <>
  
      <Dialog open={open}>

        <DialogTitle textAlign="center">  Create New Account</DialogTitle>
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
              id="firstName"
              name="firstName"
              label="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName&& formik.errors.firstName}
            />
            
            <TextField
              fullWidth
              id="lastName"
              name="lastName"
              label="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
            
            <TextField
              fullWidth
              id="email"
              name="email"
              label="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            
            <TextField
              fullWidth
              id="age"
              name="age"
              label="age"
              value={formik.values.age}
              onChange={formik.handleChange}
              error={formik.touched.age && Boolean(formik.errors.age)}
              helperText={formik.touched.age && formik.errors.age}
            />
            {/*
            <TextField
              fullWidth
              id="state"
              name="state"
              label="state"
             
              value={formik.values.state}
              onChange={formik.handleChange}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
            />
            
            <TextField
                  id="standard-select-currency"
                  select
                  label="Select"
                  name="state"
                  
                  value={valuesciudad.nombre}

                  onChange={handleChange}
                 
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}

                  SelectProps={{
                    MenuProps: {
                      //className: classes.menu
                    },
                    //renderValue: option => option.nameState
                    renderValue: option => option.nombre
                  }}
                 
                  margin="normal"
                >  
       
                    {ciudadData.map(option => (
                    <MenuItem key={option.id} value={option}>
                      {option.nombre}
                    </MenuItem>
                  ))}
              </TextField>
               */}

              <InputLabel id="demo-simple-select-label">Ciudad</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue={valuesciudad}
                value={valuesciudad || ''}
                label="ciudad"
                onChange={handleChange}
              >
                   {ciudadData.map(ciudad => (
                    <MenuItem key={ciudad.id} value={ciudad.nombre}>
                      {ciudad.nombre}
                    </MenuItem>
                  ))}
                {/* 
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            */}

              </Select>
            </Stack>

            <DialogActions sx={{ p: '1.25rem' }}>
              <Button color="secondary" onClick={onClose}>Cancel</Button>
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

/*

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateAge = (age) => age >= 18 && age <= 50;
*/
export default CrudAxiosh;
