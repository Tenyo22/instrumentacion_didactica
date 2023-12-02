import { IconButton, Menu, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import { deleteToken } from '../js/auth/token'

const Navbar = ({ home, periodo, usuario }) => {

    const [anchorEl, setAnchorEl] = useState(null)

    const handleMenu = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const handleExit = () => {
        setAnchorEl(null)
        deleteToken()
    }

    return (
        <>
            <nav className="navbar navbar-dark " style={{ "backgroundColor": "#6AA84F" }}>
                <div className="container-fluid d-flex align-items-center justify-context-between">
                    <a className="navbar-brand" href={home} >
                        <i className=' bi bi-house-fill fs-1 text-black'></i>
                    </a>
                    <div className="flex-grow-1 col-sm-8 text-center">
                        <h4>
                            Ingenieria en Sistemas Computacionales - Periodo {periodo}
                        </h4>
                    </div>
                    <h5 className='d-flex align-items-center justify-content-arround '>
                        {usuario}
                        <div>
                            <IconButton
                                size='large'
                                aria-label='account of current user'
                                aria-controls='menu-appbar'
                                aria-haspopup='true'
                                onClick={handleMenu}
                                color='inherit'>
                                <i className='bi bi-person-circle fs-1'></i>
                            </IconButton>
                            <Menu
                                id='menu-appbar'
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}>
                                <MenuItem onClick={handleExit}>Exit</MenuItem>
                            </Menu>
                        </div>
                    </h5>
                </div>
            </nav>
        </>
    )
}

export default Navbar