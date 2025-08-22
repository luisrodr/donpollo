
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';




import DialogActions from '@mui/material/DialogActions';




import Select from '@mui/material/Select';


import {
    Button,
    Dialog,
    Grid,
    TextField,
  } from '@mui/material';
  



const listaIla= [
   { descripcion: 'vino1', tasa: 10 },
   { descripcion: 'vino2',   tasa: 10.5 },
   { descripcion: 'vino3', tasa: 10.6 },
   { descripcion: 'vino4',tasa: 10.7 },
   { descripcion: 'vino5', tasa: 10.8 },
 ];


export const DialogIlaModalEncabezado=(
       openDialogDetalleIla,
       setOpenDialogDetalleIla,
        valorDialogoTasaIla,
        handleChangeMultiple,
        valorDialogoIla,

        handleChangeDialogValorIla,
    
     )=>{

        const handleCloseDialogIla=()=>{
            setOpenDialogDetalleIla(false);
            //setValueIla(valorDialogoIla);
            //setValueTasaIla(valorDialogoTasaIla);
            //setValueTasaIlaLabel(`Ila %${valorDialogoTasaIla}`);
        };
        return (
    
            <Dialog
                open={openDialogDetalleIla}
                onClose={handleCloseDialogIla}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">
                    {"Herramienta % Ila"}
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText id="alert-dialog-description">
                    Seleccione afecto Impuesto Ila 
                    </DialogContentText>
                    
                    <br></br>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 8, sm: 6, md: 1 }}>
                    
                        <Grid item xs={8}>

                            <Select
                                multiple
                                native
                                value={valorDialogoTasaIla}
                                onChange={handleChangeMultiple}
                                inputProps={{
                                id: 'select-multiple-native',
                                }}
                            >
                                {listaIla.map((name) => (
                                <option key={name.descripcion} value={name}>
                                    {name.descripcion}
                                </option>
                                ))}

                            
                            </Select>
                        </Grid>      
                        <Grid item xs={4}>
                                tasa % {valorDialogoTasaIla}
                        </Grid>      

                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="valorDialogoIla"
                            name="valorDialogoIla"
                            label="valor ILA"
                            type="number"
                            fullWidth
                            value={valorDialogoIla}
                            variant="standard"
                            onChange={handleChangeDialogValorIla} 
                            />
                        </Grid>
                    </DialogContent>
                <DialogActions>
                    <Button  color="primary"  onClick={handleCloseDialogIla} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

        );

};

export default DialogIlaModalEncabezado;



