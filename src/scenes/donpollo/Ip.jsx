



import React, { useCallback, useMemo, useState, useEffect, useContext } from 'react';
import axios from "axios";
import Swal from "sweetalert2"; 
import MaterialReactTable from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { 
  Alert, Box, Button, IconButton, Tooltip, useTheme, Snackbar,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Typography, useMediaQuery
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import CloudDownload from "@mui/icons-material/CloudDownload";
import Print from "@mui/icons-material/Print";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportToCsv } from 'export-to-csv';
import { AuthContext } from "../../mycontext";
import Header from "../../components/Header";
import { ModalIp } from './modal/ModalIp';
import { inicialIp } from '../../data/makeDataCrud';

const URL_BASE = process.env.REACT_APP_URL_BASE;
const API_SEL_RED = process.env.REACT_APP_API_SEL_RED;
const API_SEL_LUG = process.env.REACT_APP_API_SEL_LUG;
const API_SEL = process.env.REACT_APP_API_SEL_IPE;
const API_INS = process.env.REACT_APP_API_INS_IPE;
const API_UPD = process.env.REACT_APP_API_UPD_IPE;
const API_DEL = process.env.REACT_APP_API_DEL_IPE;

const Ip = () => {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const { token } = user;
  const isMobile = useMediaQuery('(max-width:600px)');
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [tableData, setTableData] = useState([]);
  const [lugarData, setLugarData] = useState([]);
  const [redData, setRedData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [inicial, setInicial] = useState(inicialIp);
  const [deshabilitado, setDeshabilitado] = useState(false);
  const [titulomod, setTitulomod] = useState('');
  const [title] = useState('Gestión de IPs');
  const [subTitle] = useState('Lista de IPs');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [total, setTotal] = useState(0);
  const [disabledGuardar, setDisabledGuardar] = useState(true);

  // diálogo selección de red
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  // diálogo selección de IP disponible
  const [openDialogIps, setOpenDialogIps] = useState(false);
  const [ipsDisponibles, setIpsDisponibles] = useState([]);
  const [ipSeleccionada, setIpSeleccionada] = useState("");

  // const opciones = [
  //   { value: "192.68.32.", label: "192.68.32" },
  //   { value: "192.168.50.", label: "192.168.50" },
  // ];

  const handleClickOpen = () => setOpenDialog(true);

  const handleClose = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0, pageSize: 10 })); 
    setOpenDialog(false);
    setGlobalFilter("");
  };

  // 🔹 Buscar TODAS las IPs disponibles
  const obtenerIpsDisponibles = () => {
    let disponibles = [];
    for (let i = 2; i <= 254; i++) {
      const ip = selectedOption + i;
      const existe = tableData.some((row) => row.ip === ip);
      if (!existe) disponibles.push(ip);
    }
    return disponibles;
  };

  const handleSave = () => {
    setGlobalFilter("");
    setPagination((prev) => ({ ...prev, pageIndex: 0, pageSize: 10 }));
    if (selectedOption) {
      const libres = obtenerIpsDisponibles();
      if (libres.length > 0) {
        setIpsDisponibles(libres);
        setIpSeleccionada("");
        setOpenDialogIps(true);
      } else {
        Swal.fire("Error", "No hay IPs disponibles en esta red", "error");
      }
    }
  };

  const confirmarIp = () => {
    inicialIp.ip = ipSeleccionada || inicialIp.ip;
    setOpenDialogIps(false);
    levantaModal();
  };

  const levantaModal = () => {
    setOpenDialog(false);
    setDeshabilitado(false);
    setInicial(inicialIp);
    setTitulomod('Nuevo registro');
    setCreateModalOpen(true);     
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'id', size: 80, enableEditing: false, enableSorting: false },
      { accessorKey: 'nombre', header: 'nombre', size: 140 },
      { accessorKey: 'equipo', header: 'equipo', size: 140 },
      { accessorKey: 'ip', header: 'ip', size: 140 },
      { accessorKey: 'detalle', header: 'detalle', size: 140 },
      { accessorKey: 'lugar.descripcion', header: 'lugar', size: 140 },
    ],
    [],
  );

  const iconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
  const handleCloseSnack = () => setOpenSnack(false);

  const fetchLugar = useCallback(async () => {
    try {
      const { data } = await axios.get(`${URL_BASE}${API_SEL_LUG}`, { headers: { Authorization: `Bearer ${token}` } });
      setLugarData(data.data);
    } catch (err) {
      setError(err.message || 'Error al cargar lugares');
    }
  }, [token]);

  const fetchRed = useCallback(async () => {

    //console.log("ejecurando red......");
    try {
      const { data } = await axios.get(`${URL_BASE}${API_SEL_RED}`, { headers: { Authorization: `Bearer ${token}` } });
      console.log("la red",data.data)
      setRedData(data.data);
    
    } catch (err) {
      setError(err.message || 'Error al cargar redes');
    }
  }, [token]);

  const fetchData = useCallback(async () => {
    console.log("ejecutando data general");

    setIsLoading(true);
    try {
      const { pageIndex, pageSize } = pagination;
      const sort = sorting[0] ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}` : '';
      const filterQuery = globalFilter
        ? `&filters[$or][0][id][$containsi]=${encodeURIComponent(globalFilter)}&filters[$or][1][nombre][$containsi]=${encodeURIComponent(globalFilter)}&filters[$or][2][equipo][$containsi]=${encodeURIComponent(globalFilter)}&filters[$or][3][ip][$containsi]=${encodeURIComponent(globalFilter)}&filters[$or][4][detalle][$containsi]=${encodeURIComponent(globalFilter)}`
        : '';
      const columnFilterQuery = columnFilters.length
        ? '&' + columnFilters.map(f => {
            const field = f.id.includes('.') ? f.id.split('.').join('][') : f.id;
            return !isNaN(f.value)
              ? `filters[${field}][$eq]=${f.value}`
              : `filters[${field}][$contains]=${encodeURIComponent(f.value)}`;
          }).join('&')
        : '';
      const url = `${URL_BASE}${API_SEL}?pagination[page]=${pageIndex + 1}&pagination[pageSize]=${pageSize}${sort ? `&sort=${sort}` : ''}&populate=lugar&fields[0]=id&fields[1]=nombre&fields[2]=equipo&fields[3]=ip&fields[4]=detalle${filterQuery}${columnFilterQuery}`;
      const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setTableData([...data.data]);
      setTotal(data.meta.pagination.total);
      if (!lugarData.length) await fetchLugar();
      setDisabledGuardar(false); 
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, [pagination, sorting, globalFilter, columnFilters, token, lugarData.length, fetchLugar]);

  useEffect(() => { fetchData(); fetchRed();}, [fetchData]);

  const handleCreateOrEdit = async (values, isEdit = false) => {
    setIsLoading(true);
    try {
      const lugarSeleccionado = lugarData.find(el => el.descripcion === values.lugar);
      const payload = {
        nombre: values.nombre,
        equipo: values.equipo,
        ip: values.ip,
        detalle: values.detalle,
        lugar: lugarSeleccionado.id
      };
      if (isEdit) {
        await axios.put(`${URL_BASE}${API_UPD}${rowData.getValue('id')}`, { data: payload }, { headers: { Authorization: `Bearer ${token}` } });
        const newData = [...tableData];
        newData[rowData.index] = { ...values, lugar: lugarSeleccionado };
        setTableData(newData);
        setMessage(`Modificado ${values.id}`);
      } else {
        const response = await axios.post(`${URL_BASE}${API_INS}`, { data: payload }, { headers: { Authorization: `Bearer ${token}` } });
        const nuevoRegistro = { ...values, id: response.data.data.id, lugar: lugarSeleccionado };
        setTableData(prev => [...prev, nuevoRegistro]);
        setMessage(`Agregado ${nuevoRegistro.id}`);
      }
      setOpenSnack(true);
    } catch (err) {
      if (err.response?.data?.error?.message) {
        Swal.fire('Error', err.response.data.error.message, 'error')
          .then(() => { levantaModal(); });
      } else {
        Swal.fire('Error', 'No se pudo crear el registro', 'error');
      }
    } finally {
      setIsLoading(false);
      setCreateModalOpen(false);
    }
  };

  const handleDeleteRow = useCallback((row) => {
    Swal.fire({
      title: '¿Seguro que quiere borrar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then(async res => {
      setCreateModalOpen(false);
      if (res.isConfirmed) {
        setIsLoading(true);
        try {
          await axios.delete(`${URL_BASE}${API_DEL}${row.getValue('id')}`, { headers: { Authorization: `Bearer ${token}` } });
          setTableData(prev => prev.filter((_, i) => i !== row.index));
          setMessage(`Eliminado ${row.getValue('id')}`);
          setOpenSnack(true);
        } catch (err) {
          setError(err.message || 'Error al eliminar registro');
        } finally {
          setIsLoading(false);
        }
      }
    });
  }, [token]);

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
    for(let i = 0; i < tableData.length; i++) { 
      const fila={id: tableData[i].id,
                  nombre: tableData[i].nombre,
                  equipo: tableData[i].equipo,
                  ip: tableData[i].ip,
                  detalle: tableData[i].detalle,
                  lugar: tableData[i].lugar.descripcion};
      dataCsv=[...dataCsv,fila];
    };
    csvExporter.generateCsv(dataCsv);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.text(title, 15, 10);
    autoTable(doc, {
      head: [columns.map(c => c.header)],
      body: tableData.map(r => [r.id, r.nombre, r.equipo, r.ip, r.detalle, r.lugar.descripcion])
    });
    doc.save('table.pdf');
  };

  return (
    <>
      {error && <Alert onClose={() => setError(null)} severity="error">{error}</Alert>}

      <Snackbar open={openSnack} autoHideDuration={3000} onClose={handleCloseSnack} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnack} severity="success" sx={{ width: '100%' }}>{message}</Alert>
      </Snackbar>

      <Box m={2}>
        <Header title={title} subtitle={subTitle} />
      </Box>

      <MaterialReactTable
        columns={columns}
        data={tableData}
        manualFiltering
        manualPagination
        manualSorting
        rowCount={total}
        state={{ columnFilters, globalFilter, pagination, sorting, isLoading }}
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        muiTablePaginationProps={{
          rowsPerPageOptions: [10, 25, 50, 100, 300],
          showFirstButton: true,
          showLastButton: true,
        }}
        // initialState={{
        //   density: 'compact',
        //   //density: isMobile ? 'compact' : 'comfortable',
        //   isFullScreen: isMobile,
        // }}
        initialState={{
                density: "compact",
                isFullScreen: isMobile,
                columnVisibility: isMobile
                  ? {
                      id: false,
                      equipo: false,
                      detalle: false,
                      "lugar.descripcion": false,
                    }
                  : {},
              }}        
        enableColumnOrdering
        enableEditing
        editingMode="modal"
        enableRowActions
        muiTablePaperProps={{ sx: { overflowX: 'auto' } }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Tooltip title="Editar">
              <IconButton sx={{ color: iconColor }} onClick={() => {
                setRowData(row);
                setInicial(row.original);
                setDeshabilitado(true);
                setTitulomod(`Modificar Id ${row.original.id}`);
                setCreateModalOpen(true);
              }}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}><Delete /></IconButton>
            </Tooltip>          
          </Box>
        )}
        renderTopToolbarCustomActions={({ table }) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            <Button variant="contained" color="success" startIcon={<Add />} onClick={handleClickOpen}>Agregar</Button>
            <IconButton sx={{ color: iconColor }} onClick={handleExportPdf}><Print /></IconButton>
            <IconButton sx={{ color: iconColor }} onClick={handleExportData}><CloudDownload /></IconButton>
          </Box>
        )}
        localization={MRT_Localization_ES}
      />

      <ModalIp
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={(values) => handleCreateOrEdit(values, false)}
        onEdit={(values) => handleCreateOrEdit(values, true)}
        lugarData={lugarData}
        inicial={inicial}
        titulomod={titulomod}
        deshabilitado={deshabilitado}
      />

      {/* Diálogo para elegir red */}
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
        <DialogTitle>Selecciona una red</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Opciones</InputLabel>
            <Select
              value={selectedOption}
              onChange={(e) => {
                setDisabledGuardar(true); 
                setPagination((prev) => ({ ...prev, pageIndex: 0, pageSize: 255 }));
                setGlobalFilter(e.target.value);
                setSelectedOption(e.target.value);
              }}
              label="Opciones"
            >
              {redData.map((op, index) => (
                <MenuItem key={index} value={op.red}>{op.red}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">Cancelar</Button>
          <Button disabled={disabledGuardar} onClick={handleSave} color="success" variant="contained">
            {disabledGuardar ? "Procesando..." : "Aceptar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para elegir IP libre */}
      <Dialog open={openDialogIps} onClose={() => setOpenDialogIps(false)} fullWidth maxWidth="sm">
        <DialogTitle>Selecciona una IP disponible</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>IPs libres</InputLabel>
            <Select
              value={ipSeleccionada}
              onChange={(e) => setIpSeleccionada(e.target.value)}
            >
              {ipsDisponibles.map((ip, index) => (
                <MenuItem key={index} value={ip}>{ip}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogIps(false)} color="error">Cancelar</Button>
          <Button disabled={!ipSeleccionada} onClick={confirmarIp} color="success" variant="contained">
            Aceptar
           </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Ip;


