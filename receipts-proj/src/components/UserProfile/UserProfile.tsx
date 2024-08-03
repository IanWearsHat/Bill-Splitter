import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

const getSignedURL =
  "https://5xx9atbspi.execute-api.us-east-2.amazonaws.com/default/generateURL";
// const getSignedURL = "http://localhost:3000/generateURL";

export default function UserProfile() {
  const { user, setLoginUser } = useContext(AuthContext);

  const [imageKey, setImageKey] = useState(0);

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const inputFile = useRef<HTMLInputElement | null>(null);

  async function putPicture(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const files = event.target.files;
      console.log("before file");
      let file;
      if (files && files.length > 0) {
        file = files[0];
      } else {
        return;
      }
      console.log("file");

      const token = localStorage.getItem("token");
      if (!token) return;
      console.log("token");

      let resolvedURL = null;
      await fetch(getSignedURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      })
        .then((data) => data.json())
        .then((obj) => {
          resolvedURL = obj.resolvedURL;
          setLoginUser(obj.user);
        });

      if (!resolvedURL) return;
      console.log(resolvedURL);

      const response = await fetch(resolvedURL, {
        method: "PUT",
        body: file,
      });

      if (response.ok) {
        console.log("File uploaded successfully!");
        setImageKey(Date.now());
      } else {
        console.error("Error uploading file:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  function logOut() {
    localStorage.setItem("token", "");
    setLoginUser("")
    navigate("/");
  }

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              key={imageKey}
              sx={{ width: 32, height: 32, border: 2 }}
              src={
                user &&
                `https://receipts-profile-images.s3.us-east-2.amazonaws.com/${user}.png?t=${imageKey}`
              }
            ></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        onChange={putPicture}
      />
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            if (!inputFile.current) return;
            inputFile.current.click();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Change profile picture
        </MenuItem>

        <MenuItem onClick={logOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
