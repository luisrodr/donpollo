// import { useState, useContext } from "react";
// import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
// import { Box, IconButton, Typography, useTheme, Drawer, useMediaQuery } from "@mui/material";
// import { Link } from "react-router-dom";
// import "react-pro-sidebar/dist/css/styles.css";
// import { tokens } from "../../theme";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
// import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
// import { AuthContext } from "../../mycontext";

// const Item = ({ title, to, icon, selected, setSelected }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   return (
//     <MenuItem
//       active={selected === title}
//       style={{ color: colors.grey[100] }}
//       onClick={() => setSelected(title)}
//       icon={icon}
//     >
//       <Typography>{title}</Typography>
//       <Link to={to} />
//     </MenuItem>
//   );
// };

// const SidebarContent = ({ username, selected, setSelected, isCollapsed, setIsCollapsed }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   return (
//     <ProSidebar collapsed={isCollapsed} width={250}>
//       <Menu iconShape="square">
//         {/* LOGO AND MENU ICON */}
//         <MenuItem
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
//           style={{ margin: "10px 0 20px 0", color: colors.grey[100] }}
//         >
//           {!isCollapsed && (
//             <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
//               <Typography variant="h3" color={colors.grey[100]}>
//                 {/* Empresa */}
//               </Typography>
//               <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
//                 <MenuOutlinedIcon />
//               </IconButton>
//             </Box>
//           )}
//         </MenuItem>

//         {/* Perfil */}
//         {!isCollapsed && (
//           <Box mb="25px" textAlign="center">
//             <Box display="flex" justifyContent="center" alignItems="center">
//               <img
//                 alt="profile-user"
//                 width="100px"
//                 height="100px"
//                 src={`../../assets/avatars/avatar-cao-yu.png`}
//                 style={{ cursor: "pointer", borderRadius: "50%" }}
//               />
//             </Box>
//             <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: "10px 0 0 0" }}>
//               {username}
//             </Typography>
//           </Box>
//         )}

//         {/* Opciones */}
//         <Box paddingLeft={isCollapsed ? undefined : "0%"}>
//           <Item title="Ip" to="/ip" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />
//           <Item title="Facturas" to="/facturas" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} />
//         </Box>
//       </Menu>
//     </ProSidebar>
//   );
// };

// const Sidebar = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [selected, setSelected] = useState("Dashboard");
//   const { user } = useContext(AuthContext);
//   const { username } = user;

//   const isMobile = useMediaQuery("(max-width:900px)");
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const toggleDrawer = () => setDrawerOpen(!drawerOpen);

//   return (
//     <Box
//       sx={{
//         "& .pro-sidebar-inner": { background: `${colors.primary[400]} !important` },
//         "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
//         "& .pro-inner-item": { padding: "5px 35px 5px 20px !important" },
//         "& .pro-inner-item:hover": { color: "#868dfb !important" },
//         "& .pro-menu-item.active": { color: "#6870fa !important" },
//       }}
//     >
//       {isMobile ? (
//         <>
//           <IconButton onClick={toggleDrawer} sx={{ m: 1, color: colors.grey[100] }}>
//             <MenuOutlinedIcon />
//           </IconButton>
//           <Drawer
//             anchor="left"
//             open={drawerOpen}
//             onClose={toggleDrawer}
//             PaperProps={{
//               sx: {
//                 width: 250,
//                 "& .pro-sidebar-inner": { background: `${colors.primary[400]} !important` },
//                 "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
//                 "& .pro-inner-item": { padding: "5px 35px 5px 20px !important" },
//                 "& .pro-inner-item:hover": { color: "#868dfb !important" },
//                 "& .pro-menu-item.active": { color: "#6870fa !important" },
//               },
//             }}
//           >
//             <SidebarContent
//               username={username}
//               selected={selected}
//               setSelected={setSelected}
//               isCollapsed={false}
//               setIsCollapsed={setIsCollapsed}
//             />
//           </Drawer>
//         </>
//       ) : (
//         <SidebarContent
//           username={username}
//           selected={selected}
//           setSelected={setSelected}
//           isCollapsed={isCollapsed}
//           setIsCollapsed={setIsCollapsed}
//         />
//       )}
//     </Box>
//   );
// };

// export default Sidebar;





// //////////////////////////////////////


import { useState, useContext } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Drawer, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { AuthContext } from "../../mycontext";

const Item = ({ title, to, icon, selected, setSelected, closeDrawer }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => {
        setSelected(title);
        if (closeDrawer) closeDrawer(); // cierra el drawer en mobile
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const SidebarContent = ({ username, selected, setSelected, isCollapsed, setIsCollapsed, closeDrawer }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ProSidebar collapsed={isCollapsed} width={250}>
      <Menu iconShape="square">
        {/* LOGO AND MENU ICON */}
        <MenuItem
          onClick={() => setIsCollapsed(!isCollapsed)}
          icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
          style={{ margin: "10px 0 20px 0", color: colors.grey[100] }}
        >
          {!isCollapsed && (
            <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
              <Typography variant="h3" color={colors.grey[100]}>
                {/* Empresa */}
              </Typography>
              <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                <MenuOutlinedIcon />
              </IconButton>
            </Box>
          )}
        </MenuItem>

        {/* Perfil */}
        {!isCollapsed && (
          <Box mb="25px" textAlign="center">
            <Box display="flex" justifyContent="center" alignItems="center">
              <img
                alt="profile-user"
                width="100px"
                height="100px"
                src={`../../assets/avatars/avatar-cao-yu.png`}
                style={{ cursor: "pointer", borderRadius: "50%" }}
              />
            </Box>
            <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: "10px 0 0 0" }}>
              {username}
            </Typography>
          </Box>
        )}

        {/* Opciones */}
        <Box paddingLeft={isCollapsed ? undefined : "0%"}>
          <Item
            title="Ip"
            to="/ip"
            icon={<PeopleOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            closeDrawer={closeDrawer}
          />
          <Item
            title="Facturas"
            to="/facturas"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            closeDrawer={closeDrawer}
          />
        </Box>
      </Menu>
    </ProSidebar>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { user } = useContext(AuthContext);
  const { username } = user;

  const isMobile = useMediaQuery("(max-width:900px)");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false); // para pasar a los items

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": { background: `${colors.primary[400]} !important` },
        "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
        "& .pro-inner-item": { padding: "5px 35px 5px 20px !important" },
        "& .pro-inner-item:hover": { color: "#868dfb !important" },
        "& .pro-menu-item.active": { color: "#6870fa !important" },
      }}
    >
      {isMobile ? (
        <>
          <IconButton onClick={toggleDrawer} sx={{ m: 1, color: colors.grey[100] }}>
            <MenuOutlinedIcon />
          </IconButton>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer}
            PaperProps={{
              sx: {
                width: 250,
                "& .pro-sidebar-inner": { background: `${colors.primary[400]} !important` },
                "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
                "& .pro-inner-item": { padding: "5px 35px 5px 20px !important" },
                "& .pro-inner-item:hover": { color: "#868dfb !important" },
                "& .pro-menu-item.active": { color: "#6870fa !important" },
              },
            }}
          >
            <SidebarContent
              username={username}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={false}
              setIsCollapsed={setIsCollapsed}
              closeDrawer={closeDrawer}
            />
          </Drawer>
        </>
      ) : (
        <SidebarContent
          username={username}
          selected={selected}
          setSelected={setSelected}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      )}
    </Box>
  );
};

export default Sidebar;
