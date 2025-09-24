import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControl, InputLabel, Select, MenuItem, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Swal from "sweetalert2";
import { ExportToCsv } from "export-to-csv";

export const DialogRedIp = ({ open, 
  onClose, 
  redData, 
  tableData,
  onConfirm ,
  setPagination,
  setGlobalFilter,
  disabledGuardar,
  setDisabledGuardar}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [dialogStep, setDialogStep] = useState("red"); // "red" | "ip"
  const [selectedOptionRed, setSelectedOptionRed] = useState("");
  const [ipsDisponibles, setIpsDisponibles] = useState([]);
  const [ipSeleccionada, setIpSeleccionada] = useState("");
 

  // 🔹 Generar IPs libres de la red seleccionada
  const obtenerIpsDisponibles = () => {
    let disponibles = [];
    for (let i = 2; i <= 254; i++) {
      const ip = selectedOptionRed + i;
      const existe = tableData.some((row) => row.ip.trim() === ip);
      if (!existe) disponibles.push(ip);
    }
    return disponibles;
  };

  const handleSaveRed = () => {
    if (selectedOptionRed) {
      const libres = obtenerIpsDisponibles();
      if (libres.length > 0) {
        setIpsDisponibles(libres);
        setIpSeleccionada("");
        setDialogStep("ip"); // pasa a elegir IP
      } else {
        Swal.fire("Error", "No hay IPs disponibles en esta red", "error");
      }
    }
  };

  const confirmarIp = () => {
     setGlobalFilter("");
     setPagination((prev) => ({ ...prev, pageIndex: 0, pageSize: 10 })); 
    if (ipSeleccionada) {
      console.log("aceptar confirmada ",{ipSeleccionada})
      console.log("onConfirm",{onConfirm})
      if (onConfirm) {
         onConfirm(ipSeleccionada);
      };
      handleClose();
    }
  };

  const handleClose = () => {
    setGlobalFilter("");
    setPagination((prev) => ({ ...prev, pageIndex: 0, pageSize: 10 })); 
    setDialogStep("red");
    setSelectedOptionRed("");
    setIpsDisponibles([]);
    setIpSeleccionada("");
    setDisabledGuardar(true);
    onClose();
  };

  // Exportar IPs libres
  const csvExporterLibre = new ExportToCsv({
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    headers: ["ip"],
  });

  const handleExportDataLibre = () => {
    const dataCsvLibre = ipsDisponibles.map((ip) => ({ ip }));
    csvExporterLibre.generateCsv(dataCsvLibre);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
      {dialogStep === "red" && (
        <>
          <DialogTitle>Selecciona una red</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Opciones de red</InputLabel>
              <Select
                value={selectedOptionRed}
                onChange={(e) => {
                 

                  setPagination((prev) => ({ ...prev, pageIndex: 0, pageSize: 255 }));
                  setGlobalFilter(e.target.value);
                  setSelectedOptionRed(e.target.value);

                }}
              >
                {redData.map((op, index) => (
                  <MenuItem key={index} value={op.red}>
                    {op.red}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">Cancelar</Button>
            <Button
              disabled={disabledGuardar}
              onClick={handleSaveRed}
              color="success"
              variant="contained"
            >
              Aceptar
            </Button>
          </DialogActions>
        </>
      )}

      {dialogStep === "ip" && (
        <>
          <DialogTitle>Selecciona una IP disponible {selectedOptionRed}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>IPs libres</InputLabel>
              <Select
                value={ipSeleccionada}
                onChange={(e) => 
                  
                  {
                    setIpSeleccionada(e.target.value);
                    console.log("ipseleccionada====>", e.target.value);


                }}
              >
                {ipsDisponibles.map((ip, index) => (
                  <MenuItem key={index} value={ip}>
                    {ip}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleExportDataLibre} color="error">
              Exportar
            </Button>
            <Button onClick={handleClose} color="error">
              Cancelar
            </Button>
            <Button
              disabled={!ipSeleccionada}
              onClick={confirmarIp}
              color="success"
              variant="contained"
            >
              Aceptar
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};


export default DialogRedIp;
