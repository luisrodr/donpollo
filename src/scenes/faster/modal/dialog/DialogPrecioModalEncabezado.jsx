
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';




import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import DialogActions from '@mui/material/DialogActions';

import {
    Button,
    Dialog,
    TextField,
  } from '@mui/material';
  

  const optionsPrecio = [

    'Precio',
    'Total'
  
  ];
export const DialogPrecioModalEncabezado=(
        openDialogDetallePrecio,
        handleCloseDialogPrecio,
        radioGroupRef,
        valueDialogPrecio,
        handleChangeDialogPrecio,
        valorDialogoPrecio,
        handleChangeDialogValorPrecioTotal,


     )=>{

        return (
            <Dialog
                open={openDialogDetallePrecio}
                onClose={ handleCloseDialogPrecio}
                
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">
              {"Herramienta calculo precio"}
            </DialogTitle>
            <DialogContent dividers>
              <DialogContentText id="alert-dialog-description">
                Determina si el precio es basado por: (Total o Precio)
              </DialogContentText>
              
              <RadioGroup
                ref={radioGroupRef}
                aria-label="ringtone"
                name="ringtone"
                value={valueDialogPrecio}
                onChange={handleChangeDialogPrecio}
              >
                {optionsPrecio.map((option) => (
                  <FormControlLabel
                    value={option}
                    key={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
            </RadioGroup>
            <TextField
              autoFocus
              required
              margin="dense"
              id="valorDialogoPrecio"
              name="valorDialogoPrecio"
              label="valor"
              type="number"
              fullWidth
              value={valorDialogoPrecio}
              variant="standard"
              onChange={handleChangeDialogValorPrecioTotal} 
            />
            </DialogContent>
            <DialogActions>

              <Button  color="primary"  onClick={handleCloseDialogPrecio} autoFocus>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        );

};

export default DialogPrecioModalEncabezado;


// {/* <DialogPrecioModalEncabezado
// openDialogDetallePrecio= {openDialogDetallePrecio}
// handleCloseDialogPrecio= {handleCloseDialogPrecio}
// radioGroupRef= {radioGroupRef}
// valueDialogPrecio= {valueDialogPrecio}
// handleChangeDialogPrecio= {handleChangeDialogPrecio}
// valorDialogoPrecio= {valorDialogoPrecio}
// handleChangeDialogValorPrecioTotal= {handleChangeDialogValorPrecioTotal}

// /> */}
