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
import { Delete, Edit ,Add} from '@mui/icons-material';


import { states,inicialUser} from '../../data/makeDataCrud';

import { useFormik } from 'formik';
import * as yup from 'yup'


const CrudAxiosj = () => {

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
    //////////////////////////////////////////////////

    const handleCreateNewRow = (values) => {

      console.log("grabando-------");
      /*
      setIsLoading(true);
      setIsRefetching(true);
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

            setIsLoading(false);
            setIsRefetching(false);
           
        }).catch((error) => {

          console.log(error);
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });
      */

    };


    const handleEdit= async (values ) => {
        console.log("valores A MODIFICAR=====>>>>>");
        setIsLoading(true);
        setIsRefetching(true);
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

            setIsLoading(false);
            setIsRefetching(false);
 
        }).catch((error) => {

          console.log(error);
          setErrorPrueba(true)
          setErrorText(JSON.stringify(error))

        });
          
        setTableData([...tableData]);
   
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
        setIsLoading(true);
        setIsRefetching(true);

        axios
        .delete(`http://127.0.0.1:1337/api/crudpruebas/${row.getValue('id')}`)
 
        .then((response) => {
            console.log(response);
            tableData.splice(row.index, 1);
            setTableData([...tableData]);

            setIsLoading(false);
            setIsRefetching(false);
            
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
          accessorKey: 'ciudads',
          header: 'Ciudad',
          size: 80,

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
      
     
    useEffect(() => {
    const grabaCiudad=async()=>{
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
    };

      const cargaCiudad=async()=>{
    
        await axios
        .get("http://localhost:1337/api/ciudads")
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
       
         setIsLoading(true);
         setIsRefetching(true);
          await axios
          .get("http://localhost:1337/api/crudrels?populate=*")
          .then(({ data }) => {
            //console.log(data.data);
            let crudrel=[];
            


            data.data.map((valor) => {

                console.log("cargando para la table con relacion");

                
                 const  crudobj={...inicialUser, id:valor.id,
                  firstName: valor.firstName,
                  ciudads: valor.ciudads[0].nombre,
                  idCiudads:valor.ciudads[0].id};
               /*
                const crudobj={
                  id:valor.id,
                  firstName: valor.firstName,
                  ciudads: valor.ciudads[0].nombre,
                  idCiudads:valor.ciudads[0].id
                };
                */
                crudrel=[...crudrel,crudobj];

            });




            setInicialPersona(inicialUser);
            setTableData(crudrel);    
            cargaCiudad();
          

          }  )
          .catch((error) => {
            console.log("error")
            setErrorPrueba(true)
            setErrorText(JSON.stringify(error))
          
          });
           
        };
         
       
       cargaStrapi();
      

    }, []);
 /*   
    if (isLoading) {
      
      //return <div>Cargando...</div>;
      return <CircularProgress />;
      // { isLoading ?? <CircularProgress />}
    }  
     */
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
                setTitulo("Modifica resistro");
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
              setTitulo("Nuevo registro");
              setCreateModalOpen(true)}}
            variant="contained"
          >
           
             <Add/>
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
        titulo={titulo}
      />
     
    </>
  );
};

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
 
  ciudads: yup.string().required("required")
});



export const CreateNewAccountModal = ({ open, onClose, onSubmit,onEdit ,ciudadData,inicialPersona,titulo}) => {
  
  const [initValues] = useState(inicialPersona);
  const [valuesciudad, setValuesciudad] = useState({  });

  const formik = useFormik({
    
    initialValues:initValues,
    validationSchema: checkoutSchema ,
    onSubmit: (values) => {
      console.log("formik onsubmit============>");    
      if (values.id==="new" ){
          console.log("formik new============>"); 
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
     
    
  };



  useEffect(() => {

    const cargaValores=(iniper)=>{
      console.log("Valores iniciales =====>");
      formik.setFieldValue("id", iniper.id);
      formik.setFieldValue("firstName", iniper.firstName);

      formik.setFieldValue("ciudads", iniper.ciudads);
      
      if (inicialPersona.id==="new" ){
          if (ciudadData.length>0){
            console.log("caerga primer ciudad");
           
            return setValuesciudad(ciudadData[0].nombre);
          }
      }
      //carga para modificar
      setValuesciudad(iniper.ciudads);
    }
 
    cargaValores(inicialPersona);

  }, [open]);


  return (
    <>
  
      <Dialog open={open}>

        <DialogTitle textAlign="center">  {titulo}</DialogTitle>
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
              {/*
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

              </Select>
              */}
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


export default CrudAxiosj;
