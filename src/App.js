import { useState,useContext } from "react";

import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Downloads from "./scenes/downloads";

import Example from "./scenes/example/Example";
import Avanzado from "./scenes/example/Avanzado";
import Group from "./scenes/example/Group";
import ExportExample from "./scenes/example/ExportExample";
import Crud from "./scenes/example/Crud";
import Login from "./scenes/auth/login";


import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
// import Calendar from "./scenes/calendar/calendar";

import { AuthContext } from "./mycontext/AuthContext";

// import AxiosPost from "./scenes/example/AxiosPost";

// import CrudAxiosk from "./scenes/example/CrudAxiosk";

// import FamiliaProducto from "./scenes/faster/FamiliaProducto";
// import SubFamiliaProducto from "./scenes/faster/SubFamiliaProducto";
// import AgregadoSubFamiliaProducto from "./scenes/faster/AgregadoSubFamiliaProducto";
// import Zona from "./scenes/faster/Zona";
// import Sector from "./scenes/faster/Sector";
// import Bodega from "./scenes/faster/Bodega";
// import Departamento from "./scenes/faster/Departamento";
// import CentroConsumo from "./scenes/faster/CentroConsumo";
// import Opcion from "./scenes/faster/Opcion";
// import AccionTipoDescuento from "./scenes/faster/AccionTipoDescuento";
// import TipoProducto from "./scenes/faster/TipoProducto";
// import FamiliaArticulo from "./scenes/faster/FamiliaArticulo";
// import UploadBin from "./scenes/example/UploadBin";
// import SubFamiliaArticulo from "./scenes/faster/SubFamiliaArticulo";
// import EstadoMesa from "./scenes/faster/EstadoMesa";
// import Plaza from "./scenes/faster/Plaza";
// import Terminal from "./scenes/faster/Terminal";
// import CondicionPago from "./scenes/faster/CondicionPago";
// import Impresora from "./scenes/faster/Impresora";
// import Vendedor from "./scenes/faster/Vendedor";
// import TipoDescuento from "./scenes/faster/TipoDescuento";        
//import Descuento from "./scenes/faster/Descuento";

import Ip from "./scenes/donpollo/Ip";
import Facturas from "./scenes/donpollo/Facturas";
import CenteredLogo from "./scenes/donpollo/CenteredLogo";


// import Documento from "./scenes/faster/Documento";
// import Mesa from "./scenes/faster/Mesa";
// import ListaPrecio from "./scenes/faster/ListaPrecio";
// import CentroProduccion from "./scenes/faster/CentroProduccion";
// import ImpresoraDocumentoFolio from "./scenes/faster/ImpresoraDocumentoFolio";
// import ComunaSii from "./scenes/faster/ComunaSii";
// import Articulo from "./scenes/faster/Articulo";
// import Producto from "./scenes/faster/Producto";
// import Proveedor from "./scenes/faster/Proveedor";
// import Cliente from "./scenes/faster/Cliente";
// import EncabezadoDoc from "./scenes/faster/EncabezadoDoc";
// import TablaIla from "./scenes/faster/TablaIla";
// import Parametro from "./scenes/faster/Parametro";
// import ProcesoCierre from "./scenes/faster/proceso/ProcesoCierre";
// import Kardex from "./scenes/faster/informes/Kardex";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const {logged} = useContext(AuthContext);


//  console.log(isLogin);
  return (
     
      <ColorModeContext.Provider value={colorMode}>
        {logged?
        ( 
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                  <Route path="/" element={<CenteredLogo />} />
                  <Route path="/ip" element={<Ip />} />
                  <Route path="/facturas" element={<Facturas/>} />

                  {/* <Route path="/team" element={<Team />} />
                    <Route path="/" element={<Dashboard />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/form" element={<Form />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/line" element={<Line />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/geography" element={<Geography />} />
                  <Route path="/example" element={<Example/>} />
                  <Route path="/avanzado" element={<Avanzado/>} />
                  <Route path="/group" element={<Group/>} />
                  <Route path="/export" element={<ExportExample/>} />
                  <Route path="/crud" element={<Crud/>} />
                  <Route path="/downloads" element={<Downloads />} />
                 
                  <Route path="/axiospost" element={<AxiosPost/>} />
 
                  <Route path="/crudaxiosk" element={<CrudAxiosk/>} />
                 
                  <Route path="/familiaproducto" element={<FamiliaProducto/>} />
                  <Route path="/subfamiliaproducto" element={<SubFamiliaProducto/>} />    
                  <Route path="/agregadosubfamiliaproducto" element={<AgregadoSubFamiliaProducto/>} />
                  <Route path="/zona" element={<Zona/>} />
                  <Route path="/sector" element={<Sector/>} />
                  <Route path="/bodega" element={<Bodega/>} />
                  <Route path="/departamento" element={<Departamento/>} />
                  <Route path="/centroconsumo" element={<CentroConsumo/>} />
                  <Route path="/opcion" element={<Opcion/>} />
                  <Route path="/acciontipodescuento" element={<AccionTipoDescuento/>} />
                  <Route path="/tipoproducto" element={<TipoProducto/>} />
                  <Route path="/familiaarticulo" element={<FamiliaArticulo/>} />
                  <Route path="/subfamiliaarticulo" element={<SubFamiliaArticulo/>} />
                  <Route path="/uploadbin" element={<UploadBin/>} />
                  <Route path="/estadomesa" element={<EstadoMesa/>} />
                  <Route path="/plaza" element={<Plaza/>} />
                  <Route path="/terminal" element={<Terminal/>} />
                  <Route path="/condicionpago" element={<CondicionPago/>} />
                  <Route path="/impresora" element={<Impresora/>} />
                  <Route path="/vendedor" element={<Vendedor/>} />
                  <Route path="/tipodescuento" element={<TipoDescuento/>} />
                  <Route path="/descuento" element={<Descuento/>} />
                  <Route path="/documento" element={<Documento/>} />
                  <Route path="/mesa" element={<Mesa/>} />
                  <Route path="/listaprecio" element={<ListaPrecio/>} />
                  <Route path="/centroproduccion" element={<CentroProduccion/>} />
                  <Route path="/impresoradocumentofolio" element={<ImpresoraDocumentoFolio/>} />
                  <Route path="/comunasii" element={<ComunaSii/>} />
                  <Route path="/articulo" element={<Articulo/>} />
                  <Route path="/producto" element={<Producto/>} />
                  <Route path="/proveedor" element={<Proveedor/>} />
                  <Route path="/cliente" element={<Cliente/>} />

                  <Route path="/tablaila" element={<TablaIla/>} />
                  <Route path="/parametro" element={<Parametro/>} />
                  <Route path="/procesocierre" element={<ProcesoCierre/>} />
                  <Route path="/kardex" element={<Kardex/>} />
                   
                  <Route path="/encabezadodoc" element={<EncabezadoDoc/>} />
                  */}
                
                </Routes>
            </main>
          </div>
        </ThemeProvider>
        )
          :
          <Login/> }
      </ColorModeContext.Provider>
    
     
  );
}

export default App;
