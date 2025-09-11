import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { isIPv4 } from 'is-ip';
import { onlyNumbers } from '../helpers/funcYup';

yup.addMethod(yup.string, "solonum", function (errorMessage) {
  return this.test(`test-codigo solo num`, errorMessage, function (value) {
    const { path, createError } = this;
    return (value && onlyNumbers(value)) || createError({ path, message: errorMessage });
  });
});

yup.addMethod(yup.string, "esip", function (errorMessage) {
  return this.test(`test-codigo esip`, errorMessage, function (value) {
    const { path, createError } = this;
    return (value && isIPv4(value)) || createError({ path, message: errorMessage });
  });
});

export const ModalIp = ({
  open,
  onClose,
  onSubmit,
  onEdit,
  lugarData,
  inicial,
  tableData,
  titulomod,
}) => {
  const [errorPrueba, setErrorPrueba] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [valuesLugar, setValuesLugar] = useState("");
  const [valuesIpInicial, setValuesIpInicial] = useState("");

  //const noExisteIp = (ipBuscar) => !tableData.find((el) => String(el.ip) === ipBuscar);
  const noExisteIp = (ipBuscar) => {
    if (!Array.isArray(tableData)) return true; // si no hay datos, consideramos que la IP no existe
    return !tableData.find((el) => String(el.ip) === ipBuscar);
  };

  const checkoutSchema = yup.object().shape({
    nombre: yup.string().required("Nombre requerido"),
    equipo: yup.string().required("Equipo requerido"),
    detalle: yup.string().required("Detalle requerido"),
    lugar: yup.string().required("Lugar requerido"),
    ip: yup.string().esip("Debe ser IP válida").required("IP requerida"),
  });

  const formik = useFormik({
    initialValues: inicial,
    validationSchema: checkoutSchema,
    onSubmit: (values) => {
      if (values.id === "new") {
        // if (!noExisteIp(values.ip)) {
        //   setErrorPrueba(true);
        //   setErrorText("Nueva IP ya existe!");
        //   return;
        // }
        onSubmit(values);
      } else {
        // if (valuesIpInicial !== values.ip && !noExisteIp(values.ip)) {
        //   setErrorPrueba(true);
        //   setErrorText("IP ya existe!");
        //   return;
        // }
        onEdit(values);
      }
      formik.resetForm();
      onClose();
    },
  });

  const handleChangeLugar = (name) => (event) => {
    const vNombre = event.target.value;
    setValuesLugar(vNombre);
    formik.setFieldValue("lugar", vNombre);
  };

  useEffect(() => {
    console.log("los datos ",tableData);
    if (!inicial) return;
    formik.setValues({
      id: inicial.id || "new",
      nombre: inicial.nombre || "",
      equipo: inicial.equipo || "",
      ip: inicial.ip || "",
      detalle: inicial.detalle || "",
      lugar: inicial.lugar?.descripcion || "",
    });
    setValuesLugar(inicial.lugar?.descripcion || "");
    setValuesIpInicial(inicial.ip || "");
    setErrorPrueba(false);
  }, [open, inicial]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle textAlign="center">
        <Typography variant="h6">{titulomod}</Typography>
        {errorPrueba && (
          <Alert
            onClose={() => setErrorPrueba(false)}
            variant="outlined"
            severity="error"
            sx={{ mt: 2 }}
          >
            {errorText}
          </Alert>
        )}
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Nombre */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="nombre"
                name="nombre"
                label="Nombre"
                margin="dense"
                autoComplete="off"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
              />
            </Grid>

            {/* Equipo */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="equipo"
                name="equipo"
                label="Equipo"
                margin="dense"
                autoComplete="off"
                value={formik.values.equipo}
                onChange={formik.handleChange}
                error={formik.touched.equipo && Boolean(formik.errors.equipo)}
                helperText={formik.touched.equipo && formik.errors.equipo}
              />
            </Grid>

            {/* IP */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="ip"
                name="ip"
                label="IP"
                margin="dense"
                autoComplete="off"
                value={formik.values.ip}
                onChange={formik.handleChange}
                error={formik.touched.ip && Boolean(formik.errors.ip)}
                helperText={formik.touched.ip && formik.errors.ip}
              />
            </Grid>

            {/* Detalle */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="detalle"
                name="detalle"
                label="Detalle"
                margin="dense"
                autoComplete="off"
                value={formik.values.detalle}
                onChange={formik.handleChange}
                error={formik.touched.detalle && Boolean(formik.errors.detalle)}
                helperText={formik.touched.detalle && formik.errors.detalle}
              />
            </Grid>

            {/* Lugar */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="lugar"
                name="lugar"
                label="Lugar"
                select
                margin="dense"
                value={valuesLugar}
                onChange={handleChangeLugar("ciudad")}
                error={formik.touched.lugar && Boolean(formik.errors.lugar)}
                helperText={formik.touched.lugar && formik.errors.lugar}
                sx={{ minWidth: 250 }}   // 👈 fuerza ancho mínimo
              >
                {lugarData.map((option) => (
                  <MenuItem key={option.id} value={option.descripcion}>
                    {option.descripcion}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <DialogActions sx={{ pt: 3 }}>
            <Button color="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalIp;
