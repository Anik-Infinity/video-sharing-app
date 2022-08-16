import { Divider } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { VideoCallOutlined, WidgetsOutlined } from "@material-ui/icons";
import React, {useState} from "react";
import "../css/header.css";

import { useNavigate } from "react-router-dom"
import AddVideoModal from "./AddVideoModal";






const  Header = () => {
  const navigate = useNavigate();
  

  const settings = [{name: 'Logout', func: () => {
    localStorage.clear();
    navigate('/')
  }}];

  const loggedIn = JSON.parse(localStorage.getItem('signed_in'));
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [addModal, setAddModal] = useState(false);

  return (
    <>
    <AddVideoModal setAddModal={setAddModal} open={addModal}/>
    <div className="header">
      <div className="logo-title-container">
      <img onClick={() => navigate("/")} className="logo" src={require("../assets/images/onnorokom_logo.png")} alt="onnorokom_logo" />
      <h2 className="title">Onnorokom Pathshala</h2>
      </div>
      <div className="user-container">
        {loggedIn && <VideoCallOutlined onClick={() => setAddModal(true)} className="header-icon"/>}
        {/* {loggedIn && <WidgetsOutlined className="header-icon"/>} */}
        {/* <Avatar src={require("../assets/images/onnorokom_logo.png")} className="avatar"/> */}
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {<Avatar onClick={() => !loggedIn && navigate("auth")} alt="user"src={loggedIn &&  require("../assets/images/onnorokom_logo.png")} />}
              </IconButton>
            </Tooltip>
            {loggedIn && <Menu
              sx={{ mt: '50px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                  <Typography onClick={setting.func} textalign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>}
          </Box>
      </div>
    <Divider/>

    </div>
    </>
  )
}
export default Header;
