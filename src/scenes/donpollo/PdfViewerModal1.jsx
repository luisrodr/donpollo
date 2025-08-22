import React, { useState ,useEffect} from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";




const PdfViewerModal1 = ({ open,setOpen, onClose, pdfUrl }) => {
 
    const [pdfKey, setPdfKey] = useState(0);



    useEffect(() => {
      setPdfKey(prevKey => prevKey + 1); // Cambia la key al actualizarse el PDF
      if (open) {
        onClose(); // Cierra el diálogo temporalmente
        setTimeout(() => setOpen(true), 100); // Lo vuelve a abrir después de un breve retraso
      }
    }, [pdfUrl]);
    

  return (
      <Dialog
      key={pdfKey}
        open={open}
       // onClose={onClose}
        maxWidth={false} // Evita restricciones de Material-UI
        disablePortal
        sx={{
          "& .MuiDialog-paper": {
            width: "90vw",
            maxWidth: "90vw",
            height: "90vh",
          },
        }}
        //evita cerrar fuera de la x
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            onClose();
          }
        }}
      >
        <DialogTitle>
          PDF Viewer  {pdfUrl}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ height: "calc(100% - 64px)" }}>
            {pdfUrl? (
              <embed
                key={new Date().getTime()} // Esto fuerza el re-render
                src={pdfUrl}
                type="application/pdf"
                width="100%"
                height="100%"/>
              ) : (
                <p>Cargando PDF...</p>
              )}
          {/* <embed
            key={new Date().getTime()} // Esto fuerza el re-render
            src={pdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"


          /> */}


          {/* <iframe
            key={pdfUrl}
            src={pdfUrl}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          ></iframe> */}
        </DialogContent>
      </Dialog>

  );
};

export default PdfViewerModal1;
