import { useCallback, useMemo,useState ,useEffect,useContext} from 'react';
import { AuthContext } from "../../../mycontext/AuthContext";
import {v1 as uuidv1} from 'uuid';
import axios from "axios";

import Swal from "sweetalert2";  
import MaterialReactTable ,
{ MRT_FullScreenToggleButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton, } from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';


import { useFormik } from 'formik'
import * as yup from 'yup'
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    ShoppingCartCheckoutRounded,
    Stack,
    TextField,
    Typography,

    Tooltip,   
  
  } from '@mui/material';
  import InputAdornment from '@mui/material/InputAdornment';    
  import Autocomplete from '@mui/material/Autocomplete';
  //import Snackbar from '@mui/material/Snackbar';
  import { Delete, Edit,Add } from '@mui/icons-material';
  //import { inicialCentroProduccion} from '../../data/makeDataCrud';
  import CloudDownload from "@mui/icons-material/CloudDownload";
  import Print from "@mui/icons-material/Print";
  //import jsPDF from 'jspdf';
  //import autoTable from 'jspdf-autotable';
  //import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
  import {  ActionIcon } from '@mantine/core';
  
  import { onlyNumbers } from '../helpers/funcYup';
  import {esUnicoYup,existeCodigoYup} from '../helpers/funcYup';

  yup.addMethod(yup.string, "solonum", function (errorMessage) {
    return this.test(`test-codigo solo num`, errorMessage, function (value) {
      const { path, createError } = this;
  
      return (
        (value && onlyNumbers(value)) ||
        createError({ path, message: errorMessage })
      );
    });
  });



  
  const URL_BASE=process.env.REACT_APP_URL_BASE;
  const API_SEL=process.env.REACT_APP_API_SEL_OPC;
  const API_INS=process.env.REACT_APP_API_INS_OPC;
  const API_UPD=process.env.REACT_APP_API_UPD_OPC;
  const API_DEL=process.env.REACT_APP_API_DEL_OPC;



  export const ModalCentroProduccion=({ 
    open, 
    onClose, 
    onSubmit,
    onEdit,
    impresoraData,
    bodegaData,
    inicial,
    tableData,
    titulomod,
    deshabilitado}) => {

    const {user} = useContext(AuthContext);
    //const { token } = user;    
    const [ swViewImpresora,setSwViewImpresora]=useState(false);  
    const [errorPrueba, setErrorPrueba] = useState(false);
    const [errorText,setErrorText] = useState("");
    const [valuesimpresora, setValuesImpresora] = useState("");  
    const [valuesbodega, setValuesBodega] = useState("");  
    const [initValues] = useState(inicial);
    //const [rowData, setRowData] = useState([]);
    const [rowDataImpresora, setRowDataImpresora] = useState([]);

    const [valueIdyup,setValueIdyup] = useState('');  

    const [valueImp,setValueImp] = useState(''); 
    const [valueInputImp,setValueInputImp] = useState([]);  

    yup.addMethod(yup.string, "newexiste", function (errorMessage) {
      
      return this.test(`test-codigo existe`, errorMessage, function (value) {
        const { path, createError } = this;

            return (
              
                (value && !existeCodigoYup(value,valueIdyup,tableData)) || createError({ path, message: errorMessage })
          
            );
      
      });
    
  });    

  yup.addMethod(yup.string, "modexiste", function (errorMessage) {

      return this.test(`test-codigo existe`, errorMessage, function (value) {
        const { path, createError } = this;
      
        
          return (
            (value && !esUnicoYup(tableData,value,valueIdyup.id)) ||
            createError({ path, message: errorMessage })
          );
        
      });
  
  }); 


    const checkoutSchema = yup.object().shape({
      codigo: yup.string()
      .solonum("solo numeros")
      .required("required").length(2)
      .newexiste("New ya existe" ).modexiste("Mod ya existe"),
      descripcion:yup.string("required").required("is required"),
      //impresora: yup.string("required").required("is required"),
      bodega: yup.string("required").required("is required"),
  
     });


    const formik = useFormik({
      
      initialValues:initValues,
      validationSchema: checkoutSchema ,
      onSubmit: async (values) => {
        
        //actualiza las impresoras
        values.centroproimps=rowDataImpresora;


        if (values.id==="new" ){
           
            onSubmit(values);
            onClose();
            /////////////// 
           
        }else{

            //////////////submit 
            console.log("formik edit============>"); 
            console.log(values); 
            onEdit(values);
            onClose();
            
            /////////////// 

        }

        formik.resetForm();
 
      },
    });

    const handleChangeImpresora =  event => {
 
      const vnombre=event.target.value;
      //console.log(vnombre);
      console.log(event);
      setValuesImpresora(vnombre);
      
      formik.setFieldValue("impresora", vnombre);
      
    };

    const handleChangeBodega =  event => {


      const vnombre=event.target.value;
      //console.log(vnombre);
      console.log(event);
      setValuesBodega(vnombre);
      
      formik.setFieldValue("bodega", vnombre);
      
    };

    const handleCodigoChange = (event) => {
      formik.handleChange(event);

      console.log(event.target.value);
      
      if(valueIdyup.id === "new"){
           console.log("validando");

          if (event.target.value.length === 2 && existeCodigoYup(event.target.value,valueIdyup,tableData)){
            setErrorPrueba(true);
            setErrorText(`Ya existe ${event.target.value}`);
          }else{
            setErrorPrueba(false);
            
          }
         
      }

    };

    const handleDeleteRow = useCallback(

      (row) => {
      
        console.log("id a borrar: ",row.getValue('id'));

        rowDataImpresora.splice(row.index, 1);
       
        setRowDataImpresora([... rowDataImpresora]);

      },
      [rowDataImpresora],
    );

    const handleSaveMov = () => {


       
      if (valueInputImp){
        //console.log("a grabar valueInputImp",valueInputImp);
      
        const nuevo={id:uuidv1(),impresora:{id:valueInputImp.id,descripcion:valueInputImp.descripcion},centroporduccion:inicial.id}  
          
        if (!impresoraExiste(rowDataImpresora,valueInputImp.id)){

          rowDataImpresora.push(nuevo);
          setRowDataImpresora([... rowDataImpresora]);
    
          console.log("movimiento agregado...");
          setValueInputImp(null);
        };    

      };

    };

    const  impresoraExiste=(tableData, searchElement) =>{
      for (let elements of tableData) {
       
          if (elements.impresora.id === searchElement) {
              return true;
          }  
      }
      return false;
    };

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
          accessorKey: 'impresora.descripcion',
          header: 'impresora',
          size: 140,
          enableGlobalFilter: false,

        },
        
        
      ],
      [],
    );
    
    
    useEffect(() => {
      console.log("Valores iniciales =====>",inicial);
  
      formik.setFieldValue("id", inicial.id);

      formik.setFieldValue("codigo", inicial.codigo);
      formik.setFieldValue("descripcion", inicial.descripcion);
      //formik.setFieldValue("impresora",inicial.impresora.descripcion);
      formik.setFieldValue("bodega",inicial.bodega.descripcion);

     // setValuesImpresora(inicial.impresora.descripcion);
      setValuesBodega(inicial.bodega.descripcion);
      
      //if not null
      if (inicial.centroproimps){
        setRowDataImpresora([...inicial.centroproimps]);
      }
      setValueInputImp(null);
     
      setErrorPrueba(false);

      setValueIdyup(inicial); 
    
    }, [open]);// eslint-disable-line react-hooks/exhaustive-deps
   
    return (
      <>
        
        <Dialog open={open} maxWidth="md" >
          
          <DialogTitle textAlign="center" > 
         
                 <div style={{ display: 'flex' }}>
                    <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                         {titulomod}
                    </Typography>

                </div>
        
                {  errorPrueba   &&
                  <Alert onClose={() => setErrorPrueba(false)} variant="outlined" severity="error">
                      {errorText} alerta — revisar!
                  </Alert>
                }  
          </DialogTitle>
           <DialogContent dividers >
            <form onSubmit={formik.handleSubmit}>
                      <Stack
                      sx={{
                        width: '100%',
                        minWidth: { xs: '300px', sm: '360px', md: '400px' },
                        gap: '1.5rem',
                      }}
                    >
                      <TextField
                        disabled={deshabilitado}
                        fullWidth
                        margin="normal" 
                        id="codigo"
                        name="codigo"
                        label="codigo"
                        autoComplete='off'
                        value={formik.values.codigo}
                        onChange={handleCodigoChange}
                        error={formik.touched.codigo && Boolean(formik.errors.codigo)}
                        helperText={formik.touched.codigo&& formik.errors.codigo}
                      />
                      <TextField
                        fullWidth
                        margin="normal" 
                        id="descripcion"
                        name="descripcion"
                        label="descripcion"
                        autoComplete='off'
                        value={formik.values.descripcion}
                        onChange={formik.handleChange}
                        error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                        helperText={formik.touched.descripcion && formik.errors.descripcion}
                      />
                  
                      {swViewImpresora  &&
                      <TextField
                        fullWidth
                        margin="normal" 
                        id="impresora"
                        select
                        name="impresora"
                        label="impresora"
                       
                        value={valuesimpresora}
                        onChange={handleChangeImpresora}
                        error={formik.touched.impresora && Boolean(formik.errors.impresora)}
                        helperText={formik.touched.impresora && formik.errors.impresora}
                        
                      >
                        {impresoraData.map(option => (
                          <MenuItem key={option.id} value={option.descripcion}>
                              {option.descripcion}
                          </MenuItem>
                        ))}
                      </TextField>
                       }

                      <TextField
                        fullWidth
                        margin="normal" 
                        id="bodega"
                        select
                        name="bodega"
                        label="bodega"
                        value={valuesbodega}
                        onChange={handleChangeBodega}
                        error={formik.touched.bodega && Boolean(formik.errors.bodega)}
                        helperText={formik.touched.bodega  && formik.errors.bodega}
                        
                      >
                        {bodegaData.map(option => (
                          <MenuItem key={option.id} value={option.descripcion}>
                              {option.descripcion}
                          </MenuItem>
                        ))}
                      </TextField>
                      
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
                        
                          initialState={{ 
                            
                            columnVisibility: {   id: false ,
                                              }
                                       }} //id no visible
                          data={rowDataImpresora}
                          enablePagination={false}
                          localization={MRT_Localization_ES}
                          enableTopToolbar={true} //hide top toolbar
                          enableBottomToolbar={false} //hide bottom toolbar
                          //enableTopToolbarInternalActions={false} //hide top toolbar                          
                          enableGlobalFilter={false}// la lupa
                        
                          //enableGlobalFilterModes={false}
                          enableDensityToggle={false}
                          enableFullScreenToggle={false}
                          enableHiding={false}
                         
                          
                          editingMode="modal" //default
                          enableColumnOrdering={false}
                          enableColumnFilters={false}
                          enableColumnActions={false}
                          enableEditing
                          state={{
                           // isLoading,
                           // showProgressBars: isRefetching
                          }}      
                          renderRowActions={({ row, table }) => (
                            <Box sx={{ display: 'flex', gap: '1rem' }}>
                               
                              <Tooltip arrow placement="right" title="Delete">
                                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                          renderTopToolbarCustomActions={() => 
                            
                            
                            (

                            <>
                             <Stack spacing={1} sx={{ width: 200 }}>
                                  <Autocomplete
                                      options= {impresoraData}
                                      getOptionLabel={ (option) => option.descripcion}
                                      id="impresoramov"
                                      clearOnEscape
                                      value={valueInputImp}
                                      onChange={(event, newValue) => {
                                        console.log("setValueImp",newValue);
                                        if (newValue){
                                          setValueInputImp(newValue);
                                        }else{
                                          setValueInputImp(null);
                                        }
                                      }}


                                      inputValue={valueImp}
                                      onInputChange={(event, newInputValue) => {
                                        console.log(newInputValue);
                                        setValueImp(newInputValue);

                                      }}
                                    
                                      renderInput={(params) => (
                                        <TextField
                                        {...params} 
                                        label="Impresora" 
                                        variant="standard" />
                                      )}
                                  />
                              </Stack>
                              <Button
                                color="secondary"
                                onClick={ handleSaveMov } 
                                variant="contained"
                              >
                                  <Add/>
                              </Button>

                            </>
                          )
                        }
                       />

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
  
  
  export default ModalCentroProduccion;
  