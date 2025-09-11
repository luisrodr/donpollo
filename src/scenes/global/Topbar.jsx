import { Box, IconButton, useTheme, useMediaQuery, Avatar } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import { usePopover } from "../../hooks/use-popover";
import { AccountPopover } from "./account-popover";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const accountPopover = usePopover();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={isMobile ? 1 : 2}
      alignItems="center"
    >
      {/* SEARCH BAR - oculto en mobile */}
      {!isMobile && (
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          px={1}
        >
          {/* Espacio para buscador si lo quieres habilitar */}
        </Box>
      )}

      {/* ICONS */}
      <Box display="flex" alignItems="center" gap={isMobile ? 0.5 : 1}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
          ) : (
            <LightModeOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>

        <Avatar
          onClick={accountPopover.handleOpen}
          ref={accountPopover.anchorRef}
          sx={{
            cursor: "pointer",
            height: isMobile ? 32 : 40,
            width: isMobile ? 32 : 40,
          }}
          src="/assets/avatars/avatar-cao-yu.png"
        />
      </Box>

      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
    </Box>
  );
};

export default Topbar;
