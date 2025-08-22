import { useState,useContext } from "react";
import { ProSidebar, Menu, MenuItem ,SubMenu} from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
//import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
//import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
//import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
//import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
//import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
//import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { AuthContext } from "../../mycontext";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [anc] = useState(332);
  const [selected, setSelected] = useState("Dashboard");
  const {user} = useContext(AuthContext);

 
  const { username } = user;

  console.log("el user ",user);

  

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      {/* agregados manualmente revisar ======>>>>> width={anc} */}
      <ProSidebar collapsed={isCollapsed} width={anc}>


        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  {/* Empresa */}
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>

              </Box>
            )}
          </MenuItem>


       {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/avatars/avatar-cao-yu.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {username}
                </Typography>
                {/* <Typography variant="h5" color={colors.greenAccent[500]}>
                  Admin
                </Typography> */}
              </Box>
            </Box>
          )}
          
     
          <Box paddingLeft={isCollapsed ? undefined : "0%"}>
  
         
            
            {/* <SubMenu   title="Menu" >
                  <SubMenu  title="Stock" >

                      <SubMenu  title="Mantencion de maestros">
                        <MenuItem  active={true}>
                          Proveedor
                        <Link to={'/proveedor'} />
                        </MenuItem> 
                        <MenuItem  active={true}>
                          Articulo
                        <Link to={'/articulo'} />
                        </MenuItem>  

                      </SubMenu>

                      <SubMenu  title="Mantencion de tablas" >

                        <MenuItem  active={true}>
                          Centro Consumo
                          <Link to={'/centroconsumo'} />
                        </MenuItem>       
                        <MenuItem  active={true}>
                          Bodega
                          <Link to={'/bodega'} />
                        </MenuItem>  
                        <MenuItem  active={true}>
                          Familia Articulo
                          <Link to={'/familiaarticulo'} />
                        </MenuItem>  
                        <MenuItem  active={true}>
                          Sub Familia Articulo
                          <Link to={'/subfamiliaarticulo'} />
                        </MenuItem>   
                        <MenuItem  active={true}>
                        Centro produccion
                        <Link to={'/centroproduccion'} />
                        </MenuItem> 
                      </SubMenu>

                      <SubMenu  title="Informes" >
                        <MenuItem  active={true}>
                            Informe kardex articulo
                            
                          <Link to={'/kardex'} />
                          </MenuItem> 
                      </SubMenu>

                  </SubMenu>
                  <SubMenu  title="Ventas" >
                      <SubMenu  title="Mantencion de tablas" >
                        <MenuItem  active={true}>
                          FamiliaProductos
                          <Link to={'/familiaproducto'} />
                        </MenuItem>  
                        <MenuItem  active={true}>
                          SubFamiliaProductos
                          <Link to={'/subfamiliaproducto'} />
                        </MenuItem>       
                        <MenuItem  active={true}>
                          AgregadoSubFamiliaProductos
                          <Link to={'/agregadosubfamiliaproducto'} />
                        </MenuItem>         
                        <MenuItem  active={true}>
                          Vendedor
                        <Link to={'/vendedor'} />
                        </MenuItem>
                        <MenuItem  active={true}>
                          Mesa
                        <Link to={'/mesa'} />
                        </MenuItem> 
                        <MenuItem  active={true}>
                          Sector
                        <Link to={'/sector'} />
                        </MenuItem>                         
                        <MenuItem  active={true}>
                          Estado mesa
                          <Link to={'/estadomesa'} />
                          </MenuItem>  
                        <MenuItem  active={true}>
                          Plaza
                          <Link to={'/plaza'} />
                        </MenuItem>
                        <MenuItem  active={true}>
                            Departamento
                          <Link to={'/departamento'} />
                        </MenuItem>   
                        <MenuItem  active={true}>
                            Accion tipo descuento
                          <Link to={'/acciontipodescuento'} />
                        </MenuItem>
                        <MenuItem  active={true}>
                            Descuento
                            <Link to={'/descuento'} />
                        </MenuItem> 
                        <MenuItem  active={true}>
                            Tipo descuento
                            <Link to={'/tipodescuento'} />
                        </MenuItem>  
  
                        <MenuItem  active={true}>
                            Tipo Producto
                            <Link to={'/tipoproducto'} />
                        </MenuItem> 
  
                        <MenuItem  active={true}>
                            Comuna SII
                          <Link to={'/comunasii'} />
                        </MenuItem>                                                 
  

                      </SubMenu>
                      <SubMenu  title="Mantencion clientes" >

                          <MenuItem  active={true}>
                            Cliente
                            <Link to={'/cliente'} />
                          </MenuItem>    
                          <MenuItem  active={true}>
                            Condicion de pago
                            <Link to={'/condicionpago'} />
                          </MenuItem> 
        
                          <MenuItem  active={true}>
                            Zona
                            <Link to={'/zona'} />
                          </MenuItem> 
                          <MenuItem  active={true}>
                            Lista precio
                            <Link to={'/listaprecio'} />
                          </MenuItem> 

                      </SubMenu>  
                      <MenuItem  active={true}>
                            Producto
                          <Link to={'/producto'} />
                      </MenuItem>              
       
                                  
                  </SubMenu>
                  
                  <SubMenu  title="Utilitarios" >
                        <SubMenu  title="Configuracion" >
                          <MenuItem  active={true}>
                            Impresora
                            <Link to={'/impresora'} />
                          </MenuItem> 
                          <MenuItem  active={true}>
                            ImpresoraDocumento Folio
                          <Link to={'/impresoradocumentofolio'} />
                          </MenuItem>   
                          <MenuItem  active={true}>
                            Sector
                            <Link to={'/sector'} />
                          </MenuItem>   
    
                          <MenuItem  active={true}>
                            Terminal
                            <Link to={'/terminal'} />
                          </MenuItem>  
  
                          <MenuItem  active={true}>
                            Tipo documento
                            <Link to={'/documento'} />
                          </MenuItem>   
    
                          <MenuItem  active={true}>
                              Opcion
                            <Link to={'/opcion'} />
                          </MenuItem> 
                          <MenuItem  active={true}>
                              Tabla Ila
                            <Link to={'/tablaila'} />
                          </MenuItem> 
                          <MenuItem  active={true}>
                              Parametros     
                            <Link to={'/parametro'} />
                          </MenuItem>  
                          <MenuItem  active={true}>
                              Proceso de cierre     
                            <Link to={'/procesocierre'} />
                          </MenuItem>                                                     
                        </SubMenu>   
                  </SubMenu>            
            </SubMenu> */}
         
            {/* <Item
              title="Documentos plantilla"
              to='/encabezadodoc'
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            */}
            <Item
              title="Ip"
              to="/ip"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />            

            <Item
              title="Facturas"
              to="/facturas"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
          {/*

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
           
            <Item
              title="Manage Team"
              to="/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
           
            <Item
              title="Contacts Information"
              to="/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
    
            <Item
              title="Invoices Balances"
              to="/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
           
           

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
   
            <Item
              title="Profile Form"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
    
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
             <Item
              title="Downloads"
              to="/downloads"
              icon={<ArrowDownwardIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
            */}

          </Box>
          
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
