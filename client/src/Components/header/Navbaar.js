import { React, useContext, useEffect, useState } from 'react'
import './Navbaar.css';
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
//import * as React from 'react';
//import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Rightheader from './Rightheader';
import { NavLink, useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { LoginContext } from "../context/ContextProvider";
import LogoutIcon from '@mui/icons-material/Logout'
import { ToastContainer, toast } from 'react-toastify';
import { UseSelector, useSelector } from 'react-redux/es/hooks/useSelector';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';



const Navbaar = () => {


    const { account, setAccount } = useContext(LoginContext);
    const history = useNavigate();
    
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [text, setText] = useState();
    const { products } = useSelector(state => state.getproductsdata);

    const [liopen, setLiopen] = useState(true);




    const [dropen, setDropen] = useState(false);
    console.log(account);
    const getdetailsvaliduser = async () => {
        const res = await fetch("/validuser", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const data = await res.json();
        console.log(data);

        if (res.status !== 201) {
            console.log("first login");
        } else {
            console.log("cart add ho gya hain");
            setAccount(data);
        }
    };


    

    /*const logoutuser = async () => {
        const res2 = await fetch("/lougout", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const data2 = await res2.json();
        console.log(data2);

        if (res2.status !== 201) {
            console.log("first login");
        } else {
            console.log("cart add ho gya hain");
            alert("logout");
            history("/");
            setAccount(false);
            
        }
    };*/
    // for logout
    const logoutuser = async () => {
        const res2 = await fetch("/logout", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const data2 = await res2.json();
         console.log(data2);

        if (!res2.status === 201) {
            const error = new Error(res2.error);
            throw error;
        } else {
            setAccount(false);
            //setOpen(false)
            toast.success("user Logout 😃!", {
                position: "top-center"
            });
            history("/");
        }
    }

    const handelopen = () => {
        setDropen(true);
    }

    const handleClosedr = () => {
        setDropen(false)
    }
    const getText = (text) => {
        setText(text)
        setLiopen(false)
    }

    useEffect(() => {
        getdetailsvaliduser();
    }, []);



    return (
        <header>
            <nav>
                <div className='left'>
                    <IconButton className="hamburgur" onClick={handelopen}>
                        <MenuIcon style={{ color: "#fff" }} />
                    </IconButton>
                    <Drawer open={dropen} onClose={handleClosedr}>
                        <Rightheader logclose={handleClosedr} logoutuser={logoutuser}/>
                    </Drawer>

                    <div className='navlogo'>
                        <NavLink to="/"> <img src="./amazon_PNG25.png" alt="logo" /> </NavLink>
                    </div>
                    <div className='nav_searchbaar'>
                        <input typr="text" name=""
                            onChange={(e) => getText(e.target.value)}
                            placeholder="Search Your Products"  />
                        <div className='search_icon'>
                            <SearchIcon id=" search" />

                        </div>
                        {
                            text &&
                            <List className="extrasearch" hidden={liopen}>
                                {
                                    products.filter(product => product.title.longTitle.toLowerCase().includes(text.toLowerCase())).map(product => (
                                        <ListItem>
                                            <NavLink to={`/getproductsone/${product.id}`} onClick={() => setLiopen(true)}>
                                                {product.title.longTitle}
                                            </NavLink>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        }

                    </div>

                </div>
                <div className='right'>
                    <div className="nav_btn">
                        <NavLink to="/login">Sign in</NavLink>
                    </div>

                    <div className='cart_btn'>

                        {
                            account ? <NavLink to="/buynow">
                                <Badge badgeContent={account.carts.length} color="primary">
                                    <ShoppingCartIcon id="icon" />
                                </Badge>

                            </NavLink> : <NavLink to="/login">
                                <Badge badgeContent={0} color="primary">
                                    <ShoppingCartIcon id="icon" />

                                </Badge>
                            </NavLink>
                        }
                        <p> Cart</p>
                    </div>

                    {
                        account ? <Avatar className='avtar2'
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}> {account.fname[0].toUpperCase()}
                        </Avatar> :
                            <Avatar className='avtar'
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}>
                            </Avatar>
                    }

                    <div>


                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >


                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            {
                            account ? <MenuItem onClick={handleClose} style={{ margin: 10 }} onClick={logoutuser}> <LogoutIcon style={{fontSize:16,marginRight:3}}/>Logout</MenuItem>:""
                            }


                            
                        </Menu>
                    </div>

                    <ToastContainer />
                </div>
            </nav>
        </header>
    )
}
export default Navbaar